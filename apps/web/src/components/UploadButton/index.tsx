import { useContext, useRef } from 'react';
import { paperclipIcon } from '@/components/Svg';
import { EditorContext } from '@/components/EditorContext';

const styles = {
  button: 'absolute bottom-4 right-32 py-2 px-2 text-sm text-foreground rounded-md cursor-pointer',
  error: 'absolute bottom-4 right-28 text-red-500',
};

const errorMessage = {
  imageUploadsExceeded: 'Maximum images reached.',
  fileSizeExceeded: 'File size exceeded 10mb limit, please choose another file.',
};

const UploadButton = () => {
  const { handleImageUpload, mediaError } = useContext(EditorContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <button type="button" className={styles.button} onClick={() => fileInputRef.current?.click()}>
        {paperclipIcon()}
      </button>

      <span className={styles.error}>
        {mediaError.fileSizeExceeded && errorMessage.fileSizeExceeded}
        {mediaError.imageUploadsExceeded && errorMessage.imageUploadsExceeded}
      </span>
    </>
  );
};

export default UploadButton;
