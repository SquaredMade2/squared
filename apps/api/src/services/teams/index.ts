import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import z from "zod";
import { teamSchema } from "../schema";
import type {
	CreateTeamParams,
	TeamRpc,
	UpdateTeamParams,
	UpdateTeamSprintsParams,
} from "./types";

const createTeamParams = createSchema<CreateTeamParams>()(
	z.object({
		name: z.string(),
		identifier: z.string(),
		workspaceId: z.string(),
		userId: z.string(),
	}),
);

const updateTeamParams = createSchema<UpdateTeamParams>()(
	z.object({
		id: z.string(),
		name: z.string(),
		identifier: z.string(),
		effort: z.enum(["LINEAR", "FIBONACCI", "EXPONENTIAL"]),
	}),
);

const updateTeamSprintsParams = createSchema<UpdateTeamSprintsParams>()(
	z.object({
		id: z.string(),
		sprintsEnabled: z.boolean().optional(),
		sprintDuration: z.number().optional(),
		cooldownDuration: z.number().optional(),
		sprintStartDate: z.date().optional(),
	}),
);

export const teamRpcSchema = createServiceSchema<TeamRpc>()({
	createTeam: {
		input: createTeamParams,
		output: teamSchema,
	},
	updateTeam: { input: updateTeamParams, output: teamSchema },
	updateTeamSprints: { input: updateTeamSprintsParams, output: teamSchema },
	deleteTeam: { input: z.object({ teamId: z.string() }), output: z.void() },
	getTeam: {
		input: z.object({ teamId: z.string() }),
		output: teamSchema.nullable(),
	},
	getTeamByIdentifier: {
		input: z.object({ identifier: z.string(), workspaceId: z.string() }),
		output: teamSchema.nullable(),
	},
	getUserTeams: {
		input: z.object({ userId: z.string(), workspaceId: z.string() }),
		output: z.array(teamSchema),
	},
	getWorkspaceTeams: {
		input: z.object({ workspaceId: z.string() }),
		output: z.array(teamSchema),
	},
	removeUserFromTeam: {
		input: z.object({ userId: z.string(), teamId: z.string() }),
		output: z.object({ success: z.boolean() }),
	},
});

export type TeamRpcSchema = typeof teamRpcSchema;

export const createTeamRpcHandler = (teamService: TeamRpc) =>
	createRpcHandler("team", teamRpcSchema, {
		createTeam: (input) => teamService.createTeam(input),
		updateTeam: (input) => teamService.updateTeam(input),
		updateTeamSprints: (input) => teamService.updateTeamSprints(input),
		deleteTeam: (input) => teamService.deleteTeam(input),
		getTeam: (input) => teamService.getTeam(input),
		getTeamByIdentifier: (input) => teamService.getTeamByIdentifier(input),
		getUserTeams: (input) => teamService.getUserTeams(input),
		getWorkspaceTeams: (input) => teamService.getWorkspaceTeams(input),
		removeUserFromTeam: (input) => teamService.removeUserFromTeam(input),
	});

export { TeamService } from "./teams-service";
