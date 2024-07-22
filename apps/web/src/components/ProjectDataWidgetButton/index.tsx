import { ClosedHeroIcon, OpenedHeroIcon } from '@/components/Svg';
import type { ProjectDataWidgetButtonProps } from './ProjectDataWidgetButton.interfaces';

const styles = {
  mainButton: 'flex items-center ml-5 cursor-pointer',
};

export const ProjectDataWidgetButton = ({
  toggleWidget,
  setToggleWidget,
}: ProjectDataWidgetButtonProps): React.ReactElement => {
  return (
    <button
      className={styles.mainButton}
      onClick={() => setToggleWidget(!toggleWidget)}
      type="button"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="#858699">
        <title>Icon</title>
        {toggleWidget ? <ClosedHeroIcon /> : <OpenedHeroIcon />}
      </svg>
    </button>
  );
};
