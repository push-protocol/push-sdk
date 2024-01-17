// components/Modal.js

import React from "react";
import styled from "styled-components";

// Styled component for the modal overlay
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

// Styled component for the modal content
const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

// Modal component
const Modal = ({onClose, text}) => {
  return (
    <dialog id="my_modal_4" className="modal" open="true">
      <div className="modal-box w-11/12 max-w-xl">
        <h3 className="font-bold text-lg">Info</h3>
        <p className="py-4">{text}</p>
        <div className="modal-action">
          <form method="dialog">
            <button onClick={onClose} className="btn">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
