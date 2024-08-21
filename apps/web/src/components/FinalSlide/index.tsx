import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Button } from "../ui/button";

// Styles for customLetter styles - 'bg-accent font-normal text-lg flex px-3 pb-1 text-foreground mx-1.5 inline-block rounded', commented out until feature added.

const FinalSlide = () => {
	const router = useRouter();

	const workspace = useSelector(
		(state: RootState) => state.taskData.workspaces,
	);

	const handleClick = () => {
		router.push(`/${workspace[0].url}`);
	};

	return (
		<div className="h-screen w-full bg-card flex flex-col items-center justify-center text-center">
			<span className="text-foreground font-medium text-3xl mb-3">
				You are good to go!{" "}
			</span>
			{/* <p className="text-muted-foreground font-medium mb-8 flex items-center justify-center">
				Next explore Squared and create issues by pressing{' '}
				<span className={styles.customLetter}>c</span> when you are in the app commented out until feature added.
			</p> */}
			<p className="text-muted-foreground font-medium mb-8 flex items-center justify-center">
				Next explore Squared and begin creating issues in the app!
			</p>
			<Button type="button" onClick={handleClick}>
				Open Squared
			</Button>
		</div>
	);
};

export default FinalSlide;
