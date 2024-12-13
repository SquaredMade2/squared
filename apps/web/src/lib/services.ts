import { CommentService } from "@/gen/rpc/comment";
import { EventService } from "@/gen/rpc/event";
import { FilterService } from "@/gen/rpc/filter";
import { SprintService } from "@/gen/rpc/sprint";
import { TaskService } from "@/gen/rpc/task";
import { TeamService } from "@/gen/rpc/team";
import { UserService } from "@/gen/rpc/user";
import { WorkspaceService } from "@/gen/rpc/workspace";

const serverUrl = process.env.NEXT_PUBLIC_SERVER ?? "http://localhost:5173";

export const commentService = new CommentService(serverUrl);
export const eventService = new EventService(serverUrl);
export const filterService = new FilterService(serverUrl);
export const sprintService = new SprintService(serverUrl);
export const taskService = new TaskService(serverUrl);
export const teamService = new TeamService(serverUrl);
export const userService = new UserService(serverUrl);
export const workspaceService = new WorkspaceService(serverUrl);
