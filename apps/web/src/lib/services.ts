import { FilterService } from "@/gen/rpc/filter";
import { SprintService } from "@/gen/rpc/sprint";
import { TaskService } from "@/gen/rpc/task";
import { TeamService } from "@/gen/rpc/team";

const serverUrl = process.env.NEXT_PUBLIC_SERVER ?? "http://localhost:5173";

export const filterService = new FilterService(serverUrl);
export const sprintService = new SprintService(serverUrl);
export const taskService = new TaskService(serverUrl);
export const teamService = new TeamService(serverUrl);
