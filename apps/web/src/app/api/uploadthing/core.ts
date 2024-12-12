import { userService } from "@/lib/services";
import { TODO } from "@squared/context";
import { getServerSession } from "next-auth";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();
const utApi = new UTApi();

/**
 * Files will be stored at utfs.io/f/${key}
 */
const getFileKey = (url: string) => {
	const splitUrl = url.split("/");
	return splitUrl[splitUrl.length - 1];
};

/**
 * nextjs app router guide:
 * https://docs.uploadthing.com/getting-started/appdir#setting-up-your-environment
 *
 * make sure the UPLOADTHING_TOKEN variable is in the .env
 */
export const uploadThingRouter = {
	avatarImage: f({
		image: {
			maxFileSize: "1MB",
			maxFileCount: 1,
		},
	})
		.input(z.object({ userId: z.string() }))
		.middleware(async ({ input: { userId } }) => {
			const session = await getServerSession();
			const user = await userService.getUser(TODO, { userId });

			if (!session || !user || session.user.email !== user.email) {
				throw new UploadThingError("Failed to authenticate");
			}

			return { userId, prevUrl: user.avatarUrl };
		})
		.onUploadComplete(async ({ metadata: { userId, prevUrl }, file }) => {
			try {
				await userService.updateUserAvatar(TODO, {
					userId,

					// do not use raw bucket url:
					// https://docs.uploadthing.com/working-with-files
					avatarUrl: `https://utfs.io/f/${file.key}`,
				});

				// delete the old avatar image to save space
				if (prevUrl) {
					const prevKey = getFileKey(prevUrl);
					await utApi.deleteFiles(prevKey);
				}

				return { message: "Avatar updated successfully." };
			} catch (e) {
				throw new UploadThingError(String(e));
			}
		}),
} satisfies FileRouter;

export type UploadThingRouter = typeof uploadThingRouter;
