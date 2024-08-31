import IconLeftMenu from "../IconLeftMenu";
import NewIssueModal from "../NewIssueModal";
import { usePathname } from "next/navigation";

const CurrentNavbar = () => {
	const currentRoute = usePathname();
	const isLoginRoute =
		currentRoute.includes("/login") ||
		currentRoute.includes("/register") ||
		currentRoute === "/";
	return (
		!isLoginRoute && (
			<>
				<div className="w-14 min-h-screen bg-muted dark:bg-accent border-r">
					<IconLeftMenu />
				</div>
				<div className="absolute top-[100px] left-full">
					<NewIssueModal />
				</div>
			</>
		)
	);
};

export default CurrentNavbar;
