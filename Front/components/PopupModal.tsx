// components/PopupModal.tsx
import React, { ReactElement } from 'react';

interface IPopup
    { 
        isOpen:boolean, onClose:()=>void, children :ReactElement

    }
const PopupModal = ({ isOpen, onClose, children }:IPopup) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="dark:bg-black light:bg-gray-100  rounded-xl p-9 w-100  relative shadow-lg">
        <button
          className="absolute top-2 right-2  hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default PopupModal;
