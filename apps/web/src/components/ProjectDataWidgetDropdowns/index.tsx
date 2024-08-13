import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { AssigneesTab, LabelsTab } from "../ProjectDataWidgetTabs";
import type { ProjectDataWidgetDropdownsProps } from "./ProjectDataWidgetDropdowns.interfaces";

export const ProjectDataWidgetDropdowns = ({
  assigneesData,
  labelsData,
}: ProjectDataWidgetDropdownsProps) => {
  const lightSettings = useAppSelector((state) => state.userSettings).theme;

  return (
    <ul className="flex flex-col w-full mt-10 text-foreground rounded-lg items-center justify-center">
      <li className="flex flex-row justify-center items-center w-full text-foreground">
        <AssigneesTab assigneesData={assigneesData} />
      </li>
      <li className="flex flex-row justify-center items-center w-full text-foreground">
        <LabelsTab labelsData={labelsData} />
      </li>
    </ul>
  );
};
