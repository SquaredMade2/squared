'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import type { MutableRefObject } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { Draggable } from '@hello-pangea/dnd';
import DeleteConfirmCard from '@/components/DeleteConfirmCard';
import { dueDateIcon, verticalSixDots } from '@/components/Svg';
import TaskCardTitle from '@/components/TaskCardTitle';
import TaskCardPriority from '@/components/TaskCardPriority';
import TaskCardLabels from '@/components/TaskCardLabels';
import TaskCardDate from '@/components/TaskCardDate';
import format from 'date-fns/format';
import { setTaskPage } from '@/store/taskData';
import ProfileImage from '@/components/ProfileImage';
import RightClickMenu from '@/components/RightClickMenu';
import { SocketContext } from '@/app/SocketProvider';
import { getAllTasks, getAllUsers } from '@/store/taskData/thunks';
// import { formatUrl } from '@/utils/formatting'; -- fix #2 https://linear.app/project-tasklist/issue/PRO-760/wrong-task-url-redirection-bug
import type { TaskCardProps } from './TaskCard.interfaces';
import type { AppDispatch, RootState } from '@/store';
import type { Task } from '@/store/taskData/taskData.interfaces';
import { deleteTaskCard } from '@/api/taskApi';

const styles = {
  taskCardContainer: 'relative mb-3',
  taskCard:
    ' cursor-pointer flex flex-col justify-center w-full p-4 text-blue text-foreground bg-card rounded-lg shadow-lg border border-border hover:bg-accent space-y-4',
  main: 'relative group/main grid grid-cols-24 items-center w-full py-2 text-blue bg-card border-t border-solid border-border hover:bg-accent',
  checkboxSection: 'group/select w-10 col-span-1 flex justify-end items-center pl-2 ml-3.5',
  sixVerticalDots:
    'hidden transition ease-in-out duration-200 sm:group-hover/main:hidden xs:group-hover/main:hidden md:group-hover/main:block md:group-hover/select:-translate-x-2',
  middleSection:
    'appearance-none checked:bg-primary/80 form-checkbox border border-checkbox md:hidden rounded group-hover/select:block sm:block xs:block w-[13px] h-[13px]',
  dateSection: 'flex justify-end col-span-4 items-center lg:pr-5',
  iconSection: 'flex justify-end col-span-3 items-center pl-3.5',
  checkboxDiv: 'xs:mr-5 sm:mr-5 md:mr-4 ',
  linkGrid: 'grid grid-cols-10 col-span-23 pl-2 pr-6 lg:pl-0',
  titleDiv: 'col-span-10 text-foreground',
  dateDiv: 'text-muted-foreground md:flex xs:hidden sm:hidden',
  labelRow: 'flex flex-row items-center space-x-4',
};

