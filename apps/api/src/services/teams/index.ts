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
import { logger } from "../index";

const createTeamParams = createSchema<CreateTeamParams>()(
	z.object({
		name: z.string(),
		identifier: z.string(),
		workspaceId: z.string(),
	}),
).strict();

const updateTeamParams = createSchema<UpdateTeamParams>()(
	z.object({
		id: z.string(),
		name: z.string(),
		identifier: z.string(),
		effort: z.enum(["LINEAR", "FIBONACCI", "EXPONENTIAL"]),
	}),
).strict();

const updateTeamSprintsParams = createSchema<UpdateTeamSprintsParams>()(
	z.object({
		id: z.string(),
		sprintsEnabled: z.boolean().optional(),
		sprintDuration: z.number().optional(),
		cooldownDuration: z.number().optional(),
		sprintStartDate: z.date().optional(),
	}),
).strict();

export const teamRpcSchema = createServiceSchema<TeamRpc>()({
	createTeam: { input: createTeamParams, output: teamSchema },
	updateTeam: { input: updateTeamParams, output: teamSchema },
	updateTeamSprints: { input: updateTeamSprintsParams, output: teamSchema },
	deleteTeam: {
		input: z.object({ teamId: z.string() }).strict(),
		output: z.void(),
	},
	getTeam: {
		input: z.object({ teamId: z.string() }).strict(),
		output: teamSchema.nullable(),
	},
	getTeamByIdentifier: {
		input: z
			.object({ identifier: z.string(), workspaceId: z.string() })
			.strict(),
		output: teamSchema.nullable(),
	},
	getUserTeams: {
		input: z.object({ userId: z.string(), workspaceId: z.string() }).strict(),
		output: z.array(teamSchema),
	},
	removeUserFromTeam: {
		input: z.object({ userId: z.string(), teamId: z.string() }),
		output: z.void(),
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
		removeUserFromTeam: (input) => teamService.removeUserFromTeam(input),
	}, logger);

export { TeamService } from "./teams-service";
