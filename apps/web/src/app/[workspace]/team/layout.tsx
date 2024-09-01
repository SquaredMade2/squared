"use client";
import Navbar from "@/components/NavBar";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { cn } from "@/utils/cn";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { navBarToggle } from "@/store/userSettings";

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { showNavBar } = useAppSelector((state) => state.userSettings);
	const dispatch = useAppDispatch();

	const toggleNavBar = (): void => {
		dispatch(navBarToggle(!showNavBar));
	};

	return (
		<div className="flex w-full overflow-hidden relative">
			{showNavBar && (
				<div
					className="w-full h-full bg-gray-500 bg-opacity-40 absolute top-0 left-0 z-10 md:hidden"
					onClick={toggleNavBar}
				/>
			)}
			<div
				className={cn(
					"absolute md:static transition-all duration-500 ease-in-out z-10 w-72 h-full",
					showNavBar ? "left-0 top-0" : "-left-[100%]",
				)}
			>
				<Navbar />
			</div>

			<main className="flex flex-grow overflow-hidden">{children}</main>
		</div>
	);
}
