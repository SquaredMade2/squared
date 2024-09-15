import React from "react";
import ButtonIcon from "../ButtonIcon";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store";

const LogoutButton = () => {
	const router = useRouter();
	const { toast } = useToast();
	const logout = useAuthStore((state) => state.logout);

	const handleLogout = async (): Promise<void> => {
		try {
			await logout();

			router.replace("/login");

			toast({ title: "Logged out successfully." });
		} catch (error) {
			console.error("Logout failed", error);
			toast({ title: "Failed to log out", variant: "destructive" });
		}
	};
	return (
		<ButtonIcon
			icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
			tooltipLabel={"Log out"}
			labelPosition="right"
			handleClick={handleLogout}
			hoverBg="bg-card"
		/>
	);
};
export default LogoutButton;
