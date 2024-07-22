import React, { useState, useEffect, useRef, useContext } from 'react';

import { deleteAllCurrentFilters } from '@/store/filterPage/actions';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { getNotifications, newNotification } from '@/store/notifications';
import ViewButton from '@/components/ViewButton';
import TopNavBarDisplay from '@/components/TopNavBarDisplay';
import FilterDropDown from '@/components/FilterDropdown';
import SelectedFiltersBar from '@/components/SelectedFiltersBar';
import {
  newFilter,
  //  BellIcon -- this has been disabled until a suitable icon has been found. The current icon does not match the design theme
} from '@/components/Svg';
import type { TopNavBarProps } from '@/components/TopNavBar/TopNavBar.interfaces';
import { ProjectDataWidget } from '@/components/ProjectDataWidget';
import { SocketContext } from '@/app/SocketProvider';
import NotificationsList from '@/components/NotificationsList';
import type { AnyAction } from '@reduxjs/toolkit';
import ToggleNavBar from '../ToggleNavBar';

const style = {
  header: 'max-w-screen',
  nav: ' bg-background h-[7vh] grid sm:grid-cols-2 w-full xs:grid-rows-2 xs:h-[14vh]',
  leftSide: 'bg-linearPurple-600 flex flex-none justify-start items-center',
  leftButtonContainer: ' w-full flex flex-none justify-start items-center',
  toggleNavBar: 'lg:hidden cursor-pointer mr-2',
  activeIssues:
    'w-22 text-sm rounded flex justify-center items-center text-foreground h-full flex-row',
  star: 'flex items-center justify-center ml-4 py-2 text-xs px-2 xs:hidden sm:hidden md:block rounded hover:bg-accent',
  starFill: 'fill-gray-500',
  filterDiv:
    'relative px-2.5 cursor-pointer text-xs xs:w-1/3 xs:flex w-22 bg-card ml-4 xs:ml-0 mr-2 rounded border border-border border-gray-500 text-foreground hover:bg-accent',
  filter:
    'text-xs w-full flex items-center justify-center h-10 mr-2 p-0.5 border-border bg-card text-foreground cursor-pointer hover:bg-accent',
  rightSide: 'bg-linearPurple-600 flex flex-none sm:justify-end items-center xs:grid-cols-2',
  rightButtonContainer: 'flex gap-6 flex-none justify-start items-center',
  viewButtonContainer:
    'bg-card h-full w-32 mr-5 flex justify-center items-center rounded-sm xs:hidden sm:hidden md:flex',
  xsFilter: 'xs:w-full',
  notificationContainer: 'flex items-center mr-6 mt-2 relative ',
  notificationBtn: 'cursor-pointer',
  amountOfNotifications:
    'absolute -top-3 -right-2 text-white bg-destructive rounded-full px-1 text-xs',
};

export const setFillColor = (theme: string): undefined | string => {
  switch (true) {
    case theme === 'light':
      return 'black';
    case theme === 'dark':
      return 'white';
    default:
      return;
  }
};

