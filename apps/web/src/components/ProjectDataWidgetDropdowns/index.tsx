import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { AssigneesTab, LabelsTab } from "../ProjectDataWidgetTabs";
import type { ProjectDataWidgetDropdownsProps } from "./ProjectDataWidgetDropdowns.interfaces";

export const ProjectDataWidgetDropdowns = ({
	assigneesData,
	labelsData,
}: ProjectDataWidgetDropdownsProps) => {
	const lightSettings = useAppSelector((state) => state.userSettings).theme;

	const styles = {
		navbar:
			"flex flex-col w-full mt-10 text-foreground rounded-lg items-center justify-center",
		eachNav:
			"flex flex-row justify-center w-1/3 h-full rounded-lg text-center mr-1 text-sm",
		button: "cursor-pointer text-center",
		tabWrappers:
			"flex flex-row justify-center items-center w-full text-foreground",
	};

	return (
		<ul className={styles.navbar}>
			<li className={styles.tabWrappers}>
				<AssigneesTab assigneesData={assigneesData} />
			</li>
			<li className={styles.tabWrappers}>
				<LabelsTab labelsData={labelsData} />
			</li>
		</ul>
	);
};
