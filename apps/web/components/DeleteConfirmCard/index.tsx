import type React from 'react';

import type { DeleteConfirmCardProps } from './DeleteConfirmCard.interfaces';

const style = {
  deleteCardBg:
    'flex flex-col justify-center mx-auto bg-gray-200 ring-1 ring-black/10 shadow px-4 py-4 rounded-md text-center  max-w-sm',
  titleText: 'text-xl',
  buttonDiv: '',
  buttonCancel:
    'bg-cyan-500 rounded-lg m-3 py-2 px-4 border-2 hover:shadow-lg active:shadow-lg active:bg-cyan-400',
  buttonDelete:
    'bg-cyan-500 rounded-lg m-3 py-2 px-4  border-2 hover:bg-destructive/80 hover:shadow-lg active:bg-destructive active:shadow-none  ',
};

const DeleteConfirmCard = ({
  onClose,
  handleDeleteTaskCard,
  deleteFade,
  task,
}: DeleteConfirmCardProps): React.ReactElement => {
  const handleCancel = () => {
    onClose();
  };

  const handleDeleteButton = () => {
    handleDeleteTaskCard(task);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center ${
        deleteFade ? 'opacity-100 transition-opacity' : 'opacity-0 transition-opacity'
      } `}
    >
      <div className={style.deleteCardBg}>
        <span className={style.titleText}>Are you sure you want to delete this task ?</span>

        <div className={style.buttonDiv}>
          <button type="button" className={style.buttonCancel} onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className={style.buttonDelete} onClick={handleDeleteButton}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmCard;
