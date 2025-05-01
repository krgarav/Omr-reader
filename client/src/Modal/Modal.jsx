import React from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-auto p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          <IoClose size={24} />
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
