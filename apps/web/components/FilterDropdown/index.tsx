import { useState, useRef, useEffect } from 'react';

import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

import {
  status,
  labelIcon,
  // projectFilter,
  // projectStatus,
  priority,
  // subIssues,
  // issuesWithReferences,
  // createdDate,
  // updatedDate,
  // startedDate,
  // autoClosed,
  // subscriber, -- commented out until features added
  nullPriority,
  dueDateIcon,
  effortIcon,
} from '@/components/Svg';
import PriorityFilterDropDown from '@/components/PriorityFilterDropDown';
import StatusFilterDropDown from '@/components/StatusFilterDropDown';
import LabelFilterDropDown from '@/components/LabelFilterDropDown';
import DueDateFilterDropDown from '@/components/DueDateFilterDropDown';
import EffortFilterDropDown from '@/components/EffortFilterDropDown';

import type { Props } from '@/components/FilterDropdown/FilterDropdown.interfaces';
import type { FilterOption } from '@/app/interfaces/Filter.interfaces';

const groupOne = [
  { id: 1, name: 'Status', border: false, svg: status(), group: 'Status' },
  {
    id: 2,
    name: 'Priority',
    border: false,
    svg: priority(),
    group: 'Priority',
  },
  { id: 3, name: 'Labels', border: false, svg: labelIcon(), group: 'Labels' },
  {
    id: 4,
    name: 'Due Date',
    border: false,
    svg: dueDateIcon(),
    group: 'Due Date',
  },
  {
    id: 5,
    name: 'Effort',
    border: false,
    svg: effortIcon(),
    group: 'effortEstimate',
  },
  // {
  // 	id: 4,
  // 	name: 'Project',
  // 	border: false,
  // 	svg: projectFilter(),
  // 	group: 'Project',
  // },
  // {
  // 	id: 5,
  // 	name: 'Project Status',
  // 	border: false,
  // 	svg: projectStatus(),
  // 	group: 'Project Status',
  // },
  // {
  // 	id: 6,
  // 	name: 'Sub-issues',
  // 	border: false,
  // 	svg: subIssues(),
  // 	group: 'Sub-issues',
  // },
  // {
  // 	id: 7,
  // 	name: 'Issues with references',
  // 	border: false,
  // 	svg: issuesWithReferences(),
  // 	group: 'Issues with references',
  // },
  // { id: 8, name: 'Due date', border: true, svg: dueDate(), group: 'Due date' },
  // {
  // 	id: 9,
  // 	name: 'Created date',
  // 	border: false,
  // 	svg: createdDate(),
  // 	group: 'Created date',
  // },
  // {
  // 	id: 10,
  // 	name: 'Updated date',
  // 	border: false,
  // 	svg: updatedDate(),
  // 	group: 'Updated date',
  // },
  // {
  // 	id: 11,
  // 	name: 'Started date',
  // 	border: false,
  // 	svg: startedDate(),
  // 	group: 'Started date',
  // },
  // {
  // 	id: 12,
  // 	name: 'Triaged date',
  // 	border: false,
  // 	svg: startedDate(),
  // 	group: 'Triaged Date',
  // },
  // {
  // 	id: 13,
  // 	name: 'Auto-closed',
  // 	border: true,
  // 	svg: autoClosed(),
  // 	group: 'Auto-closed',
  // },
  // {
  // 	id: 14,
  // 	name: 'Subscriber',
  // 	border: false,
  // 	svg: subscriber(),
  // 	group: 'Subscriber',
  // }, -- commented out until features added
];

