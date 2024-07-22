import { useState } from 'react';
import { ClickAwayListener } from '@mui/base';
import type { SetFilter } from '@/app/interfaces/ProjectDataWidget.interfaces';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { AddIcon } from '../../Svg';
import { setCurrentFilter } from '@/store/filterPage/actions';
import WidgetLabelDropdown from '../../WidgetLabelDropdown';
import type { LabelsTabProps } from './LabelsTab.interfaces';

export const LabelsTab = ({ labelsData }: LabelsTabProps) => {
  const labelsRenderData = Object.entries(labelsData);

  const dispatch = useAppDispatch();

  const lightSettings = useAppSelector((state) => state.userSettings).theme;
  const currentLabelFilters = useAppSelector((state) => state.filterPage.currentFilters).labels;

  const [toggleDropdown, setToggleDropdown] = useState(true);

  const styles = {
    tabContainer: `flex flex-col items-center mt-10 m-5 w-full max-h-80 ${
      lightSettings === 'light' ? 'text-black' : 'text-white'
    }`,
    tab: 'flex flex-row items-center w-full h-12 text-sm my-1 hover:bg-accent duration-200 p-2 rounded-lg',
    tabAmount: 'ml-auto',
    tabSvg: 'm-2',
    colorIcon: 'w-3 h-3 rounded-full m-2',
    tabLabel: `mr-auto mr-2 my-2 font-light text-lg ${
      lightSettings === 'dark' ? 'text-muted-foreground' : ''
    } h-8`,
    dropdownButton: `flex flex-row w-full h-12 border border-border bg-textField p-2 px-4 rounded-xl border outline-none ${
      lightSettings === 'dark'
        ? `${toggleDropdown === true ? 'border-slate-100' : 'border-slate-600'}`
        : ''
    } cursor-pointer`,
    buttonWrapper: 'flex flex-row w-full items-center justify-end',
    addIconWrapper: 'absolute m-5',
    label: 'flex flex-row h-13 items-center hover:bg-accent duration-200 p-2 rounded-xl',
    assigneeLabel:
      'flex flex-row justify-center items-center rounded-full border border-border p-1 pr-3',
    labelsWrapper: `absolute bg-card z-30 mt-24 flex flex-col ${
      toggleDropdown === true ? '' : 'hidden'
    } border border-slate-600 w-5/6 h-auto max-h-60 rounded-lg p-3 overflow-y-auto`,
    amount: 'ml-auto',
    checkboxWrapper: 'bg-textField',
    checkbox: 'bg-textField accent-black m-2 w-10 h-5',
    currentFilters: 'flex flex-row w-60 overflow-scroll',
    eachFilter: 'flex h-1/2 flex-row justify-center items-center text-nowrap mx-1',
  };

  const getColorFromLabel: (labelName: string) => string = (labelName) => {
    switch (labelName) {
      case 'Bug':
        return '#EB5757';
      case 'Feature':
        return '#BB87FC';
      case 'Improvement':
        return '#4EA7FC';
      default:
        return '';
    }
  };

  const setFilter: SetFilter = (filterLabel) => {
    if (filterLabel) {
      const filterReq = {
        id: 1,
        name: filterLabel,
        border: false,
        svg: (
          <div
            className={styles.colorIcon}
            style={{ backgroundColor: getColorFromLabel(filterLabel) }}
          />
        ),
        group: 'labels',
      };
      dispatch(setCurrentFilter(filterReq));
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setToggleDropdown(false)}>
      <div className={styles.tabContainer}>
        <label className={styles.tabLabel}> Labels </label>
        <div className={styles.buttonWrapper}>
          <button
            className={styles.dropdownButton}
            onClick={() => setToggleDropdown(!toggleDropdown)}
            type="button"
          >
            <ul className={styles.currentFilters}>
              {currentLabelFilters.map((label) => {
                return (
                  <li className={styles.eachFilter} key={label}>
                    <div
                      className={styles.colorIcon}
                      style={{ backgroundColor: getColorFromLabel(label) }}
                    />
                    <header>{label}</header>
                  </li>
                );
              })}
            </ul>
          </button>
          <div className={styles.addIconWrapper}>{AddIcon()}</div>
        </div>
        <div className={styles.labelsWrapper}>
          {labelsRenderData.map((label) => {
            return (
              <div key={label[0]}>
                <WidgetLabelDropdown
                  label={label}
                  setFilter={setFilter}
                  getColorFromLabel={getColorFromLabel}
                />
              </div>
            );
          })}
        </div>
      </div>
    </ClickAwayListener>
  );
};
