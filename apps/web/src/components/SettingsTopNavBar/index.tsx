import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { SettingsTopNavbarProps } from "@/components/SettingsTopNavBar/SettingsTopNavbar.interfaces";
import { ChevronLeft, PanelLeft } from "lucide-react";

const SettingsTopNavBar = ({ setShowNavBar }: SettingsTopNavbarProps) => {
	const router = useRouter();
	const workspace = useAppSelector((state) => state.taskData.currentWorkspace);

	return (
		<div>
			<div className="flex items-center">
				<span onClick={setShowNavBar} className="px-4">
					<PanelLeft className="text-[#6B6F76] size-5" />
				</span>
				<div
					className="flex text-foreground items-center py-4 cursor-pointer"
					onClick={() => router.push(`/${workspace.url}`)}
				>
					<span className="mr-2 cursor-pointer">
						<ChevronLeft className="size-4 text-[#6b6f75] cursor-pointer" />
					</span>
					<h2>Settings</h2>
				</div>
			</div>
			<div>
				<span className="border-t border-border block" />
			</div>
		</div>
	);
};

export default SettingsTopNavBar;
