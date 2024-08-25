"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { getUser } from "@/store/userSettings/thunks";
import type { LocalUser } from "./login/login.interfaces";

export default function Landingpage() {
	const [loading, setLoading] = useState<boolean>(true);
	const user = useAppSelector((state) => state.userSettings.user);

	const router = useRouter();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			if (user) {
				const actionResult = await dispatch(getUser());
				const userData = actionResult.payload as LocalUser;
				if (userData?.on_boarding && userData.workspaces.length) {
					router.replace(
						`${process.env.NEXT_PUBLIC_URL}/${userData.workspaces[0].url}`,
					);
				} else if (userData?.on_boarding && !userData.workspaces.length) {
					router.push("/join");
				} else if (userData && !userData.on_boarding) {
					router.push("/onboarding");
				} else {
					setLoading(false);
				}
			} else {
				setLoading(false);
				router.push("/login");
			}
		};
		fetchData();
	}, [user, dispatch, router]);

	return <div className="w-full flex items-center h-[100vh] bg-[#141414]" />;
}
