import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg relative p-4 w-8/12">
        {children}
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">
          X
        </button>
      </div>
    </div>
  );
};

export default Modal;
