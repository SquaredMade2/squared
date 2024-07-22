'use client';

import React from 'react';

const WorkSpace = () => {
  return (
    <div className="flex flex-col space-y-5 items-center w-[350px] mt-[20vh] mx-auto">
      <span className="text-2xl text-gray-700">Create a new workspace</span>
      <span className="text-xs text-gray-400 text-center">
        Workspaces are shared environments where teams can work on projects, cycles and tasks
      </span>
      <div>
        <form className="space-y-8  px-6 py-4 rounded shadow border border-gray-800 w-[350px]">
          <div className="flex flex-col">
            <label htmlFor="workspaceName" className="text-xs text-gray-600 pb-1">
              Workspace Name
            </label>
            <input
              className=" rounded border border-gray-400/30 px-2 py-1 active:border-indigo-400  focus:ring-0"
              type="text"
              id="workspaceName"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 pb-1">Workspace URL</label>
            <input
              className="rounded border border-gray-400/30 px-2 py-1 active:border-indigo-400  focus:ring-0"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 pb-1">How large is your company?</label>
            <input
              className=" rounded border border-gray-400/30 px-2 py-1 active:border-indigo-400  focus:ring-0"
              type="text"
            />
          </div>
        </form>
      </div>
      <button
        type="button"
        className="bg-indigo-600 text-gray-200 text-sm active:outline-none px-12 rounded py-2"
      >
        Create workspace
      </button>
    </div>
  );
};

export default WorkSpace;
