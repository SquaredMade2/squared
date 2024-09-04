import { useState, useEffect, useRef, useContext } from "react";
import type React from "react";
import TopNavBarDisplay from "@/components/TopNavBarDisplay";
import FilterDropDown from "@/components/FilterDropdown";
import { Filter } from "lucide-react";
import { ProjectDataWidget } from "@/components/ProjectDataWidget";
import { SocketContext } from "@/app/SocketProvider";
import NotificationsList from "@/components/NotificationsList";
import ToggleNavBar from "../ToggleNavBar";
import { useAuthStore, useViewsStore } from "@/storeZ/provider";

export const setFillColor = (theme: string): undefined | string => {
	switch (true) {
		case theme === "light":
			return "black";
		case theme === "dark":
			return "white";
		default:
			return;
	}
};

const TopNavBar: React.FC = () => {
	const [showFilterDropDown, setShowFilterDropDown] = useState(false);
	const [showNotification, setShowNotification] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const notificationButtonRef = useRef(null);

	const [screenSize, setScreenSize] = useState(getCurrentDimension());
	const { currentFilter, removeFilter } = useViewsStore().getState();

	const socket = useContext(SocketContext);
	const { user } = useAuthStore().getState();

	function getCurrentDimension(): { width: number; height: number } {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	}

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

	useEffect(() => {
		socket.emit("socketId", user?.id);
		socket.emit("getUser", user?.id);
		socket.on("send_notification", (data: unknown) => {
			// Handle incoming notifications
		});
		socket.on("new_notification", (data: unknown) => {
			// Handle new notifications
		});
		socket.on("notification_removed", (data: unknown) => {
			// Handle notification removal
		});
		return () => {
			socket.off("send_notification");
			socket.off("new_notification");
			socket.off("notification_removed");
		};
	}, [socket.id]);

	return (
		<header className="max-w-screen">
			<nav className="h-[7vh] grid sm:grid-cols-2 w-full xs:grid-rows-2 xs:h-[14vh]">
				<div className="flex flex-none justify-start items-center">
					<div className="w-full flex flex-none justify-start items-center">
						<div className="md:hidden cursor-pointer mr-2">
							<ToggleNavBar />
						</div>
						<button
							className="w-22 text-sm rounded flex justify-center items-center text-foreground h-full flex-row"
							type="button"
						>
							<div>All Issues</div>
						</button>
						{screenSize.width > 640 && (
							<div
								ref={menuRef}
								className="relative px-2.5 cursor-pointer text-xs xs:w-1/3 xs:flex w-22 bg-card ml-4 xs:ml-0 mr-2 rounded border border-border text-foreground hover:bg-accent group"
							>
								<button
									type="button"
									onClick={
										currentFilter?.conditions.length &&
										currentFilter?.conditions?.length > 0
											? () => {
													removeFilter();
												}
											: () => {
													setShowFilterDropDown(true);
												}
									}
									className="text-xs w-full flex items-center justify-center h-10 mr-2 p-0.5 border-border bg-card text-foreground cursor-pointer hover:bg-accent group-hover:bg-accent"
								>
									<div className="mr-2">
										<Filter className="size-5" />
									</div>
									<p>
										{currentFilter?.conditions.length &&
										currentFilter?.conditions?.length > 0
											? "Clear Filters x"
											: "Filter"}
									</p>
								</button>
								<FilterDropDown />
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-none sm:justify-end items-center xs:grid-cols-2">
					<div className="xs:w-full">
						{screenSize.width < 640 && (
							<div
								ref={menuRef}
								className="relative px-2.5 cursor-pointer text-xs xs:w-1/3 xs:flex w-22 bg-card ml-4 xs:ml-0 mr-2 rounded border border-border text-foreground hover:bg-accent"
							>
								<button
									type="button"
									onClick={
										currentFilter?.conditions.length &&
										currentFilter?.conditions?.length > 0
											? () => {
													removeFilter();
												}
											: () => {
													setShowFilterDropDown(true);
												}
									}
									className="text-xs w-full flex items-center justify-center h-10 mr-2 p-0.5 border-border bg-card text-foreground cursor-pointer hover:bg-accent"
								>
									<p>
										{currentFilter?.conditions.length &&
										currentFilter?.conditions?.length > 0
											? "Clear Filters x"
											: "+ Filter"}
									</p>
								</button>
								<FilterDropDown />
							</div>
						)}
					</div>
					<div className="flex items-center mr-6 mt-2 relative">
						{showNotification && (
							<NotificationsList
								notificationButtonRef={notificationButtonRef}
								setShowNotification={setShowNotification}
								showNotification={showNotification}
							/>
						)}
					</div>
					<div className="">
						<TopNavBarDisplay />
					</div>
				</div>
			</nav>
		</header>
	);
};

export default TopNavBar;
