import React from "react";
import ButtonIcon from "../ButtonIcon";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { clearUser } from "@/store/userSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
      router.push(`${process.env.NEXT_PUBLIC_URL}`);
      toast.success(response.data.success);
    } catch (error) {}
  };
  return (
    <ButtonIcon
      icon={
        <FontAwesomeIcon
          className="text-gray-600 dark:text-gray-400"
          icon={faArrowRightFromBracket}
        />
      }
      tooltipLabel={"Log out"}
      labelPosition="right"
      handleClick={handleLogout}
      hoverBg="bg-card"
    />
  );
};
export default LogoutButton;
