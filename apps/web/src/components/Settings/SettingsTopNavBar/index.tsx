import { Button } from "@/components/ui/button";
import { useViewStore } from "@/store";
import { useOrganization } from "@clerk/nextjs";
import { ChevronLeft, PanelLeft } from "@squaredmade/icons";
import { useRouter } from "next/navigation";

const SettingsTopNavBar = () => {
	const router = useRouter();
	const { organization } = useOrganization();
	const { showNavbar, setShowNavbar } = useViewStore((state) => state);
	const handleBackClick = () => {
		if (organization) {
			router.push(`/${organization.slug}`);
		}
	};

	return (
		<div className="fixed top-0 flex h-12 min-w-[100vw] items-center justify-between border-b px-4 shadow-sm md:hidden">
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
