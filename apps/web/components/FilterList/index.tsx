import { useEffect } from 'react';
// import Link from 'next/link'; leave in until component fixed
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { getFilteredViews } from '@/store/filterPage/actions';
import FilterListDropDown from '@/components/FilterListDropDown';

import { stackIcon, personIcon } from '@/components/Svg';
import type { FilterListProps } from './FilterList.interfaces';
import type { AppDispatch, RootState } from '@/store';

const FilterList = ({ searchInput }: FilterListProps) => {
  const theme = useSelector((state: RootState) => state.userSettings.theme);
  const filters = useSelector((state: RootState) => state.filterPage.filters);
  const teamId = useSelector((state: RootState) => state.taskData.currentTeam._id);
  const userName = useSelector((state: RootState) => state.userSettings.user);
  const dispatch = useDispatch<AppDispatch>();

  const styles = {
    main: `h-full bg-card overflow-hidden border ${
      theme === 'dark' ? 'border-[#212531]' : 'border-border'
    } rounded-lg`,
    itemMain: `grid grid-cols-2 h-[7vh] items-center bg-gradient-to-r ${
      theme === 'dark' ? 'from-[#1d2029] to-[#0e0f11]' : 'from-[#F7F7F7] to-[#FFFFFF]'
    } border-b ${theme === 'dark' ? 'border-[#212531]' : 'border-[#F7F7F7]'}`,
    leftSide: 'flex items-center',
    stackIcon: 'ml-5',
    filterTitle: 'ml-4 text-foreground',
    rightSide: 'flex items-center justify-end',
    personIcon: 'mr-3',
    userName: 'mr-3 text-foreground',
    ellipsis: 'mr-5 w-10 hover:bg-background',
    rightSideLink: 'md:flex hidden items-center',
    topContainer: 'pt-3.5',
  };

  useEffect(() => {
    dispatch(getFilteredViews(teamId));
  }, []);

  return (
    <div className={styles.topContainer}>
      {filters.length > 0 ? (
        <div className={styles.main}>
          {filters
            .filter((filter) => {
              return filter.filterTitle
                .toString()
                .replace(/\s/g, '')
                .toLowerCase()
                .includes(searchInput.replace(/\s/g, '').toLowerCase());
            })
            .map((filter) => {
              return (
                <>
                  <div key={filter._id.toString()} className={styles.itemMain}>
                    <Link href={`/filter/${filter._id}`}>
                      <div className={styles.leftSide}>
                        <div className={styles.stackIcon}>{stackIcon()}</div>
                        <div className={styles.filterTitle}>
                          {filters.length > 0 ? filter.filterTitle.toString() : null}
                        </div>
                      </div>
                    </Link>
                    <div className={styles.rightSide}>
                      <Link href={`/filter/${filter._id}`} className={styles.rightSideLink}>
                        <div className={styles.personIcon}>{personIcon({})}</div>
                        <div className={styles.userName}>
                          <p>{userName.name}</p>
                        </div>
                      </Link>
                      <FilterListDropDown
                        filterId={filter._id.toString()}
                        filterTitle={filter.filterTitle.toString()}
                      />
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default FilterList;
