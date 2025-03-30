import { Camera } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ImageUploadProps {
	imageUrl?: string;
	fallbackText: string;
	alt: string;
	handleImageUpload: (
		event: React.ChangeEvent<HTMLInputElement>,
	) => Promise<void>;
}

const ImageUpload = ({
	imageUrl,
	fallbackText,
	alt,
	handleImageUpload,
}: ImageUploadProps) => {
	return (
		<div className="group relative">
			<label htmlFor="image-upload" className="block cursor-pointer">
				<Avatar className="size-28">
					<AvatarImage src={imageUrl} alt={alt} />
					<AvatarFallback className="text-5xl">{fallbackText}</AvatarFallback>
				</Avatar>
				<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					<Camera className="h-8 w-8 text-white" />
				</div>
			</label>
			<input
				id="image-upload"
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleImageUpload}
			/>
		</div>
	);
};

export default ImageUpload;
