import React from "react";
import "../App.css";

type ModalPropType = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onHandleSubmit: () => void;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  onHandleSubmit,
}: ModalPropType) => {
  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        {children}
        <div className="modal-action-area">
          <button
            className="modal-action-btn modal-action-close-btn"
            onClick={onClose}
          >
            Close
          </button>
          <button className="modal-action-btn" onClick={onHandleSubmit}>
            Submit
          </button>
        </div>
      </div>
      <div
        className={`backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>
    </div>
  );
};

export default Modal;
