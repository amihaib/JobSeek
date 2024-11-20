import React, { useState, Component, useContext } from "react";
import PageContext from "../context/pagesContext";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useValidateOtpMutation } from "../slices/optApiSlice";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";

// import OtpInput from "react-otp-input";

const OtpModal = ({ email, password, confirmPassword }) => {
  const { isOtpModalOpen, setOtpModalOpen, successToast, errorToast } =
    useContext(PageContext);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [validateOtp] = useValidateOtpMutation();

  const handleSubmitform = (e) => {
    const dataTochange = {
      email: email ? email : null,
      password: password ? password : null,
    };
    validateOtp({ dataTochange, otp }).then((data) => {
      if (data.data) {
        email
          ? successToast("Email has been changed")
          : successToast("Password has been changed");

        setOtpModalOpen(false);
        navigate(-1);
      } else {
        if (data.error.data.message === "User not found") {
          errorToast("Otp code is not valid!");
        } else {
          errorToast("An Error has occur!");
        }
      }
    });
  };

  return (
    <Dialog
      open={isOtpModalOpen}
      onClose={setOtpModalOpen}
      className="relative z-10 jus"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
        <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-transparent text-left  transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
              <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
                <p className="text-[15px] text-slate-500">
                  Enter the 6-digit verification code that was sent to your
                  Email.
                </p>
              </header>
              <div className="flex flex-col items-center justify-center gap-3">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                  containerStyle="flex justify-around"
                  inputStyle="text-5xl rounded-lg border border-black"
                />
                <button
                  onClick={handleSubmitform}
                  className=" border-black w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                >
                  Verify Account
                </button>
              </div>

              <div className="text-sm text-slate-500 mt-4">
                Didn't receive code?{" "}
                <a
                  className="font-medium text-indigo-500 hover:text-indigo-600"
                  href="#0"
                >
                  Resend
                </a>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default OtpModal;
