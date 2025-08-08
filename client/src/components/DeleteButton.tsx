type DeleteButtonProps = {
  onDelete: () => void;
};

const DeleteButton = ({ onDelete }: DeleteButtonProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this character?")) {
        onDelete();
      }
    }}
    className="absolute bottom-5 right-5 bg-red-500 text-white px-2 py-1 rounded-full z-10 hover:bg-red-600 transition-colors aspect-square cursor-pointer"
    aria-label="Delete character"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#e3e3e3"
    >
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  </button>
);

export default DeleteButton;
