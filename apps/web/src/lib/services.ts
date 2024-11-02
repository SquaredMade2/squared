import { EventService } from "@/gen/rpc/event";
import { SprintService } from "@/gen/rpc/sprint";

export const sprintService = new SprintService(
	process.env.NEXT_PUBLIC_SERVER ?? "http://localhost:5173",
);
export const eventService = new EventService(
	process.env.NEXT_PUBLIC_SERVER ?? "http://localhost:5173",
);
