'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { getFilteredViews } from '@/store/filterPage/actions';
import type { RootState } from '@/store';
import FilterList from '@/components/FilterList';
import ViewTopNavBar from '@/components/ViewTopNavBar';

const styles = {
  container: 'flex flex-row w-full overflow-hidden relative',
  homeBg: 'flex flex-col w-full h-screen bg-background relative',
  navbarDivParent:
    'bg-background lg:max-w-[calc(100vw-330px)] flex flex-col items-center justify-between',
  navBarDiv: 'w-full h-[7vh]',
  navBarWrapper:
    'lg:flex lg:w-[330px] lg:left-0 lg:relative z-40 transition-all duration-300 ease-in-out',
  contentArea: 'w-full px-8 h-screen snap-x relative',
};

const ViewsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const teamId = useSelector((state: RootState) => state.taskData.currentTeam._id);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(getFilteredViews(teamId));
  }, []);

  return (
    <div className={`${styles.container}`}>
      <div className={styles.homeBg}>
        <div className={styles.contentArea}>
          <div className={styles.navbarDivParent}>
            <div className={styles.navBarDiv}>
              <ViewTopNavBar setSearchInput={setSearchInput} />
            </div>
          </div>
          <FilterList searchInput={searchInput} />
        </div>
      </div>
    </div>
  );
};

export default ViewsPage;
