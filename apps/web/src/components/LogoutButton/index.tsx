import React from "react";
import ButtonIcon from "../ButtonIcon";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { clearUser } from "@/store/userSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";

const LogoutButton = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { toast } = useToast();
	const signOutHandler = async () => {
		await signOut({ redirect: false }).then(() => {
			router.push("/login");
		});
	};

	const handleLogout = async (): Promise<void> => {
		await signOutHandler();
		try {
			const response = await axios({
				method: "POST",
				url: `${process.env.NEXT_PUBLIC_SERVER}/auth/logout`,
				withCredentials: true,
			});
			dispatch(clearUser());
			router.replace(`${process.env.NEXT_PUBLIC_URL}`);

			toast({ title: response.data.success });
		} catch (error) {}
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
