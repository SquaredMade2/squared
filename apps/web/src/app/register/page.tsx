"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/storeZ";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterUser() {
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [hidePassword, setHidePassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();
	const register = useAuthStore((state) => state.register);

	const handlePushLogin = () => {
		router.push("/login");
	};

	const registerUser = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		setIsLoading(true);
		const { name, email, password } = data;
		try {
			const response = await register({
				name,
				username: name.split(" ").join(".").toLocaleLowerCase(),
				email,
				password,
				type: "register",
				provider: "credentials",
			});

			toast({ title: response.message, variant: response.variant });
		} catch (error) {
			if (error instanceof Error)
				toast({ title: error.message, variant: "destructive" });
		}
		setIsLoading(false);
	};

	const displayPasswordIcon = hidePassword ? (
		<Eye className="size-4 text-[#D8D8D8]" />
	) : (
		<EyeOff className="size-4 text-[#D8D8D8]" />
	);
	const displayPassword = hidePassword ? "text" : "password";

	return (
		<div className="top-0 w-full flex items-center justify-center h-[100vh]">
			<Card className="w-5/6 lg:w-1/3 bg-gradient-to-b from-primary/10 to-bg-card">
				<CardHeader>
					<CardTitle className="uppercase">Register your account</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="mt-10 space-y-6" onSubmit={registerUser}>
						<div className="flex flex-col gap-3">
							<Label htmlFor="name">Name</Label>
							<Input
								type="text"
								placeholder="Your name.."
								value={data.name}
								onChange={(e) => setData({ ...data, name: e.target.value })}
							/>
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="email">Email address</Label>
							<Input
								type="email"
								placeholder="Email address.."
								value={data.email}
								onChange={(e) => setData({ ...data, email: e.target.value })}
							/>
						</div>
						<div className="flex flex-col gap-3 relative">
							<Label htmlFor="password">Password</Label>
							<Input
								type={displayPassword}
								placeholder="Password.."
								value={data.password}
								onChange={(e) => setData({ ...data, password: e.target.value })}
								autoComplete="new-password"
							/>
							<button
								type="button"
								onClick={() => setHidePassword((prev) => !prev)}
								className="absolute right-3 top-10 cursor-pointer"
							>
								{displayPasswordIcon}
							</button>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? <Loader2 className="animate-spin" /> : "Register"}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="text-center">
					Already a member?{" "}
					<Button onClick={handlePushLogin} variant={"link"}>
						Click here to Log in
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
