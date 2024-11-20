import React, { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import PageContext from "../context/pagesContext";
import EmployerEmployeeGroupBtns from "./EmployerEmployeeGroupBtns";
import { useLoginMutation } from "../slices/authApiSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const [login] = useLoginMutation();

  const {
    setOpenLogRegModal,
    setIsLogin,
    setWhosLogin,
    selectedLoginType,
    setShowForgetPasswordForm,
    setShowRegisterForm,
    successToast,
    errorToast,
  } = useContext(PageContext);

  // Load email from localStorage if it exists
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login({ email, password }).then((res) => {
      if (res.data) {
        successToast("Login Successfully");
        setOpenLogRegModal(false);
        setIsLogin(true);
        selectedLoginType === "employee"
          ? setWhosLogin("employee")
          : setWhosLogin("employer");

        // If "Remember Me" is checked, save the email to localStorage
        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("savedEmail");
        }
      } else {
        errorToast("Email or Password has not been found!");
        setEmail("");
        setPassword("");
      }
    });
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleLoginSubmit}>
      <div className="flex justify-center">{<EmployerEmployeeGroupBtns />}</div>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          name="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@company.com"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="relative">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"} // Toggle input type
          name="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {/* Eye icon for toggling password visibility */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)} // Toggle the showPassword state
          className="absolute right-2 top-2/3 transform -translate-y-1/2"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
          {/* Show the appropriate icon */}
        </button>
      </div>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
              checked={rememberMe} // Bind checkbox state
              onChange={() => setRememberMe(!rememberMe)} // Toggle rememberMe state
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="remember"
              className="text-gray-500 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForgetPasswordForm(true);
          }}
          className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Forget Password?
        </button>
      </div>
      <button
        type="submit"
        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Sign in
      </button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don’t have an account yet?{" "}
        <button
          type="button"
          onClick={() => {
            setShowRegisterForm(true);
          }}
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Sign up
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
