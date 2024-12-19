import type { RetrospectiveItemType, Sprint, Task } from "@squared/db";

export type NextSprintPayload = {
	teamId: string;
	sprintData?: {
		name: string;
		description?: string;
	};
};
export type AddRetrospectivePayload = {
	sprintId: string;
	authorId: string;
	type: RetrospectiveItemType;
	content: string;
};

export type UpdateRetrospectiveItemPayload = {
	retrospectiveItemId: string;
	type?: RetrospectiveItemType;
	content?: string;
	sprintId: string;
};

export type RetroItemReturn = {
	id: string;
	authorId: string;
	content: string;
	type: RetrospectiveItemType;
	likes: string[];
};

export type RetrospectiveData = {
	wentWell: RetroItemReturn[];
	toImprove: RetroItemReturn[];
	actionItems: RetroItemReturn[];
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
	getSprints: ({ teamId }: { teamId: string }) => Promise<Sprint[]>;
	updateSprint: ({
		sprintId,
		sprintData,
	}: {
		sprintId: string;
		sprintData: Pick<Sprint, "startDate" | "description" | "name" | "endDate">;
	}) => Promise<Sprint>;
	initializeSprints: ({ teamId }: { teamId: string }) => Promise<number>;
	startNextSprint: ({
		teamId,
		sprintData,
	}: NextSprintPayload) => Promise<SprintServiceResponse<Sprint>>;
	getSprintTasks: ({ sprintId }: { sprintId: string }) => Promise<Task[]>;
	endSprint: ({ sprintId }: { sprintId: string }) => Promise<Sprint>;
	addRetrospectiveItem: ({
		sprintId,
		type,
		content,
	}: AddRetrospectivePayload) => Promise<RetroItemReturn>;
	updateRetrospectiveItem: ({
		retrospectiveItemId,
		type,
		content,
		sprintId,
	}: UpdateRetrospectiveItemPayload) => Promise<RetroItemReturn>;
	likeRetrospectiveItem: ({
		retrospectiveItemId,
		userId,
	}: {
		retrospectiveItemId: string;
		userId: string;
	}) => Promise<RetroItemReturn>;
	getRetrospectiveItems: ({
		sprintId,
	}: { sprintId: string }) => Promise<RetrospectiveData>;
}
