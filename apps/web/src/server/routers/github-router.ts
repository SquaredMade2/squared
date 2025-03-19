import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { workspaceProcedure } from "../procedures";

export const githubRouter = router({
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
