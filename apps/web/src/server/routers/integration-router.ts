import { TODO } from "@squared/context";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const integrationRouter = router({
	getGithubRepos: privateProcedure.query(async ({ c, ctx }) => {
		const { userService, user } = ctx;
		return c.superjson(
			await userService.getUserRepositories(TODO, { userId: user.id }),
		);
	}),
});
