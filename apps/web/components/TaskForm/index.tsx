// This is obsolete and the file can be deleted when agreed upon - comment by Ed.

import type React from 'react';
import { useState } from 'react';
import SubTaskList from '@/components/SubTaskList';
import type { TaskFormProps } from './TaskForm.interfaces';

const TaskForm = ({ onDiscard, onSave, onClose }: TaskFormProps) => {
  const [inputTask, setInputTask] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [priority, setPriority] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [inputTags, setInputTags] = useState('');
  const [status, setStatus] = useState('');
  const [subTaskList, setSubTaskList] = useState<string[]>([]);

  const handleChangeTask = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputTask(e.target.value);
  };

  const handleChangeDate = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputDate(e.target.value);
  };

  const handleChangeTime = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputTime(e.target.value);
  };

  const handleChangeTags = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputTags(e.target.value);
  };

  const handleStatusChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setStatus(e.target.value);
  };

  const handleAddSubtask = (subtask: string) => {
    const newSubTaskList = [...subTaskList, subtask];
    setSubTaskList(newSubTaskList);
  };

  const handleDiscard = () => {
    onDiscard();
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const formIsCompletelyFilled = inputTask;
    // left comment for testing purposes
    // &&
    // priority &&
    // complexity &&
    // inputDate &&
    // inputTime &&
    // inputTags &&
    // subTaskList.length > 0 &&
    // status;

    if (formIsCompletelyFilled) {
      const taskItem = {
        taskName: inputTask,
        priority,
        complexity,
        date: inputDate,
        time: inputTime,
        tags: inputTags,
        subTaskList,
        status,
      };

      setSubTaskList([]);
      setInputTask('');
      setInputDate('');
      setInputTime('');
      setPriority(null);
      setComplexity(null);
      setInputTags('');

      onSave(taskItem);
      onClose();
    }
  };

  return (
    <div>
      <div className="flex flex-col border px-4 py-4 border-white bg-gray-200 rounded gap-4">
        <div className="flex w-full justify-center space-x-10">
          <span className=" flex justify-center basic-1/2 py-2 text-lg text-black">
            Add New task
          </span>
        </div>
        <div className="text-gray-700 mx-2 ">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>Task Name</div>
            <input
              name="inputTask"
              value={inputTask}
              onChange={handleChangeTask}
              className="bg-white border-gray-600 rounded-full py-2 pr-1 pl-4 text-sm w-full"
              placeholder="Enter your task here..."
              type="text"
            />
            <div className="flex flex-col gap-2">
              <span className="text-sm">Select Priority Level</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Select the complexity Level</span>
            </div>
            <div className="flex flex-row justify-center gap-12">
              <div className=" flex flex-col w-1/3 justify-center gap-2	">
                <span className="">Select Due Date</span>
                <span>
                  <input
                    name="inputDate"
                    value={inputDate}
                    onChange={handleChangeDate}
                    className=" bg-white dateClass rounded-full p-1 text-sm "
                    style={{ paddingLeft: '10px' }}
                    type="date"
                  />
                </span>
              </div>
              <div className=" flex flex-col w-1/3 justify-center gap-2	">
                <span className="">Select Time</span>
                <input
                  name="inputTime"
                  value={inputTime}
                  onChange={handleChangeTime}
                  className="bg-white rounded-full p-1 text-sm"
                  style={{ paddingLeft: '10px' }}
                  type="time"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span>Add Checklist for subtasks</span>
              <SubTaskList onAddSubtask={handleAddSubtask} />
              <ul>
                {subTaskList.map((taskItem, index) => {
                  const taskIndex = index;
                  return (
                    <li className="bg-white rounded-full py-1 pl-4 pr-2 my-2" key={taskIndex}>
                      {taskItem}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <span>Add Tags</span>
              <input
                name="inputTags"
                value={inputTags}
                onChange={handleChangeTags}
                className="  bg-white px-2 py-1 rounded-full"
                placeholder=" Add tags here.."
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>Select Status</span>
              <select
                name="status"
                value={status}
                onChange={handleStatusChange}
                className="bg-white px-2 py-1 rounded-full"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
              </select>
            </div>

            <div className="flex justify-center gap-10">
              <button
                type="button"
                onClick={handleDiscard}
                className=" w-40 rounded-full text-muted-foreground bg-muted hover:bg-destructive hover:shadow-lg"
              >
                {' '}
                Discard
              </button>
              <button
                type="submit"
                className=" w-40 rounded-full text-muted-foreground bg-muted hover:bg-accent hover:shadow-lg"
              >
                Save task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
