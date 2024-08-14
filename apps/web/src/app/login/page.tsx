"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { InputChangeEvent, FormSubmitEvent } from "@/types";
import { setUser } from "@/store/userSettings";
import { getUser } from "@/store/userSettings/thunks";
import type { FormData } from "@/app/login/login.interfaces";
import type { LocalUser } from "@/app/login/login.interfaces";
import { SqLogo } from "@/components/Svg";
import { useSession } from "next-auth/react";

export default function Login() {
	const [loading, setLoading] = useState<boolean>(true);
	const user = useAppSelector((state) => state.userSettings.user);
	const [data, setData] = useState<FormData>({
		email: "",
		password: "",
	});
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const handleRegisterPush = () => {
		router.push("/register");
	};
	const { data: session, status } = useSession();
	const { on_boarding, workspaces } = session?.userData || {};

	const handlePasswordChange = (e: InputChangeEvent) => {
		setData({ ...data, password: e.target.value });
	};

	const handleEmailChange = (e: InputChangeEvent) => {
		setData({ ...data, email: e.target.value });
	};

	const loginUser = async (e: FormSubmitEvent) => {
		e.preventDefault();
		const { email, password } = data;
		try {
			const { data: responseData } = await axios({
				method: "POST",
				url: `${process.env.NEXT_PUBLIC_SERVER}/auth/login`,
				data: { email, password },
				withCredentials: true,
			});
			if (responseData.error) {
				toast({ title: responseData.error, variant: "destructive" });
			} else {
				dispatch(setUser(responseData.user));
				toast({ title: "Login Successful, Welcome!" });
				setData({
					email: "",
					password: "",
				});
				if (responseData.redirectTo) {
					router.push(`workspace/${responseData.redirectTo}`);
				} else {
					toast({
						title: "No workspace found for redirection.",
						variant: "destructive",
					});
				}
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const serverError = error.response?.data.error;
				if (serverError) {
					toast({ title: serverError, variant: "destructive" });
				} else {
					toast({
						title: "Something went wrong",
						variant: "destructive",
					});
				}
			} else {
				console.error(error);
				toast({
					title: "An unexpected error occurred",
					variant: "destructive",
				});
			}
		}
	};

	const LogInAuthentications = () => {
		try {
			setLoading(true);
			if (status === "authenticated") {
				if (session?.userData) {
					dispatch(setUser(session?.userData));
					if (on_boarding && workspaces?.length) {
						router.push(`workspace/${workspaces[0].url}`);
					} else if (on_boarding && !workspaces?.length) {
						router.push("/join");
					} else if (!on_boarding) {
						router.push("/onboarding");
					} else {
						setLoading(false);
					}
				}
				toast({ title: "Login Successful, Welcome!" });
			} else {
				setLoading(false);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		LogInAuthentications();
	}, [session, dispatch, status]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			if (user) {
				const actionResult = await dispatch(getUser());
				const userData = actionResult.payload as LocalUser;
				if (userData?.on_boarding && userData.workspaces.length) {
					router.replace(
						`${process.env.NEXT_PUBLIC_URL}/workspace/${userData.workspaces[0].url}`,
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
			}
		};
		fetchData();
	}, [user, dispatch, router]);

	return (
		<div className="top-0 w-full flex items-center h-[100vh] bg-[#141414]">
			{!loading && (
				<div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-14 max-w-fit mx-auto bg-gradient-to-b from-[#17181c] to-[#23293b] align-middle rounded-lg">
					<div className="flex flex-row justify-center items-center uppercase text-[#D8D8D8] gap-2 text-lg font-semibold">
						<SqLogo />
						Squared
					</div>
					<div className="sm:mx-auto sm:w-[90%]">
						<h2 className="uppercase text-[#D8D8D8] mt-8 text-center text-4xl xs:text-2xl font-bold leading-9 tracking-tight">
							Sign in to your account
						</h2>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<form className="space-y-6" onSubmit={loginUser}>
							<div>
								<label
									htmlFor="email"
									className="text-[#D8D8D8] block text-sm font-medium leading-6 text-[#]"
								>
									Email address
								</label>
								<div className="mt-2">
									<input
										placeholder="Enter email.."
										type="email"
										value={data.email}
										onChange={handleEmailChange}
										className="bg-[#282E43] text-[#D8D8D8] block w-full rounded-md border-0 pl-3 py-3 shadow-sm placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="text-[#D8D8D8] block text-sm font-medium leading-6 text-[#]"
									>
										Password
									</label>
									<Link
										href={"/password/reset"}
										className="text-[#5d76c9] text-sm hover:text-indigo-500"
									>
										Forgot Password?
									</Link>
								</div>
								<div className="mt-2">
									<input
										placeholder="Enter password.."
										type="password"
										onChange={handlePasswordChange}
										className="bg-[#282E43] text-[#D8D8D8] block w-full rounded-md border-0 pl-3 py-3 shadow-sm placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-[#174EFF] px-3 py-2 text-sm font-semibold leading-6 text-foreground shadow-sm hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Sign in
								</button>
							</div>
						</form>
						{/* <SignInButtons
							logo={googleLogo()}
							btnStyle="flex w-full justify-center rounded-md bg-[#FFFFFF] px-3 py-2 text-sm font-semibold leading-6 text-[#2b5dff] shadow-sm hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
							provider="Google"
							handleLogInOptions={handleLogInOptions}
						/>
						<SignInButtons
							logo={githubLogo()}
							btnStyle="flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold leading-6 text-foreground shadow-sm hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
							provider="Github"
							handleLogInOptions={handleLogInOptions}
						/> */}
						<p className="mt-10 text-center text-sm text-gray-500">
							Not a member?{" "}
							<button
								type="button"
								onClick={handleRegisterPush}
								className="font-semibold leading-6 text-[#5d76c9] hover:text-indigo-500 hover:cursor-pointer"
							>
								Sign up for free
							</button>
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
