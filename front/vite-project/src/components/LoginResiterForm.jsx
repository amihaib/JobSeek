// Mine 9.8
import React, { useContext } from "react";
import PageContext from "../context/pagesContext";
import { IoIosClose } from "react-icons/io";

import ForgetPasswordForm from "./ForgetPasswordForm";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const LoginResiterForm = () => {
  const {
    setOpenLogRegModal,
    showForgetPasswordForm,
    setShowForgetPasswordForm,
    showRegisterForm,
  } = useContext(PageContext);

  const closeModal = () => {
    setOpenLogRegModal(false);
    setShowForgetPasswordForm(false);
  };

  return (
    <section className="bg-gray-900 rounded-lg">
      <button
        type="button"
        data-autofocus
        onClick={closeModal}
        className="mt-3 inline-flex w-full justify-center rounded-md px-4 pt-3 text-sm font-semibold text-white shadow-sm  sm:mt-0 sm:w-auto"
      >
        <IoIosClose
          onClick={closeModal}
          className="text-4xl text-white text-right rounded-md ring-1 ring-gray-600   hover:bg-gray-100"
        />
      </button>
      <div className="flex flex-col items-center justify-center px-6 pb-8 mx-auto ">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {showRegisterForm ? (
              <RegisterForm />
            ) : showForgetPasswordForm ? (
              <ForgetPasswordForm />
            ) : (
              <LoginForm />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginResiterForm;
