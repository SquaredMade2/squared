import { AuthService } from "@/gen/rpc/auth";
import { CommentService } from "@/gen/rpc/comment";
import { EventService } from "@/gen/rpc/event";
import { SprintService } from "@/gen/rpc/sprint";
import { TaskService } from "@/gen/rpc/task";

const serverUrl = process.env.NEXT_PUBLIC_SERVER ?? "http://localhost:5173";

export const sprintService = new SprintService(serverUrl);
export const eventService = new EventService(serverUrl);
export const taskService = new TaskService(serverUrl);
export const commentService = new CommentService(serverUrl);
export const authService = new AuthService(serverUrl);
