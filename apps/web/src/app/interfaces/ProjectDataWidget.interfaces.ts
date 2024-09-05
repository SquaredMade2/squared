export interface AssigneesDataInterface {
	unassigned: number;
	[key: string]: number;
}

export interface LabelsDataInterface {
	[key: string]: number;
}

export type SetFilter = (filterAssignee: string) => void;
