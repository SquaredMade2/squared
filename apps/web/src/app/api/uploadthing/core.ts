import { userService } from "@/lib/services";
import { TODO } from "@squared/context";
import createCustomLogger from "@squared/logger";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();
const logger = createCustomLogger("uploadThing");

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({
		image: {
			/**
			 * For full list of options and defaults, see the File Route API reference
			 * @see https://docs.uploadthing.com/file-routes#route-config
			 */
			maxFileSize: "1MB",
			maxFileCount: 1,
		},
	})
		// Set permissions and file types for this FileRoute
		.middleware(async ({ req }) => {
			// This code runs on your server before upload
			const body = await req.json();
			const user = await userService.getUser(TODO, { userId: body?.userId });

			// If you throw, the user will not be able to upload
			if (!user) throw new UploadThingError("Invalid user");

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			logger.log("Upload complete for userId %s", metadata.userId);
			logger.log("file url %s", file.url);

			await userService.updateUserAvatar(TODO, {
				userId: metadata.userId,
				avatarUrl: file.url,
			});

			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