const styles = {
  main: 'absolute z-50 top-full left-0 w-72',
  second: 'relative mt-1 transition-all duration-300',
  third:
    'relative w-full transition-all duration-300 border border-border cursor-default overflow-hidden rounded-tr rounded-tl bg-background text-left shadow-md focus:outline-none focus-visible:outline-none sm:text-sm',
  button:
    'w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-foreground bg-seconday focus-visible:outline-none',
  downChevron: 'h-5 w-5 text-gray-400',
  input:
    'absolute pl-1 h-full w-full bg-card z-50 inset-y-0 right-0 flex items-center pr-2 focus-visible:outline-none',
  options:
    'absolute z-50 transition-all duration-300 border-border border-l border-b border-r w-full overflow-auto rounded-br-md rounded-bl-md  bg-background text-foreground py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
  firstOption: 'relative flex items-center cursor-default select-none py-2 px-4 text-foreground',
  aiFilter: 'pl-2',
  secondOption: 'relative cursor-default select-none py-2 pl-2 pr-4',
  thirdOption: 'block truncate flex items-center',
  selectedSpan: 'absolute inset-y-0 left-0 flex items-center pl-3',
  svg: 'pr-2',
};

const FilterDropDown: React.FunctionComponent<Props> = ({
  showFilterDropDown,
  setShowFilterDropDown,
  handleFilter,
}) => {
  const [query, setQuery] = useState('');
  const [filterOption, setFilterOption] = useState<FilterOption | null>({
    id: 0,
    name: '',
    border: false,
    svg: {},
    group: '',
    comparison: '',
  });
  const [showPriorityFilterDropDown, setShowPriorityFilterDropDown] = useState(false);
  const [showStatusFilterDropDown, setShowStatusFilterDropDown] = useState(false);
  const [showLabelFilterDropDown, setShowLabelFilterDropDown] = useState(false);
  const [showDueDateFilterDropDown, setShowDueDateFilterDropDown] = useState(false);
  const [showEffortFilterDropDown, setShowEffortFilterDropDown] = useState(false);
  const filterDropDownRef = useRef<HTMLButtonElement>(null);
  const priorityMenuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const labelMenuRef = useRef<HTMLDivElement>(null);
  const dueDateMenuRef = useRef<HTMLDivElement>(null);
  const effortMenuRef = useRef<HTMLDivElement>(null);

  const filteredGroup =
    query === ''
      ? groupOne
      : groupOne.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  const clearFilter = (): void => {
    if (filterOption) {
      setFilterOption(null);
    }
  };

  useEffect(() => {
    if (showFilterDropDown && filterDropDownRef.current != null) {
      filterDropDownRef.current.click();
    }
  }, [showFilterDropDown]);

  useEffect(() => {
    if (filterOption === null) {
      return;
    }

    if (filterOption.name === 'Priority') {
      setShowPriorityFilterDropDown(true);
      setShowFilterDropDown(false);
    }

    if (filterOption.name === 'Status') {
      setShowStatusFilterDropDown(true);
      setShowFilterDropDown(false);
    }

    if (filterOption.name === 'Labels') {
      setShowLabelFilterDropDown(true);
      setShowFilterDropDown(false);
    }

    if (filterOption.name === 'Due Date') {
      setShowDueDateFilterDropDown(true);
      setShowFilterDropDown(false);
    }

    if (filterOption.name === 'Effort') {
      setShowEffortFilterDropDown(true);
      setShowFilterDropDown(false);
    }

    if (typeof filterOption === 'object') {
      handleFilter(filterOption);
    }
  }, [filterOption]);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (
        priorityMenuRef.current != null &&
        !priorityMenuRef.current.contains(e.target as HTMLElement)
      ) {
        setShowPriorityFilterDropDown(false);
      }

      if (
        statusMenuRef.current != null &&
        !statusMenuRef.current.contains(e.target as HTMLElement)
      ) {
        setShowStatusFilterDropDown(false);
      }

      if (labelMenuRef.current != null && !labelMenuRef.current.contains(e.target as HTMLElement)) {
        setShowLabelFilterDropDown(false);
      }

      if (
        dueDateMenuRef.current != null &&
        !dueDateMenuRef.current.contains(e.target as HTMLElement)
      ) {
        setShowDueDateFilterDropDown(false);
      }

      if (
        effortMenuRef.current != null &&
        !effortMenuRef.current.contains(e.target as HTMLElement)
      ) {
        setShowEffortFilterDropDown(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  return (
    <>
      <div
        className={` ${styles.main} 
				${showFilterDropDown ? 'h-10' : 'h-0'} transition-all duration-300 ${
          showFilterDropDown ? 'opacity-100' : 'opacity-0'
        }`}
        // Please do not move styles to styles object. The props cannot be read in styles object.
      >
        <Combobox value={filterOption} onChange={setFilterOption} nullable={true}>
          <div
            className={`${styles.second} ${showFilterDropDown ? 'h-full' : 'h-0'}`}
            // Please do not move styles to styles object. The props cannot be read in styles object.
          >
            <div
              className={`${styles.third} ${showFilterDropDown ? 'h-full border' : 'h-0'} `}
              // Please do not move styles to styles object. The props cannot be read in styles object.
            >
              <Combobox.Button
                onClick={clearFilter}
                className={styles.button}
                ref={filterDropDownRef}
              >
                <ChevronUpDownIcon className={styles.downChevron} aria-hidden="true" />
                <Combobox.Input
                  className={styles.input}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </Combobox.Button>
            </div>

            <Combobox.Options
              className={` ${showFilterDropDown ? 'max-h-[600px]' : 'h-0'} ${styles.options}`}
            >
              {filteredGroup.length === 0 && query !== '' ? (
                <Combobox.Option
                  value={null}
                  className={({ active }) =>
                    ` ${active ? 'bg-[#1d3275] text-foreground' : 'text-muted-foreground'}`
                  }
                >
                  <div className={`${styles.firstOption}`}>
                    {nullPriority({})}
                    <div className={styles.aiFilter}>
                      <p>Option not found. &nbsp;</p>
                    </div>
                    <div>{`"${query}"`}</div>
                  </div>
                </Combobox.Option>
              ) : (
                <>
                  <div>
                    {filteredGroup.map((item) => (
                      <Combobox.Option
                        key={item.id}
                        className={({ selected, active }) =>
                          `${styles.secondOption} ${
                            active ? 'bg-[#1d3275]' : 'text-muted-foreground'
                          } ${item.border ? 'border-t' : ''}
                          ${selected ? 'font-medium bg-[#1d3275]' : 'font-normal'}
                          `
                        }
                        value={item}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`${styles.thirdOption} ${
                                selected
                                  ? 'font-medium text-foreground bg-[#1d3275]'
                                  : 'font-normal'
                              }`}
                            >
                              <div className={styles.svg}>{item.svg}</div>
                              {item.name}
                            </span>
                            {selected ? (
                              <span
                                className={`${styles.selectedSpan} ${
                                  active ? 'text-foreground bg-[#1d3275]' : 'text-[#1d3275]'
                                }`}
                              />
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))}{' '}
                  </div>
                </>
              )}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>
      <div id="priorityFilterDiv" ref={priorityMenuRef}>
        <PriorityFilterDropDown
          showPriorityFilterDropDown={showPriorityFilterDropDown}
          setShowPriorityFilterDropDown={setShowPriorityFilterDropDown}
          handleFilter={handleFilter}
        />
      </div>
      <div id="statusFilterDiv" ref={statusMenuRef}>
        <StatusFilterDropDown
          showStatusFilterDropDown={showStatusFilterDropDown}
          setShowStatusFilterDropDown={setShowStatusFilterDropDown}
          handleFilter={handleFilter}
        />
      </div>
      <div id="labelFilterDiv" ref={labelMenuRef}>
        <LabelFilterDropDown
          showLabelFilterDropDown={showLabelFilterDropDown}
          setShowLabelFilterDropDown={setShowLabelFilterDropDown}
          handleFilter={handleFilter}
        />
      </div>
      <div id="dueDateFilterDiv" ref={dueDateMenuRef}>
        <DueDateFilterDropDown
          showDueDateFilterDropDown={showDueDateFilterDropDown}
          setShowDueDateFilterDropDown={setShowDueDateFilterDropDown}
          handleFilter={handleFilter}
        />
      </div>
      <div id="effortFilterDiv" ref={effortMenuRef}>
        <EffortFilterDropDown
          showEffortFilterDropDown={showEffortFilterDropDown}
          setShowEffortFilterDropDown={setShowEffortFilterDropDown}
          handleFilter={handleFilter}
        />
      </div>
    </>
  );
};

export default FilterDropDown;
