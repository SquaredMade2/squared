"use client";

import { useState, useRef, useEffect, useContext } from "react";
import type { MutableRefObject } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { Draggable } from "@hello-pangea/dnd";
import DeleteConfirmCard from "@/components/DeleteConfirmCard";
import { Calendar, GripVertical } from "lucide-react";
import TaskCardTitle from "@/components/TaskCardTitle";
import TaskCardPriority from "@/components/TaskCardPriority";
import TaskCardLabels from "@/components/TaskCardLabels";
import TaskCardDate from "@/components/TaskCardDate";
import format from "date-fns/format";
import { setTaskPage } from "@/store/taskData";
import ProfileImage from "@/components/ProfileImage";
import RightClickMenu from "@/components/RightClickMenu";
import { SocketContext } from "@/app/SocketProvider";
import { getAllTasks, getAllUsers } from "@/store/taskData/thunks";
import type { TaskCardProps } from "./TaskCard.interfaces";
import type { AppDispatch, RootState } from "@/store";
import type { Task } from "@/store/taskData/taskData.interfaces";
import { deleteTaskCard } from "@/api/taskApi";

const TaskCard = ({
  filteredTasks,
  setTaskData,
  highlightText,
  location,
}: TaskCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const uniqueTasks: Task[] = [];

  const { showDateTime, showPriority, showLabels } = useSelector(
    (state: RootState) => state.toggleTaskFeatures
  );
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const { view, theme, user } = useSelector(
    (state: RootState) => state.userSettings
  );
  const { currentWorkspace } = useSelector(
    (state: RootState) => state.taskData
  );
  const { currentTeam } = useSelector((state: RootState) => state.taskData);

  const [deleteFade, setDeleteFade] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const taskRefs: MutableRefObject<{
    [key: string]: HTMLElement | null;
  }> = useRef({});
  const socket = useContext(SocketContext);

  const getNotificationId = notifications.map((noti) => noti._id);

  const handleDeleteTaskCard = async (task: Task) => {
    await deleteTaskCard(task._id);
    dispatch(getAllTasks(currentTeam));
    setShowDeleteCard(false);
    setDeleteFade(false);

    socket.emit("remove_notification", task._id, getNotificationId);
  };

  const handleCloseDeleteCard = () => {
    setShowDeleteCard(false);
    setDeleteFade(false);
  };

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    task: Task
  ) => {
    e.preventDefault();
    setTaskData?.(task);
    setSelectedTask(task);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const navigateToTask = async (task: Task) => {
    dispatch(setTaskPage(task));
    router.push(
      `/tasks/${task.title.split(" ").join("-").toLocaleLowerCase()}`
    );
  };

  const handleGlobalClick = () => {
    setMenuPosition(null);
  };

  useEffect(() => {
    dispatch(getAllUsers(currentWorkspace._id));
  }, [currentWorkspace._id, dispatch]);

  useEffect(() => {
    function handleClickAway(e: MouseEvent) {
      if (
        !Object.values(taskRefs.current).some((taskEl) =>
          taskEl?.contains(e.target as Node)
        )
      ) {
        setMenuPosition(null);
      }
    }

    document.addEventListener("mousedown", handleClickAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, []);
  return (
    <>
      {view === "list" &&
        location === "dashboard" &&
        filteredTasks?.map((task, index) => (
          <Draggable draggableId={task._id} index={index} key={task._id}>
            {(provided) => (
              <div
                id={"this"}
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
                  className={`relative group/main grid grid-cols-24 items-center w-full py-2 text-blue bg-card border-t border-solid border-border hover:bg-accent ${
                    index === filteredTasks.length - 1 && "rounded-b-lg"
                  }`}
                >
                  <div className="group/select w-10 col-span-1 flex justify-end items-center pl-2 ml-3.5">
                    <div className="hidden transition ease-in-out duration-200 sm:group-hover/main:hidden xs:group-hover/main:hidden md:group-hover/main:block md:group-hover/select:-translate-x-2">
                      <GripVertical className="size-5" />
                    </div>
                    <div className="xs:mr-5 sm:mr-5 md:mr-4">
                      <input
                        title="input"
                        className="appearance-none checked:bg-primary/80 form-checkbox border border-checkbox md:hidden rounded group-hover/select:block sm:block xs:block w-[13px] h-[13px]"
                        type="checkbox"
                      />
                    </div>
                  </div>
                  <div
                    onClick={() => navigateToTask(task)}
                    className="grid grid-cols-10 col-span-23 pl-2 pr-6 lg:pl-0"
                  >
                    <div className="col-span-10 text-foreground">
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
      {location === "dashboard" &&
        view === "grid" &&
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
                    <Link
                      href={`/tasks/${task.title.split(" ").join("-").toLocaleLowerCase()}`}
                      onClick={() => dispatch(setTaskPage(task))}
                    >
                      <div className="relative w-[325px]">
                        <div
                          key={task._id}
                          className={`cursor-pointer flex flex-col justify-center w-full p-4 text-blue text-foreground bg-card rounded-lg shadow border dark:border-none hover:bg-accent space-y-4 ${
                            theme === "light" ? "bg-card" : "bg-background"
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
                            <TaskCardDate
                              icon={
                                <Calendar className="cursor-pointer size-4" />
                              }
                            >
                              Due Date:{" "}
                              {task.dueDate
                                ? format(
                                    new Date(task.dueDate),
                                    "M/d/yy, h:mm a"
                                  )
                                : "No Date Set"}
                            </TaskCardDate>
                          )}
                          <div className="flex flex-row items-center space-x-4">
                            {showPriority && (
                              <TaskCardPriority border={true} task={task} />
                            )}
                            {showLabels && (
                              <TaskCardLabels task={task} view="grid" />
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </Draggable>
            );
          })}
      {location === "search" &&
        filteredTasks?.map((task) => (
          <div
            id={"this"}
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
            <div className="relative group/main grid grid-cols-24 items-center w-full py-2 text-blue bg-card border-t border-solid border-border hover:bg-accent">
              <div className="group/select w-10 col-span-1 flex justify-end items-center pl-2 ml-3.5">
                <div className="hidden transition ease-in-out duration-200 sm:group-hover/main:hidden xs:group-hover/main:hidden md:group-hover/main:block md:group-hover/select:-translate-x-2">
                  <GripVertical className="size-5" />
                </div>
                <div className="xs:mr-5 sm:mr-5 md:mr-4">
                  <input
                    title="input"
                    className="appearance-none checked:bg-primary/80 form-checkbox border border-checkbox md:hidden rounded group-hover/select:block sm:block xs:block w-[13px] h-[13px]"
                    type="checkbox"
                  />
                </div>
              </div>
              <Link
                href={`/tasks/${task.title.split(" ").join("-").toLocaleLowerCase()}`}
                onClick={() => setTaskPage(task)}
                className="grid grid-cols-10 col-span-23 pl-2 pr-6 lg:pl-0"
              >
                <div className="col-span-10 text-foreground">
                  <TaskCardTitle
                    key={task._id}
                    task={task}
                    isShown={showPriority}
                    taskTitle={task.title}
                    highlightText={highlightText}
                    location={location}
                  />
                </div>
                <div className="flex justify-end col-span-4 items-center lg:pr-5">
                  <div className="flex justify-end col-span-3 items-center pl-3.5">
                    {user && (
                      <ProfileImage
                        profileName={user.name}
                        location="taskCard"
                      />
                    )}
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
