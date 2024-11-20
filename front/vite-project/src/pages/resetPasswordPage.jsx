import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./resetPasswordPage.css";
import PageContext from "../context/pagesContext";
import { useResetPasswordMutation } from "../slices/authApiSlice";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { successToast, errorToast } = useContext(PageContext);
  const [resetPassword] = useResetPasswordMutation();

  // Extract the token from the URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      errorToast("Both fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      errorToast("Passwords do not match.");
      return;
    }

    resetPassword({ token, password, confirmPassword }).then((data) => {
      if (data.data) {
        successToast("Password reset successfully.");
        navigate("/");
      } else {
        errorToast(data.error.data.message);
      }
    });
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
        </div>
        <button type="submit" className="reset-password-btn">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
