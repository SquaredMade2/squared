import React, { useState } from 'react';
import { ClickAwayListener } from '@mui/base';
import { ProjectDataWidgetButton } from '@/components/ProjectDataWidgetButton';
import { ProjectDataWidgetDropdowns } from '@/components/ProjectDataWidgetDropdowns';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type {
  AssigneesDataInterface,
  LabelsDataInterface,
} from '@/app/interfaces/ProjectDataWidget.interfaces';
import { Favorited, NotFavorited, ProjectDataLabel } from '@/components/Svg';
import type { Task } from '@/store/taskData/taskData.interfaces';

const styles = {
  mainWidget:
    'fixed top-14 right-0 z-10 flex flex-col bg-card border border-border w-full md:w-1/2 lg:w-1/3 duration-500 h-screen transition-transform transform',
  header:
    'flex flex-col lg:pt-1.5 items-center text-nav w-full h-28 p-5 mt-2 border-b border-border bg-card',
  headerTag: 'm-2 p-2 mr-auto bg-popover rounded-md text-sm font-medium',
  headerMainRow: 'flex flex-row items-center m-3 mr-auto',
  headerProjectTitle: 'mx-3',
  favoriteButton: 'cursor-pointer',
  projectImageLabelButton: 'cursor-pointer',
  widget: 'flex flex-row items-center cursor-pointer relative w-full px-[18px]',
  body: 'flex flex-col m-3 items-center justify-center',
  hidden: 'translate-x-full',
  visible: 'translate-x-0',
};

export const ProjectDataWidget = () => {
  const [toggleWidget, setToggleWidget] = useState<boolean>(false);

  // The below is temporary until a favorite attribute is retrieved
  const [favorite, setFavorite] = useState<boolean>(false);

  const tasksInWorkspace = useAppSelector((state) => state.taskData.currentTeam.tasks);

  const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

  const assigneesData: AssigneesDataInterface = tasksInWorkspace.reduce(
    (obj: AssigneesDataInterface, task: Task) => {
      if (!task.assignee) return obj;
      if (task.assignee.name === null) {
        obj.unassigned++;
      } else if (task.assignee.name in obj) {
        obj[task.assignee.name]++;
      } else {
        obj[task.assignee.name] = 1;
      }
      return obj;
    },
    { unassigned: 0 },
  );

  const labelsData: LabelsDataInterface = tasksInWorkspace.reduce(
    (obj: LabelsDataInterface, task) => {
      if (task.labels.length > 0) {
        for (const label of task.labels) {
          if (label in obj) {
            obj[label]++;
          } else {
            obj[label] = 1;
          }
        }
      }
      return obj;
    },
    {},
  );

  return (
    <ClickAwayListener onClickAway={() => setToggleWidget(false)}>
      <div>
        <ProjectDataWidgetButton toggleWidget={toggleWidget} setToggleWidget={setToggleWidget} />
        <div className={`${toggleWidget ? styles.visible : styles.hidden} ${styles.mainWidget}`}>
          <div className={styles.header}>
            <header className={styles.headerTag}>All Issues</header>
            <div className={styles.headerMainRow}>
              <button type="button" className={styles.projectImageLabelButton}>
                {ProjectDataLabel()}
              </button>
              <header className={styles.headerProjectTitle}> {currentTeam.name} </header>
              <button
                type="button"
                className={styles.favoriteButton}
                onClick={() => setFavorite(!favorite)}
              >
                {favorite ? <Favorited /> : <NotFavorited />}
              </button>
            </div>
          </div>

          <div className={styles.body}>
            <ProjectDataWidgetDropdowns assigneesData={assigneesData} labelsData={labelsData} />
          </div>
        </div>
      </div>
    </ClickAwayListener>
  );
};