const TaskCard = ({
  filteredTasks,
  // setShowRenameModal, -- fix https://linear.app/project-tasklist/issue/PRO-756/taskcard-context-popover-foreground-typescript-bug
  setTaskData,
  highlightText,
  location,
}: TaskCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const uniqueTasks: Task[] = [];

  const { showDateTime, showPriority, showLabels } = useSelector(
    (state: RootState) => state.toggleTaskFeatures,
  );
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  const { view, theme, user } = useSelector((state: RootState) => state.userSettings);
  const { currentWorkspace } = useSelector((state: RootState) => state.taskData);
  const { currentTeam } = useSelector((state: RootState) => state.taskData);

  const [deleteFade, setDeleteFade] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- fix https://linear.app/project-tasklist/issue/PRO-756/taskcard-context-popover-foreground-typescript-bug
    menuPosition,
    setMenuPosition,
  ] = useState<{
    x: number;
    y: number;
  } | null>(null);
  // const taskUrl = `workspace/${currentWorkspace.url}/issue`; -- fix #2 https://linear.app/project-tasklist/issue/PRO-760/wrong-task-url-redirection-bug

  const taskRefs: MutableRefObject<{ [key: string]: HTMLElement | null }> = useRef({});
  const socket = useContext(SocketContext);

  const getNotificationId = notifications.map((noti) => noti._id);

  const handleDeleteTaskCard = async (task: Task) => {
    await deleteTaskCard(task._id);
    dispatch(getAllTasks(currentTeam));
    setShowDeleteCard(false);
    setDeleteFade(false);

    socket.emit('remove_notification', task._id, getNotificationId);
  };

  const handleCloseDeleteCard = () => {
    setShowDeleteCard(false);
    setDeleteFade(false);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, task: Task) => {
    e.preventDefault();
    setTaskData?.(task);
    setSelectedTask(task);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const navigateToTask = async (task: Task) => {
    dispatch(setTaskPage(task));
    router.push(`/tasks/${task._id}`);
  };

  const handleGlobalClick = () => {
    setMenuPosition(null);
  };

  useEffect(() => {
    dispatch(getAllUsers(currentWorkspace._id));
  }, [currentWorkspace._id, dispatch]);

  useEffect(() => {
    function handleClickAway(e: MouseEvent) {
      if (!Object.values(taskRefs.current).some((taskEl) => taskEl?.contains(e.target as Node))) {
        setMenuPosition(null);
      }
    }

    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, []);

  // useEffect(() => {
  // 	const handleKeyDown = (e) => {
  // 		if ((e.key === 'Escape' || e.key === 'Esc') && showDeleteCard === true) {
  // 			handleCloseDeleteCard();
  // 		}
  // 		document.addEventListener('keydown', this.handleKeyDown);

  // 		return () => {
  // 			document.removeEventListener('keydown', this.handleKeyDown);
  // 		};
  // 	};
  // }, [showDeleteCard]); leave in unitl component is complete.
  return (
    <>
      {view === 'list' &&
        location === 'dashboard' &&
        filteredTasks?.map((task, index) => (
          <Draggable draggableId={task._id} index={index} key={task._id}>
            {(provided) => (
              <div
                id={'this'}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                onClick={handleGlobalClick}
                onContextMenu={(e) => handleContextMenu(e, task)}
              >
                <div
                  ref={(el: HTMLDivElement | null) => {
                    taskRefs.current[task._id] = el;
                  }}
                >
                  {menuPosition && selectedTask && (
                    <RightClickMenu
                      x={menuPosition.x}
                      y={menuPosition.y}
                      handleDeleteTaskCard={handleDeleteTaskCard}
                      task={selectedTask}
                    />
                  )}
                </div>

                <div
                  className={`${styles.main} ${
                    index === filteredTasks.length - 1 && 'rounded-b-lg'
                  }`}
                >
                  <div className={styles.checkboxSection}>
                    <div className={styles.sixVerticalDots}>{verticalSixDots({})}</div>
                    <div className={styles.checkboxDiv}>
                      <input className={styles.middleSection} type="checkbox" />
                    </div>
                  </div>
                  <div onClick={() => navigateToTask(task)} className={styles.linkGrid}>
                    <div className={styles.titleDiv}>
                      <TaskCardTitle
                        key={task._id}
                        task={task}
                        isShown={showPriority}
                        taskTitle={task.title}
                        location={location}
                        highlightText={highlightText}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Draggable>
        ))}
      {location === 'dashboard' &&
        view === 'grid' &&
        filteredTasks
          ?.filter((task) => {
            if (!uniqueTasks.includes(task)) {
              uniqueTasks.push(task);
              return task;
            }
          })
          .map((task, index) => {
            return (
              <Draggable draggableId={task._id} index={index} key={task._id}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onClick={handleGlobalClick}
                    onContextMenu={(e) => handleContextMenu(e, task)}
                  >
                    <div
                      ref={(el: HTMLDivElement | null) => {
                        taskRefs.current[task._id] = el;
                      }}
                    >
                      {menuPosition && selectedTask && (
                        <RightClickMenu
                          x={menuPosition.x}
                          y={menuPosition.y}
                          handleDeleteTaskCard={handleDeleteTaskCard}
                          task={selectedTask}
                        />
                      )}
                    </div>
                    <Link href={`/tasks/${task._id}`} onClick={() => dispatch(setTaskPage(task))}>
                      <div className={styles.taskCardContainer}>
                        <div
                          key={task._id}
                          className={`${styles.taskCard} ${
                            theme === 'light' ? 'bg-card' : 'bg-background'
                          }`}
                        >
                          <TaskCardTitle
                            task={task}
                            taskTitle={task.title}
                            location={location}
                            highlightText={highlightText}
                            isShown={showPriority}
                          />
                          {showDateTime && (
                            <TaskCardDate icon={dueDateIcon()}>
                              Due Date:{' '}
                              {task.dueDate
                                ? format(new Date(task.dueDate), 'M/d/yy, h:mm a')
                                : 'No Date Set'}
                            </TaskCardDate>
                          )}
                          <div className={styles.labelRow}>
                            {showPriority && <TaskCardPriority border={true} task={task} />}
                            {showLabels && <TaskCardLabels task={task} view="grid" />}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </Draggable>
            );
          })}
      {location === 'search' &&
        filteredTasks?.map((task) => (
          <div
            id={'this'}
            key={task._id}
            onClick={handleGlobalClick}
            onContextMenu={(e) => handleContextMenu(e, task)}
          >
            <div
              ref={(el: HTMLDivElement | null) => {
                taskRefs.current[task._id] = el;
              }}
            >
              {menuPosition && selectedTask && (
                <RightClickMenu
                  x={menuPosition.x}
                  y={menuPosition.y}
                  handleDeleteTaskCard={handleDeleteTaskCard}
                  task={selectedTask}
                />
              )}
            </div>

            <div className={styles.main}>
              <div className={styles.checkboxSection}>
                <div className={styles.sixVerticalDots}>{verticalSixDots({})}</div>
                <div className={styles.checkboxDiv}>
                  <input className={styles.middleSection} type="checkbox" />
                </div>
              </div>
              <Link
                href={`/tasks/${task._id}`}
                onClick={() => setTaskPage(task)}
                className={styles.linkGrid}
              >
                <div className={styles.titleDiv}>
                  <TaskCardTitle
                    key={task._id}
                    task={task}
                    isShown={showPriority}
                    taskTitle={task.title}
                    highlightText={highlightText}
                    location={location}
                  />
                </div>

                <div className={styles.dateSection}>
                  <div className={styles.iconSection}>
                    {user && <ProfileImage profileName={user.name} location="taskCard" />}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}

      {showDeleteCard && selectedTask && (
        // Not sure if this Component is being used, because there is no confirmation before delete
        <DeleteConfirmCard
          task={selectedTask}
          handleDeleteTaskCard={handleDeleteTaskCard}
          onClose={handleCloseDeleteCard}
          deleteFade={deleteFade}
        />
      )}
    </>
  );
};

export default TaskCard;
