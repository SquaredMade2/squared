import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import type { S3 } from "aws-sdk";
import sharp from "sharp";
import heicConvert from "heic-convert";
import s3 from "../utils/s3Client";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bucketName: string = process.env.AWS_S3_BUCKET || "no bucket name found";
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

const uploadSingleFile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.file) {
			throw new Error("No File Uploaded");
		}

		const fileName = req.file.originalname;
		let fileBuffer = req.file.buffer;
		const lastDotIndex = fileName.lastIndexOf(".");
		const fileExtension = fileName.substring(lastDotIndex + 1);
		const baseName = fileName.substring(0, lastDotIndex);
		const newFileName = `${baseName}.webp`;

		if (fileExtension === "heic") {
			try {
				fileBuffer = Buffer.from(
					await heicConvert({
						buffer: fileBuffer,
						format: "JPEG",
						quality: 1,
					}),
				);
			} catch (err) {}
		}

		const sharpInstance = sharp(fileBuffer);
		const imageDimensions = await sharpInstance.metadata();

		if (
			(imageDimensions.width && imageDimensions.width > MAX_WIDTH) ||
			(imageDimensions.height && imageDimensions.height > MAX_HEIGHT)
		) {
			sharpInstance.resize({
				width: MAX_WIDTH,
				height: MAX_HEIGHT,
				fit: sharp.fit.inside,
				withoutEnlargement: true,
			});
		}

		const data = await sharpInstance
			.webp({
				nearLossless: true,
				effort: 6,
			})
			.toBuffer();

		const params: S3.PutObjectRequest = {
			Bucket: bucketName,
			Key: newFileName,
			Body: data,
		};

		s3.upload(params, async (err: Error, data: S3.ManagedUpload.SendData) => {
			if (!req.file) return;
			if (err) {
				throw err;
			}
			res.status(200).send({
				message: "File uploaded successfully",
				url: data.Location,
				fileKey: newFileName,
			});
		});
	} catch (error) {
		next(error);
	}
};

const deleteSingleFile = (fileKey: string) => {
	return new Promise((resolve, reject) => {
		if (!process.env.AWS_S3_BUCKET) {
			reject(
				new Error("S3 bucket name is not defined in environment variables"),
			);
			return;
		}

		const deleteParams = {
			Bucket: process.env.AWS_S3_BUCKET || "",
			Key: fileKey,
		};

		s3.deleteObject(deleteParams, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

export { upload, deleteSingleFile, uploadSingleFile };
