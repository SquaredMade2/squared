import { useState, useEffect, useContext } from "react";
import type React from "react";
import TopNavBarDisplay from "@/components/TopNavBarDisplay";
import FilterDropDown from "@/components/FilterDropdowns";
import { SocketContext } from "@/app/SocketProvider";
import ToggleNavBar from "../ToggleNavBar";
import { useAuthStore } from "@/store";

const TopNavBar: React.FC = () => {
	const [screenSize, setScreenSize] = useState(getCurrentDimension());

	const socket = useContext(SocketContext);
	const user = useAuthStore((state) => state.user);

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
		socket.emit("socketId", user?.id);
		socket.emit("getUser", user?.id);
		socket.on("send_notification", () => {
			// Handle incoming notifications
		});
		socket.on("new_notification", () => {
			// Handle new notifications
		});
		socket.on("notification_removed", () => {
			// Handle notification removal
		});
		return () => {
			socket.off("send_notification");
			socket.off("new_notification");
			socket.off("notification_removed");
		};
	}, [socket.id]);

	return (
		<header className="w-full max-w-screen px-2 sm:px-5">
			<nav className="h-[7vh] grid sm:grid-cols-2 w-full xs:grid-rows-2 xs:h-[14vh]">
				<div className="flex flex-none justify-start items-center">
					<div className="w-full flex flex-none justify-start items-center gap-4">
						<div className="md:hidden cursor-pointer mr-2">
							<ToggleNavBar />
						</div>
						<button
							className="w-22 text-sm rounded flex justify-center items-center text-foreground h-full flex-row"
							type="button"
						>
							<div>All Issues</div>
						</button>
						{screenSize.width > 640 && <FilterDropDown />}
					</div>
				</div>
				<div className="flex flex-none sm:justify-end items-center xs:grid-cols-2">
					<div className="xs:w-full">
						{screenSize.width < 640 && <FilterDropDown />}
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
