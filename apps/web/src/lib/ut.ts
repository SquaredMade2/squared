import type { UploadThingRouter } from "@/app/api/uploadthing/core";
import {
	generateUploadButton,
	generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<UploadThingRouter>();
export const UploadDropzone = generateUploadDropzone<UploadThingRouter>();
