import { userService } from "@/lib/services";
import { TODO } from "@squared/context";
import { getServerSession } from "next-auth";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { UTApi } from "uploadthing/server";
import { avatarImageInputSchema } from "./schema";

const f = createUploadthing();
const utApi = new UTApi();

const getFileKey = (url: string) => {
	const splitUrl = url.split("/");
	return splitUrl[splitUrl.length - 1];
};

const auth = async (email: string) => {
	const session = await getServerSession();
	return !!session && session.user.email === email;
};

/**
 * nextjs app router guide:
 * https://docs.uploadthing.com/getting-started/appdir#setting-up-your-environment
 */
export const uploadThingRouter = {
	avatarImage: f({
		image: {
			maxFileSize: "1MB",
			maxFileCount: 1,
		},
	})
		.input(avatarImageInputSchema)
		.middleware(async ({ input: { email, userId, prevUrl } }) => {
			const isAuthorized = await auth(email);
			if (!isAuthorized) {
				throw new UploadThingError("Unauthorized request");
			}

			return { userId, prevUrl };
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
