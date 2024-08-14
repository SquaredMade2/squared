import React from "react";
import { useSelector } from "react-redux";
import type { CommandMenuProps } from "./CommandMenu.interfaces";
import type { RootState } from "@/store";
import { Command } from "lucide-react";
import { useTheme } from "next-themes";

const CommandMenu = ({ handleNextPage }: CommandMenuProps) => {
	const { theme } = useTheme();

	return (
		<div className="h-screen w-full flex flex-col items-center justify-center bg-card">
			<h1 className="text-nav text-3xl mb-3 font-medium">Command menu </h1>
			<p className="text-muted-foreground font-medium mb-8">
				Use the contextual menu to mange one or more issues in any given view
				you are in.
			</p>

			<div className=" flex flex-col border border-border min-w-[600px] px-6 py-8 rounded-lg items-center">
				<span className="text-nav font-medium mb-6">
					Try opening command menu with :
				</span>
				<div className="flex flex-row items-center">
					<div className="bg-accent h-14 w-14 py-2.5 shadow-custom-black px-4 rounded-lg m-1.5 items-center justify-center box-content">
						<Command className={"text-[#EEEFFC] dark:text-[#3C4149]"} />
					</div>

					<div className="bg-accent rounded-lg px-6 py-2 shadow-custom-black flex items-center m-1.5 justify-center">
						<p className="text-6xl text-nav font-medium"> K</p>
					</div>
				</div>
			</div>
			<button
				type="button"
				className="w-80 h-12 border border-border mt-12 text-nav rounded hover:bg-background font-medium transition ease-out duration-100"
				onClick={handleNextPage}
			>
				Continue
			</button>
		</div>
	);
};

export default CommandMenu;
