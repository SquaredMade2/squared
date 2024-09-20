import { useState, useEffect, useRef, useContext } from "react";
import type React from "react";
import TopNavBarDisplay from "@/components/TopNavBarDisplay";
import FilterDropDown from "@/components/FilterDropdowns";
import { SocketContext } from "@/app/SocketProvider";
import ToggleNavBar from "../ToggleNavBar";
import { useAuthStore, useFilterStore } from "@/store";
import { Button } from "../ui/button";

const TopNavBar: React.FC = () => {
	const [showNotification, setShowNotification] = useState(true);
	const menuRef = useRef<HTMLDivElement>(null);
	const notificationButtonRef = useRef(null);

	const { clearFilter } = useFilterStore((state) => state);

	const socket = useContext(SocketContext);
	const user = useAuthStore((state) => state.user);

	function getCurrentDimension(): { width: number; height: number } {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	}

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
		<div className="flex flex-col flex-none justify-start items-start">
			<div className="w-full flex items-center">
				<ToggleNavBar />
				<div>All Issues</div>
			</div>
			<div className="flex w-full justify-between">
				<div className="flex gap-3 mb-4">
					<FilterDropDown />
				</div>
				<TopNavBarDisplay />
			</div>
		</div>
	);
};

export default TopNavBar;
