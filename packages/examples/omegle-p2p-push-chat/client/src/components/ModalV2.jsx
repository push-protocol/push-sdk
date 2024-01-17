const Modal = ({onClose, text, children}) => {
  return (
    <dialog id="my_modal_4" className="modal" open="true">
      <div className="modal-box w-11/12 max-w-xl">
        <h3 className="font-bold text-lg">Info</h3>
        <p className="py-4">{text}</p>
        <div className="modal-action">
          <form method="dialog">{children}</form>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
