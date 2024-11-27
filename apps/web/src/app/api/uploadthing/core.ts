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
			maxFileSize: "512KB",
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
			try {
				await userService.updateUserAvatar(TODO, {
					userId: metadata.userId,

					// do not use raw bucket url:
					// https://docs.uploadthing.com/working-with-files
					avatarUrl: `https://utfs.io/f/${file.key}`,
				});

				return { message: "Avatar updated successfully." };
			} catch (e) {
				throw new UploadThingError(`Failed to update avatar: ${e}`);
			}
		}),
} satisfies FileRouter;

export type UploadThingRouter = typeof uploadThingRouter;
