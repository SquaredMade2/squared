import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { ProjectDataLabel } from '../../Svg';
import type { ProjectsTabProps } from './ProjectsTabProps';

export const ProjectsTab = ({ tasksList }: ProjectsTabProps) => {
  const lightSettings = useAppSelector((state) => state.userSettings).theme;

  const styles = {
    tabContainer: `flex flex-col items-center mt-10 m-5 w-full h-80 ${
      lightSettings === 'light' ? 'text-black' : 'text-white'
    }`,
    tab: 'flex flex-row items-center w-full h-12 text-sm my-1 hover:bg-accent duration-200 p-2 rounded-lg',
    tabAmount: 'ml-auto',
    tabSvg: 'm-2',
    tabLabel:
      'flex flex-row justify-center items-center rounded-full border border-border p-1 pr-3',
    projectDataLabelWrapper: 'mx-3',
  };

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tab}>
        <div className={styles.projectDataLabelWrapper}>{ProjectDataLabel()}</div>
        <p>No Project</p>
        <header className={styles.tabAmount}>{tasksList.length}</header>
      </div>
    </div>
  );
};
