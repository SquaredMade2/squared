import { userService } from "@/lib/services";
import { TODO } from "@squared/context";
import { getServerSession } from "next-auth";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

/**
 * nextjs app router guide:
 * https://docs.uploadthing.com/getting-started/appdir#setting-up-your-environment
 */
export const uploadThingRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "1MB",
			maxFileCount: 1,
		},
	})
		.input(z.object({ userId: z.string() }))
		.middleware(async ({ input }) => {
			const session = await getServerSession();
			if (!session) throw new UploadThingError("unauthorized request");

			const user = await userService.getUser(TODO, { userId: input.userId });
			if (!user) throw new UploadThingError("failed to find user");

			return { userId: input.userId };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file url", file.url);

			try {
				await userService.updateUserAvatar(TODO, {
					userId: metadata.userId,
					avatarUrl: file.url,
				});
				return { message: "avatar update complete" };
			} catch (e) {
				throw new UploadThingError(`failed to update user avatar url: ${e}`);
			}
		}),
} satisfies FileRouter;

export type UploadThingRouter = typeof uploadThingRouter;
