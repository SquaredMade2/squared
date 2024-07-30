import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { SettingsTopNavbarProps } from "@/components/SettingsTopNavBar/SettingsTopNavbar.interfaces";
import { ChevronLeft, PanelLeft } from "lucide-react";

const styles = {
	main: "flex items-center",
	settingsWrapper: "flex text-foreground items-center py-4 cursor-pointer",
	backButton: "mr-2 cursor-pointer",
	toggleButton: "px-4",
	underline: "border-t border-border block",
};

const SettingsTopNavBar = ({ setShowNavBar }: SettingsTopNavbarProps) => {
	const router = useRouter();
	const workspace = useAppSelector((state) => state.taskData.currentWorkspace);

	return (
		<div>
			<div className={styles.main}>
				<span onClick={setShowNavBar} className={styles.toggleButton}>
					<PanelLeft className="text-[#6B6F76] size-5" />
				</span>
				<div
					className={styles.settingsWrapper}
					onClick={() => router.push(`/workspace/${workspace.url}`)}
				>
					<span className={styles.backButton}>
						<ChevronLeft className="size-4 text-[#6b6f75] cursor-pointer" />
					</span>
					<h2>Settings</h2>
				</div>
			</div>
			<div>
				<span className={styles.underline} />
			</div>
		</div>
	);
};

export default SettingsTopNavBar;
