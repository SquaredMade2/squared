import { TODO } from "@squaredmade/context";
import { z } from "zod";
import { j, workspaceProcedure } from "../jstack";

export const githubRouter = j.router({
	getRepos: workspaceProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { githubService } = ctx;
			const { workspaceId } = input;
			const repos = await githubService.getWorkspaceOrganizations(TODO, {
				workspaceId,
			});
			return c.superjson(repos);
		}),
});
