const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: [true, "must type firstname"],
    },
    lastName: {
      type: String,
      // required: [true, "must type lastname"],
    },
    password: {
      type: String,
      required: [true, "must type password"],
      minLength: [8, "the password must be longer than 8 chars"],
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          // Only run this validator if the password field is being modified
          return !this.isModified("password") || this.password === el;
        },
        message: "the password doesn't match",
      },
    },
    email: {
      type: String,
      required: [true, "type email"],
      validate: {
        validator: (val) => validator.isEmail(val),
        message: "email is not valid",
      },
      unique: true,
    },
    phoneNumber: {
      type: Number,
    },
    city: {
      type: String,
    },
    experience: {
      type: Number,
    },
    visibleToEmployers: { type: Boolean, default: false },
    profession: {
      type: String,
    },

    profilePicture: {
      type: String,
    },
    newAccount: {
      type: Boolean,
      default: true,
    },
    reviews: [
      {
        employerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employer",
        },

        ratings: {
          resume: {
            type: Number,
          },
          interview: {
            type: Number,
          },
          tests: {
            type: Number,
          },
        },
        notes: {
          type: String,
        },
      },
    ],
    newNotifications: {
      type: Number,
      default: 0,
    },
    notifications: [
      {
        employerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employer",
        },
        message: {
          type: String,
        },
        read: {
          type: Boolean,
          default: false,
        },
        dueDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,

    // Add fields for OTP and OTP expiration
    otp: String, // The OTP code
    otpExpires: Date, // OTP expiration time
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.virtual("cvs", {
  ref: "CV", // Reference the 'CV' model
  localField: "_id", // The user _id
  foreignField: "user", // The field in the CV model that references the user
});

// Custom validation function to limit the number of CVs to 4
function arrayLimit(val) {
  return val.length <= 4;
}

// refers to curr doc before saving in the DB
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
  }
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});
userSchema.pre("save", function (next) {
  // If notifications are modified, adjust the newNotifications count
  const readNotificationsCount = this.notifications.filter(
    (n) => n.read
  ).length;

  // Update newNotifications based on read notifications
  this.newNotifications = this.notifications.length - readNotificationsCount;

  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 5 * 60 * 100;
  return resetToken;
};

userSchema.methods.checkPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

// Create and set OTP
userSchema.methods.createOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
  this.otp = otp;
  this.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  return otp; // Return the OTP so it can be sent to the user
};

const User = mongoose.model("User", userSchema);
module.exports = User;
