// Mine 9.8
import React, { useContext, useState } from "react";
import PageContext from "../context/pagesContext";
import { useForgotPasswordMutation } from "../slices/authApiSlice";
import BackArrow from "./BackArrow";
import { FaArrowLeft } from "react-icons/fa";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const { setShowForgetPasswordForm, successToast, errorToast } =
    useContext(PageContext);
  const [forgotPassword] = useForgotPasswordMutation();
  const handleForgetPasswordForm = (e) => {
    e.preventDefault();
    forgotPassword({ email }).then((res) => {
      if (res.data) {
        successToast("Passwordhas been sent to your email.");
        setShowForgetPasswordForm(false);
      } else {
        errorToast("Email is not found!");
      }
    });
  };
  return (
    <div>
      <FaArrowLeft
        className="text-white cursor-pointer mb-6"
        size={30}
        onClick={() => setShowForgetPasswordForm(false)} // Navigate back to profile
      />
      <form
        className="space-y-4 md:space-y-6"
        onSubmit={handleForgetPasswordForm}
      >
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Forgot Password ?
        </h1>
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
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@company.com"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;
