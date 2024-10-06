import cron from "node-cron";
import { handleSprintTransitions } from "./sprintTransitions";

export function startSprintTransitionJob() {
	// Run the job every day at midnight
	cron.schedule("0 0 * * *", async () => {
		console.log("Running sprint transitions job");
		await handleSprintTransitions();
	});
}
