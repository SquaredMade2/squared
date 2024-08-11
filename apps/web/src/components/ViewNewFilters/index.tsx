import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { deleteAllCurrentFilters } from "@/store/filterPage/actions";
import { useDispatch } from "react-redux";
import FilterDropDown from "@/components/FilterDropdown";
import SelectedFiltersBar from "@/components/SelectedFiltersBar";
import TopNavBarDisplay from "@/components/TopNavBarDisplay";
import type { ViewNewFiltersProps } from "@/components/ViewNewFilters/ViewNewFilters.interfaces";
import { Filter } from "lucide-react";

const ViewNewFilters = ({
  handleFilter,
  filterOption,
  showFilterSaveForm,
  handleFilterSaveForm,
}: ViewNewFiltersProps) => {
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showFilterDropDown, setShowFilterDropDown] = useState(false);
  const [showFilterStatusBar, setShowFilterStatusBar] = useState(false);
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const currentFilters = useAppSelector(
    (state) => state.filterPage.currentFilters
  );

  function getCurrentDimension(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const handleFilterSave = (): void => {
    if (!showFilterSaveForm) {
      handleFilterSaveForm(true);
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    const updateDimension = (): void => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (
        menuRef.current != null &&
        !menuRef.current.contains(e.target as HTMLElement)
      ) {
        setShowFilterDropDown(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <header className="max-w-screen">
      <nav className="bg-background h-[6vh] grid sm:grid-cols-2 w-full xs:grid-rows-2 xs:h-[14vh]">
        <div className="bg-linearPurple-600 flex flex-none justify-start items-center">
          <p className="w-22 text-sm rounded flex justify-center items-center text-foreground h-full flex-row">
            Issues
          </p>
          {screenSize.width > 640 && (
            <div
              ref={menuRef}
              className="relative px-2.5 cursor-pointer text-xs xs:w-1/3 xs:flex w-22 bg-card ml-4 xs:ml-0 mr-2 rounded border border-border border-gray-500 text-foreground hover:bg-accent group"
            >
              <button
                onClick={
                  currentFilters.priority.length > 0 ||
                  currentFilters.status.length > 0
                    ? () => {
                        handleFilter(null);
                        dispatch(deleteAllCurrentFilters());
                      }
                    : () => {
                        setShowFilterDropDown(true);
                      }
                }
                className="text-xs w-full flex items-center justify-center h-10 mr-2 p-0.5 border-border bg-card text-foreground cursor-pointer hover:bg-accent group-hover:bg-accent"
                type="button"
              >
                <div className="mr-2">
                  <Filter className="size-5" />
                </div>
                <p>{showFilterStatusBar ? "Clear Filters x" : "Filter"}</p>
              </button>
              <FilterDropDown
                showFilterDropDown={showFilterDropDown} // used to keep track of filter being show or not
                setShowFilterDropDown={setShowFilterDropDown} // used to toggle filter on and off
                handleFilter={handleFilter} // used to set filter being used -- future todo: change to redux
              />
            </div>
          )}
        </div>
        <div className="bg-purple-600 flex flex-none sm:justify-end items-center xs:grid-cols-2">
          <TopNavBarDisplay />
          {!showFilterStatusBar && (
            <button
              className="bg-popover flex items-center border border-solid border-border md:flex md:text-sm hidden hidden rounded m-1 px-3 h-10 py-0.5 text-foreground space-x-2 cursor-pointer hover:bg-accent"
              onClick={handleFilterSave}
              type="button"
            >
              <p>Save</p>
            </button>
          )}
        </div>
      </nav>
      <div className={`${showFilterStatusBar ? "block" : "hidden"} w-full`}>
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

export default ViewNewFilters;
