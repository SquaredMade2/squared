"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { InputChangeEvent, FormSubmitEvent } from "@/types";
import { SqLogo } from "@/components/Svg";
import { ChevronLeft } from "lucide-react";
import { useMetaData } from "@/utils/useMetaData";

export default function ResetPassword() {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const router = useRouter();
	const params = useParams();
	const token = params.token as string;
	const { toast } = useToast();

	const handleNewPassChange = (e: InputChangeEvent) => {
		setNewPassword(e.target.value);
	};

	const handleConfirmChange = (e: InputChangeEvent) => {
		setConfirmPassword(e.target.value);
	};

	const handleSubmit = async (e: FormSubmitEvent) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			toast({
				title: "Passwords don't match.",
				variant: "destructive",
			});
			return;
		}

		try {
			const { data: responseData } = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/auth/password/${token}`,
				{ token, newPassword },
			);
			toast({ title: responseData.message });
			router.push("/login");
		} catch (error) {
			toast({
				title: "Failed to reset password. Please try again.",
				variant: "destructive",
			});
			console.error("Failed to reset password:", error);
		}
	};

	// Custom hook for metadata
	useMetaData(
		"Reset Password",
		"Enter and confirm your new password to complete the password reset process and secure your account.",
	);

	return (
		<div className="w-full flex items-center h-[100vh] bg-[#141414]">
			<div className="flex flex-1 flex-col justify-center space-y-6 px-24 py-16 max-w-fit mx-auto bg-gradient-to-b from-[#17181c] to-[#23293b] align-middle rounded-lg">
				<div className="flex flex-row justify-center items-center uppercase text-[#D8D8D8] gap-2 text-lg font-semibold">
					<SqLogo />
					Squared
				</div>
				<Link
					href={"/login"}
					className="text-white flex items-center space-x-2"
				>
					<ChevronLeft className="size-4 text-[#6b6f75] cursor-pointer" />
					<h2 className="text-sm">Back to Log in</h2>
				</Link>
				<div className="sm:mx-auto sm:w-full">
					<h2 className="uppercase text-[#D8D8D8] text-center text-4xl xs:text-2xl font-bold leading-9 tracking-tight">
						New Password
					</h2>
				</div>
				<div className="sm:mx-auto sm:w-[90%]">
					<h2 className="text-sm text-[#9597ad] text-center">
						Please create new password that you don&apos;t use on any other site
					</h2>
				</div>
				<form className="mt-6 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="newPassword"
							className="text-[#D8D8D8] block text-sm font-medium leading-6 text-[#]"
						>
							New Password
						</label>
						<div className="mt-2">
							<input
								id="newPassword"
								placeholder="Enter new password..."
								type="password"
								value={newPassword}
								onChange={handleNewPassChange}
								className="bg-[#282E43] text-[#D8D8D8] block w-full rounded-md border-0 pl-3 py-3 shadow-sm placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
								required
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="text-[#D8D8D8] block text-sm font-medium leading-6 text-[#]"
						>
							Confirm new password
						</label>
						<div className="mt-2">
							<input
								id="confirmPassword"
								placeholder="Confirm new password..."
								type="password"
								value={confirmPassword}
								onChange={handleConfirmChange}
								className="bg-[#282E43] text-[#D8D8D8] block w-full rounded-md border-0 pl-3 py-3 shadow-sm placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
								required
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-[#174EFF] px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Reset Password
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
