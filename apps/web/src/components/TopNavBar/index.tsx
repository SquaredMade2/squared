import { useEffect, useContext } from "react";
import type React from "react";
import TopNavBarDisplay from "@/components/TopNavBarDisplay";
import FilterDropDown from "@/components/FilterDropdowns";
import { SocketContext } from "@/app/SocketProvider";
import ToggleNavBar from "../ToggleNavBar";
import { useAuthStore } from "@/store";

const TopNavBar: React.FC = () => {
	const socket = useContext(SocketContext);
	const user = useAuthStore((state) => state.user);

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
		<div className="flex flex-col flex-none justify-start items-start mt-4">
			<div className="w-full flex items-center">
				<ToggleNavBar />
				<div className="md:hidden">All Issues</div>
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
