import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { DeleteButtonProps } from './DeleteButton.interfaces';

const styles = {
  deleteButton:
    'mt-3 bg-destructive py-1.5 mb-3 px-3 rounded text-destructive-foreground border border-redDelete shadow-lg active:shadow-lg hover:shadow-redGlow',
  deleteButtonLight:
    'mt-3 bg-destructive py-1.5 mb-3 px-3 rounded border border-redDelete shadow-lg active:shadow-lg hover:shadow-redGlow text-destructive-foreground',
};

const DeleteButton = ({ description, handleAction }: DeleteButtonProps) => {
  const { theme } = useAppSelector((state) => state.userSettings);

  const handleStyle = () => (theme === 'dark' ? styles.deleteButton : styles.deleteButtonLight);

  return (
    <div>
      <button type="button" className={handleStyle()} onClick={handleAction}>
        {description}
      </button>
    </div>
  );
};

export default DeleteButton;
