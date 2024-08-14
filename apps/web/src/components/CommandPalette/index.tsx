"use client";

import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { Dialog, Combobox, Transition } from "@headlessui/react";
import { setIsCmdPalette } from "@/store/isCmdPalette";
// Line 10 setTaskPage should be set to getSingleTask I think
import { setTaskPage } from "@/store/taskData";
import type { Task } from "@/store/taskData/taskData.interfaces";
import { Search } from "lucide-react";

const CommandPalette = () => {
  const dispatch = useAppDispatch();

  const { isCmdPalette } = useAppSelector((state) => state.isCmdPalette);
  const taskList = useAppSelector((state) => state.taskData.taskList);
  const { currentTeam } = useAppSelector((state) => state.taskData);
  const [query, setQuery] = useState("");

  const filteredTaskTitle = query
    ? taskList?.filter((task) =>
        task?.taskName?.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  const router = useRouter();

  const handleChange = (task: Task): void => {
    dispatch(setIsCmdPalette(false));
    // setTaskPage should be set to getSingleTask
    dispatch(setTaskPage(task));
    router.push(
      `/${currentTeam.name}/task/${currentTeam.identifier}/${task.title.trim().split(" ").join("-").toLocaleLowerCase()}`
    );
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        dispatch(setIsCmdPalette(false));
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };

    // eslint-disable-next-line
  }, [setIsCmdPalette]);

  return (
    <Transition.Root
      show={isCmdPalette}
      as={Fragment}
      afterLeave={() => {
        setQuery("");
      }}
    >
      <Dialog
        onClose={setIsCmdPalette}
        className=" fixed inset-0 p-4 pt-[25vh] overflow-y-auto"
      >
        <Transition.Child
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500/75">
            <Transition.Child
              enter="duration-30 ease-in"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Combobox
                onChange={handleChange}
                as="div"
                className="relative bg-white max-w-xl mx-auto mt-[25vh] rounded-xl shadow-2xl ring-1 ring-black/5 focus:ring-0 divide-y divide-gray-100 overflow-hidden"
              >
                <div className="flex items-center px-4">
                  <Search className="size-4 text-[#999999]" />
                  <Combobox.Input
                    onChange={(e) => {
                      setQuery(e.target.value);
                    }}
                    className="w-full bg-transparent border-0  focus:outline-none text-med py-1 px-2 text-gray-800 placeholder:text-gray-400 h-12"
                    placeholder="Search..."
                  />
                </div>
                {filteredTaskTitle?.length > 0 && (
                  <div className="py-4 text-sm max-h-60 overflow-y-auto">
                    {filteredTaskTitle?.map((task) => (
                      <Combobox.Option
                        className="list-none"
                        key={task._id}
                        value={task}
                      >
                        {({ active }) => (
                          <div
                            className={
                              active
                                ? "px-4 py-0.5 space-x-1 bg-indigo-600"
                                : "px-4 py-0.5 space-x-1 bg-indigo-600"
                            }
                          >
                            <span
                              className={
                                active
                                  ? "font-md text-foreground"
                                  : "font-md text-gray-900"
                              }
                            >
                              {task.taskName?.toUpperCase()}
                            </span>
                            <span
                              className={
                                active ? "text-indigo-200" : "text-gray-400"
                              }
                            >
                              in {task.status}
                            </span>
                          </div>
                        )}
                      </Combobox.Option>
                    ))}
                  </div>
                )}
                {query && filteredTaskTitle?.length === 0 && (
                  <p className="p-4 text-sm text-gray-500">No results found.</p>
                )}
              </Combobox>
            </Transition.Child>
          </Dialog.Overlay>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default CommandPalette;
