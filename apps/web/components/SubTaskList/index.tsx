import type React from 'react';
import { useState } from 'react';
import type { SubTaskListProps } from './SubTaskList.interfaces';

const SubTaskList = ({ onAddSubtask }: SubTaskListProps) => {
  const [subTasks, setSubTasks] = useState('');

  const handleChangeSubTask = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSubTasks(e.target.value);
  };

  const handleKeyDown = (e: { preventDefault: () => void; key: string }) => {
    e.preventDefault();
    if (e.key === 'Enter' && subTasks.trim() !== '') {
      onAddSubtask(subTasks);
      setSubTasks('');
    }
  };

  return (
    <div>
      <input
        className="bg-white rounded-full w-full h-8 pr-2 pl-4 py-1"
        name="subTasks"
        value={subTasks}
        onChange={handleChangeSubTask}
        onKeyDown={handleKeyDown}
        placeholder="Enter sub tasks..."
        type="text"
      />
    </div>
  );
};

export default SubTaskList;