const TopNavBar = ({
  filterOption,
  handleFilter,
  showFilterSaveForm,
  handleFilterSaveForm,
}: TopNavBarProps) => {
  const [showFilterDropDown, setShowFilterDropDown] = useState(false);
  const [showFilterStatusBar, setShowFilterStatusBar] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const currentFilters = useAppSelector((state) => state.filterPage.currentFilters);

  const menuRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef(null);
  const dispatch = useAppDispatch();

  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  const socket = useContext(SocketContext);
  const user = useAppSelector((state) => state.userSettings.user);

  // const notifications = useAppSelector(
  // 	(state) => state.notifications.notifications
  // ); //fix disabled until inbox works -- https://linear.app/project-tasklist/issue/PRO-780/re-enable-inbox-when-fixed-on-develop

  function getCurrentDimension(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  // const handleNotification = (e: React.MouseEvent): void => {
  // 	e.stopPropagation();
  // 	setShowNotification((prev) => !prev);
  // }; This has been disabled until the inbox is fully functional

  useEffect(() => {
    const updateDimension = (): void => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [screenSize]);

  useEffect(() => {
    if (filterOption) {
      setShowFilterDropDown(false);
      handleFilter(filterOption);
    } else if (!filterOption) {
      handleFilter(null);
    }
  }, [filterOption, handleFilter]);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (menuRef.current != null && !menuRef.current.contains(e.target as HTMLElement)) {
        setShowFilterDropDown(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  useEffect(() => {
    socket.emit('socketId', user._id);
    socket.emit('getUser', user._id);
    socket.on('send_notification', (data: unknown) => {
      const notificationData = typeof data === 'string' ? JSON.parse(data) : data;
      dispatch(getNotifications(notificationData));
    });
    socket.on('new_notification', (data: unknown) => {
      const notificationData = typeof data === 'string' ? JSON.parse(data) : data;
      dispatch(newNotification(notificationData));
    });
    socket.on('notification_removed', (data: AnyAction) => {
      dispatch(getNotifications(data));
    });
    return () => {
      socket.off('send_notification');
      socket.off('new_notification');
      socket.off('notification_removed');
    };
  }, [socket.id, dispatch]);

  useEffect(() => {
    // hide FilterStatusBar if no filters -- leave comment in for clarity
    if (
      currentFilters.status.length === 0 &&
      currentFilters.priority.length === 0 &&
      currentFilters.labels.length === 0 &&
      currentFilters.dueDate.length === 0 &&
      currentFilters.effortEstimate.length === 0
    ) {
      setShowFilterStatusBar(false);
    } else {
      setShowFilterStatusBar(true);
    }
  }, [currentFilters]);

  // const notificationNotRead = notifications.filter(
  // 	(noti: { read: boolean }) => !noti.read
  // );  //fix disabled until inbox works -- https://linear.app/project-tasklist/issue/PRO-780/re-enable-inbox-when-fixed-on-develop

  return (
    <header className={style.header}>
      <nav className={style.nav}>
        <div className={style.leftSide}>
          <div className={style.leftButtonContainer}>
            <div className={style.toggleNavBar}>
              <ToggleNavBar />
            </div>
            <button className={style.activeIssues} type="button">
              <div>All Issues</div>
            </button>
            {screenSize.width > 640 && (
              <div ref={menuRef} className={`${style.filterDiv} group`}>
                <button
                  type="button"
                  onClick={
                    currentFilters.priority.length > 0 ||
                    currentFilters.status.length > 0 ||
                    currentFilters.labels.length > 0 ||
                    currentFilters.dueDate.length > 0 ||
                    currentFilters.effortEstimate.length > 0
                      ? () => {
                          handleFilter(null);
                          dispatch(deleteAllCurrentFilters());
                        }
                      : () => {
                          setShowFilterDropDown(true);
                        }
                  }
                  className={`${style.filter} group-hover:bg-accent`}
                >
                  <div className="mr-2">{newFilter()}</div>
                  <p>{showFilterStatusBar ? 'Clear Filters x' : 'Filter'}</p>
                </button>
                <FilterDropDown
                  showFilterDropDown={showFilterDropDown} // used to keep track of filter being show or not
                  setShowFilterDropDown={setShowFilterDropDown} // used to toggle filter on and off
                  handleFilter={handleFilter} // used to set filter being used -- future todo: change to redux
                />
              </div>
            )}
          </div>
        </div>
        <div className={style.rightSide}>
          <div className={style.xsFilter}>
            {screenSize.width < 640 && (
              <div ref={menuRef} className={style.filterDiv}>
                <button
                  type="button"
                  onClick={
                    currentFilters.priority.length > 0 ||
                    currentFilters.status.length > 0 ||
                    currentFilters.labels.length > 0 ||
                    currentFilters.dueDate.length > 0 ||
                    currentFilters.effortEstimate.length > 0
                      ? () => {
                          handleFilter(null);
                          dispatch(deleteAllCurrentFilters());
                        }
                      : () => {
                          setShowFilterDropDown(true);
                        }
                  }
                  className={style.filter}
                >
                  <p>{showFilterStatusBar ? 'Clear Filters x' : '+ Filter'}</p>
                </button>
                <FilterDropDown
                  showFilterDropDown={showFilterDropDown} // used to keep track of filter being show or not
                  setShowFilterDropDown={setShowFilterDropDown} // used to toggle filter on and off
                  handleFilter={handleFilter} // used to set filter being used -- future todo: change to redux
                />
              </div>
            )}
          </div>
          <div className={style.notificationContainer}>
            {/* <button
							ref={notificationButtonRef}
							onClick={handleNotification}
							className={style.notificationBtn}
						>
							{BellIcon(theme)}
						</button> */}
            {/* Button does not match the design of the other Icons. This has been disabled until a suitable icon has been found and the inbox is fully functional */}
            {/* <span className={style.amountOfNotifications}>
							{!notificationNotRead.length ? '' : notificationNotRead.length}
						</span> //fix disabled until inbox works -- https://linear.app/project-tasklist/issue/PRO-780/re-enable-inbox-when-fixed-on-develop */}
            {/* Create component that'll show the notification here */}
            {showNotification && (
              <NotificationsList
                notificationButtonRef={notificationButtonRef}
                setShowNotification={setShowNotification}
                showNotification={showNotification}
              />
            )}
          </div>
          <div className={style.rightButtonContainer}>
            <div className={style.viewButtonContainer}>
              <ViewButton />
            </div>

            <TopNavBarDisplay />
          </div>
          <ProjectDataWidget />
        </div>
      </nav>

      <div className={`${showFilterStatusBar ? 'block' : 'hidden'} w-full`}>
        <SelectedFiltersBar
          filterOption={filterOption}
          showFilterSaveForm={showFilterSaveForm}
          handleFilterSaveForm={handleFilterSaveForm}
          handleFilter={handleFilter}
        />
      </div>
    </header>
  );
};

export default TopNavBar;
