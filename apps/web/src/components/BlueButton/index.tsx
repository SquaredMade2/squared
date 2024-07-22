import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { Props } from '@/components/BlueButton/BlueButton.interfaces';

const styles = {
  updateButtonLight:
    'mt-5 bg-blueGlowLight py-2 px-3 rounded mb-8 text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer',
  updateButtonDark:
    'mt-5 bg-blueGlow py-2 px-3 rounded mb-8 text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer',
};

const BlueButton: React.FunctionComponent<Props> = ({ description, handleAction }) => {
  const { theme } = useAppSelector((state) => state.userSettings);

  const handleStyle = () => (theme === 'dark' ? styles.updateButtonDark : styles.updateButtonLight);

  const handleClick = () => {
    if (handleAction) {
      handleAction();
    } else {
      return;
    }
  };

  return (
    <div>
      <button className={handleStyle()} onClick={handleClick} type="button">
        {description}
      </button>
    </div>
  );
};

export default BlueButton;
