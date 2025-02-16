import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const githubRouter = router({
	getRepos: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { githubService } = ctx;
			const { workspaceId } = input;
			const repos = await githubService.getWorkspaceRepositories(TODO, {
				workspaceId,
			});

			return c.json(repos);
		}),
});
