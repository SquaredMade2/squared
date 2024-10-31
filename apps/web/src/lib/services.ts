import { SprintService } from "@/gen/rpc/sprint";

export const sprintService = new SprintService(
	process.env.NEXT_PUBLIC_SERVER ?? "http://localhost:5173",
);
