import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import BackArrow from "../src/components/BackArrow";

const EmployerAccountSettings = () => {
  const [isEmailForm, setIsEmailForm] = useState(true); // Toggle between email and password forms
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpModalOpen, setOtpModalOpen] = useState(false); // OTP modal state
  const [enteredOtp, setEnteredOtp] = useState(""); // Handling OTP state
  const [isEmailChange, setIsEmailChange] = useState(true); // Track whether the OTP is for email change or password change
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     await axios.get("http://localhost:8000/api/employer/logout", {
  //       withCredentials: true,
  //     });
  //     alert("User has been signed out");
  //     navigate("/");
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //     alert("Failed to log out. Please try again.");
  //   }
  // };

  // Handle Email Change Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8000/api/otp/sendOtpForEmailChangeEmployer",
        {
          email, // Send the new email
        },
        {
          withCredentials: true, // Ensures cookies are sent with the request
        }
      );

      // Set modal for email change
      setIsEmailChange(true);
      setOtpModalOpen(true); // Open OTP modal
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtpAndChangeEmail = async () => {
    try {
      // Send OTP and new email for verification
      await axios.post(
        "http://localhost:8000/api/otp/verifyOtpAndChangeEmailEmployer",
        {
          otp: enteredOtp, // User-entered OTP
          email, // The new email entered
        },
        {
          withCredentials: true, // Send cookies with the request (JWT)
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Close OTP modal and notify success
      setOtpModalOpen(false);
      alert("Email changed successfully!");

      // Log the user out after a successful email change
      handleLogout();
    } catch (error) {
      console.error("Error verifying OTP or changing email:", error);
      alert("Invalid OTP or email change failed.");
    }
  };

  // Handle Password Change Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate passwords
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // Send OTP for password change verification
      await axios.post(
        "http://localhost:8000/api/otp/sendOtpEmployer",
        {},
        {
          withCredentials: true, // Send cookies with the request (JWT)
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Set modal for password change
      setIsEmailChange(false);
      setOtpModalOpen(true); // Open OTP modal
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOtpAndChangePassword = async () => {
    try {
      // Send OTP and new password for verification
      await axios.post(
        "http://localhost:8000/api/otp/verifyOtpAndChangePasswordEmployer",
        {
          otp: enteredOtp, // User-entered OTP
          password, // The new password
          confirmPassword, // The confirmation password
        },
        {
          withCredentials: true, // Send cookies with the request (JWT)
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Close the OTP modal and notify success
      setOtpModalOpen(false);
      alert("Password changed successfully! Logging out...");

      // Log the user out after password change
      handleLogout();
    } catch (error) {
      console.error("Error verifying OTP or changing password:", error);
      alert("Invalid OTP or password mismatch.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      {/* Back Arrow to navigate back to profile */}
      <div className="flex justify-start mb-4">
        <BackArrow color={"black"} url={-1} />
      </div>

      {/* Form Toggle Buttons */}
      <div className="flex justify-center space-x-6 mb-6">
        <button
          className={`py-2 px-6 border-b-2 ${
            isEmailForm
              ? "text-orange-500 border-orange-500"
              : "text-gray-500 border-transparent"
          }`}
          onClick={() => setIsEmailForm(true)}
        >
          עדכון כתובת אימייל
        </button>
        <button
          className={`py-2 px-6 border-b-2 ${
            !isEmailForm
              ? "text-orange-500 border-orange-500"
              : "text-gray-500 border-transparent"
          }`}
          onClick={() => setIsEmailForm(false)}
        >
          עדכון סיסמא
        </button>
      </div>

      {/* Forms Container */}
      <div className="transition-transform duration-500 ease-in-out">
        {/* Email Update Form */}
        {isEmailForm && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700">אימייל</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="הכנס אימייל חדש"
                className="w-full p-2 mt-1 border border-gray-300 rounded"
              />
            </div>

            <button
              onClick={handleEmailSubmit}
              className="w-full bg-orange-500 text-white py-2 rounded mt-4"
            >
              שמור שינויים
            </button>
          </div>
        )}

        {/* Password Update Form */}
        {!isEmailForm && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700">סיסמא</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הכנס סיסמא חדשה"
                className="w-full p-2 mt-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">אימות סיסמא</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="הכנס שוב את הסיסמא"
                className="w-full p-2 mt-1 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handlePasswordSubmit} // Submitting the form opens the OTP modal
              className="w-full bg-orange-500 text-white py-2 rounded mt-4"
            >
              שמור שינויים
            </button>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      <Modal
        isOpen={isOtpModalOpen}
        onRequestClose={() => setOtpModalOpen(false)}
      >
        <h3 className="text-gray-700 text-lg">Enter OTP</h3>
        <p>Check your email for the OTP code.</p>
        <input
          type="text"
          value={enteredOtp} // Use the correct state for enteredOtp
          onChange={(e) => setEnteredOtp(e.target.value)} // Correctly update the state
          placeholder="Enter OTP"
          className="w-full p-2 mt-2 border border-gray-300 rounded"
        />

        {/* Show only relevant OTP button based on form */}
        {isEmailChange ? (
          <button
            onClick={handleVerifyOtpAndChangeEmail}
            className="w-full bg-blue-500 text-white py-2 rounded mt-4"
          >
            Submit OTP for Email Change
          </button>
        ) : (
          <button
            onClick={handleVerifyOtpAndChangePassword}
            className="w-full bg-orange-500 text-white py-2 rounded mt-4"
          >
            Submit OTP for Password Change
          </button>
        )}
      </Modal>
    </div>
  );
};

export default EmployerAccountSettings;
