import { useViewStore, useWorkspaceStore } from "@/store";
import { Button } from "@squared/ui/button";
import { ChevronLeft, PanelLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const SettingsTopNavBar = () => {
	const router = useRouter();
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { showNavbar, setShowNavbar } = useViewStore((state) => state);
	const handleBackClick = () => {
		if (workspace) {
			router.push(`/${workspace.url}`);
		}
	};

	return (
		<div className="flex items-center justify-between px-4 border-b shadow md:hidden min-w-[100vw] h-12 fixed top-0">
			<Button
				variant="ghost"
				size="icon"
				className="p-2"
				onClick={() => setShowNavbar(!showNavbar)}
				aria-label="Toggle navigation menu"
			>
				<PanelLeft className="h-5 w-5 text-muted-foreground" />
			</Button>
			<h1 className="text-lg font-semibold">Settings</h1>
			<Button
				variant="ghost"
				size="sm"
				className="flex items-center p-2"
				onClick={handleBackClick}
			>
				<ChevronLeft className="h-4 w-4 mr-1 text-muted-foreground" />
				<span className="text-sm font-medium">Back</span>
			</Button>
		</div>
	);
};

export default SettingsTopNavBar;
