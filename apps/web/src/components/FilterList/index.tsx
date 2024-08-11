import { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { getFilteredViews } from "@/store/filterPage/actions";
import FilterListDropDown from "@/components/FilterListDropDown";

import { CircleUser, Layers3 } from "lucide-react";
import type { FilterListProps } from "./FilterList.interfaces";
import type { AppDispatch, RootState } from "@/store";
import { useTheme } from "next-themes";

const FilterList = ({ searchInput }: FilterListProps) => {
  const { theme } = useTheme();
  const filters = useSelector((state: RootState) => state.filterPage.filters);
  const teamId = useSelector(
    (state: RootState) => state.taskData.currentTeam._id
  );
  const userName = useSelector((state: RootState) => state.userSettings.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getFilteredViews(teamId));
  }, []);

  return (
    <div className="pt-3.5">
      {filters.length > 0 ? (
        <div className="h-full bg-card overflow-hidden border border-border rounded-lg">
          {filters
            .filter((filter) => {
              return filter.filterTitle
                .toString()
                .replace(/\s/g, "")
                .toLowerCase()
                .includes(searchInput.replace(/\s/g, "").toLowerCase());
            })
            .map((filter) => {
              return (
                <div
                  key={filter._id.toString()}
                  className={`grid grid-cols-2 h-[7vh] items-center bg-gradient-to-r ${
                    theme === "dark"
                      ? "from-[#1d2029] to-[#0e0f11]"
                      : "from-[#F7F7F7] to-[#FFFFFF]"
                  } border-b border-border`}
                >
                  <Link href={`/filter/${filter._id}`}>
                    <div className="flex items-center">
                      <div className="ml-5">
                        <Layers3 className="size-4 text-[#858699]" />
                      </div>
                      <div className="ml-4 text-foreground">
                        {filters.length > 0
                          ? filter.filterTitle.toString()
                          : null}
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/filter/${filter._id}`}
                      className="md:flex hidden items-center"
                    >
                      <div className="mr-3">
                        <CircleUser className="size-4 text-[#6A6F75]" />
                      </div>
                      <div className="mr-3 text-foreground">
                        <p>{userName.name}</p>
                      </div>
                    </Link>
                    <FilterListDropDown
                      filterId={filter._id.toString()}
                      filterTitle={filter.filterTitle.toString()}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default FilterList;
