import React, { useContext, useState, Component } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { useLogoutUserMutation } from "../slices/userApiSlice";
import {
  useSendOtpMutation,
  useValidateOtpMutation,
} from "../slices/optApiSlice";
import PageContext from "../context/pagesContext";
import OtpInput from "react-otp-input";
import OtpModal from "./OtpModal";
import BackArrow from "./BackArrow";

const AccountSettings = () => {
  const navigate = useNavigate();
  Modal.setAppElement("#root");
  const [isEmailForm, setIsEmailForm] = useState(true); // Toggle between email and password forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // OTP modal state
  const [enteredOtp, setEnteredOtp] = useState(""); // Handling OTP state
  const [isEmailChange, setIsEmailChange] = useState(true); // Track whether the OTP is for email change or password change
  const { setIsLogin, isOtpModalOpen, setOtpModalOpen, errorToast } =
    useContext(PageContext);
  const [logoutUser] = useLogoutUserMutation();
  const [sendOtp] = useSendOtpMutation();
  // const [validateOtp] = useValidateOtpMutation();

  const handleLogout = async () => {
    logoutUser().then(() => {
      alert("User has been signed out");
      setIsLogin(false);
      navigate("/");
    });
  };

  // Handle Email Change Submit
  const handleSubmit = (e) => {
    if (
      email ||
      (password !== "" &&
        confirmPassword !== "" &&
        password === confirmPassword)
    ) {
      sendOtp().then((res) => {
        setOtpModalOpen(true);
      });
    } else {
      if (password === "" || confirmPassword === "" || email === "") {
        errorToast("All Fields Are Require!");
      } else if (password !== confirmPassword) {
        errorToast("The Passwords are Not Match!");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      {/* Back Arrow to navigate back to profile */}
      <div className="flex justify-start mb-4">
        <BackArrow color={"gray-700"} url={-1} />
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
                required
              />
            </div>

            <button
              onClick={handleSubmit}
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
                required
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
                required
              />
            </div>
            <button
              onClick={handleSubmit} // Submitting the form opens the OTP modal
              className="w-full bg-orange-500 text-white py-2 rounded mt-4"
            >
              שמור שינויים
            </button>
          </div>
        )}
      </div>
      {isOtpModalOpen && (
        <OtpModal
          email={email}
          password={password}
          confirmPassword={confirmPassword}
        />
      )}
    </div>
  );
};

export default AccountSettings;
