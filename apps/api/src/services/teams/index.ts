import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import z from "zod";
import { teamSchema } from "../schema";
import type { CreateTeamParams, TeamRpc, UpdateTeamParams } from "./types";

const createTeamParams = createSchema<CreateTeamParams>()(
	z.object({
		name: z.string(),
		identifier: z.string(),
		workspaceId: z.string(),
	}),
);

const updateTeamParams = createSchema<UpdateTeamParams>()(
	z.object({
		id: z.string(),
		name: z.string().optional(),
		identifier: z.string().optional(),
		effort: z.enum(["LINEAR", "FIBONACCI", "EXPONENTIAL"]).optional(),
		sprintsEnabled: z.boolean().optional(),
		sprintDuration: z.number().optional(),
		cooldownDuration: z.number().optional(),
		sprintStartDate: z.date().optional(),
		upcomingSprints: z.number().optional(),
		activeRequired: z.boolean().optional(),
	}),
);

export const teamRpcSchema = createServiceSchema<TeamRpc>()({
	createTeam: { input: createTeamParams, output: teamSchema },
	updateTeam: { input: updateTeamParams, output: teamSchema },
	deleteTeam: { input: z.object({ teamId: z.string() }), output: z.void() },
	getTeam: { input: z.object({ teamId: z.string() }), output: teamSchema },
});

export type TeamRpcSchema = typeof teamRpcSchema;

export const createTeamRpcHandler = (teamService: TeamRpc) => {
	createRpcHandler("team", teamRpcSchema, {
		createTeam: (input) => teamService.createTeam(input),
		updateTeam: (input) => teamService.updateTeam(input),
		deleteTeam: (input) => teamService.deleteTeam(input),
		getTeam: (input) => teamService.getTeam(input),
	});
};

export { TeamService } from "./teams-service";
