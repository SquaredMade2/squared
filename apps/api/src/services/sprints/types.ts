import type { RetrospectiveItem, Sprint, Task } from "@squared/db";

export type NextSprintPayload = {
	teamId: string;
	movedTasks: string[];
	sprintData?: {
		name: string;
	};
};

export type RetrospectiveItemType = "wentWell" | "toImprove" | "actionItems";

export type AddRetrospectivePayload = {
	sprintId: string;
	type: RetrospectiveItemType;
	content: string;
};

export type UpdateRetrospectiveItemPayload = {
	retrospectiveItemId: string;
	type?: RetrospectiveItemType;
	content?: string;
	sprintId: string;
};

export type RetrospectiveData = {
	wentWell: RetrospectiveItem[];
	toImprove: RetrospectiveItem[];
	actionItems: RetrospectiveItem[];
};

export interface ErrorResponse {
	status: number;
	message: string;
	variant: "destructive";
}

export interface SuccessResponse<T> {
	data: T;
	message: string;
	variant: "default";
}

export type SprintServiceResponse<T> = ErrorResponse | SuccessResponse<T>;

export interface SprintRpc {
	getSprints: (teamId: string) => Promise<Sprint[]>;
	startNextSprint: ({
		teamId,
		movedTasks,
		sprintData,
	}: NextSprintPayload) => Promise<SprintServiceResponse<Sprint>>;
	getSprintTasks: (sprintId: string) => Promise<Task[]>;
	endSprint: (sprintId: string) => Promise<Sprint>;
	addRetrospectiveItem: ({
		sprintId,
		type,
		content,
	}: AddRetrospectivePayload) => Promise<void>;
	updateRetrospectiveItem: ({
		retrospectiveItemId,
		type,
		content,
		sprintId,
	}: UpdateRetrospectiveItemPayload) => Promise<void>;
	getRetrospectiveItems: (sprintId: string) => Promise<RetrospectiveData>;
}
