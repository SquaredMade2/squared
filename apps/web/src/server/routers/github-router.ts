import { TODO } from "@squared/context";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const githubRouter = router({
	getRepos: privateProcedure.query(async ({ c, ctx }) => {
		const { githubService, user } = ctx;
		const repos = await githubService.getUserRepositories(TODO, {
			userId: user.id,
		});

		return c.json(repos);
	}),
});
