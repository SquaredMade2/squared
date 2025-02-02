import { Button } from "@/components/ui/button";
import { useViewStore, useWorkspaceStore } from "@/store";
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
		<div className="fixed top-0 flex h-12 min-w-[100vw] items-center justify-between border-b px-4 shadow md:hidden">
			<Button
				variant="ghost"
				size="icon"
				className="p-2"
				onClick={() => setShowNavbar(!showNavbar)}
				aria-label="Toggle navigation menu"
			>
				<PanelLeft className="h-5 w-5 text-muted-foreground" />
			</Button>
			<h1 className="font-semibold text-lg">Settings</h1>
			<Button
				variant="ghost"
				size="sm"
				className="flex items-center p-2"
				onClick={handleBackClick}
			>
				<ChevronLeft className="mr-1 h-4 w-4 text-muted-foreground" />
				<span className="font-medium text-sm">Back</span>
			</Button>
		</div>
	);
};

export default SettingsTopNavBar;
