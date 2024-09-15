// import { useContext, useRef } from "react";
// import { EditorContext } from "@/components/EditorContext";
// import { Paperclip } from "lucide-react";

// const errorMessage = {
// 	imageUploadsExceeded: "Maximum images reached.",
// 	fileSizeExceeded:
// 		"File size exceeded 10mb limit, please choose another file.",
// };

// const UploadButton = () => {
// 	const { handleImageUpload, mediaError } = useContext(EditorContext);
// 	const fileInputRef = useRef<HTMLInputElement>(null);

// 	return (
// 		<>
// 			<input
// 				title="title"
// 				type="file"
// 				accept="image/*"
// 				onChange={handleImageUpload}
// 				style={{ display: "none" }}
// 				ref={fileInputRef}
// 			/>
// 			<button
// 				title="title"
// 				type="button"
// 				className="absolute bottom-4 right-32 py-2 px-2 text-sm text-foreground rounded-md cursor-pointer"
// 				onClick={() => fileInputRef.current?.click()}
// 			>
// 				<Paperclip className="size-5 text-[#858699]" />
// 			</button>

// 			<span className="absolute bottom-4 right-28 text-red-500">
// 				{mediaError.fileSizeExceeded && errorMessage.fileSizeExceeded}
// 				{mediaError.imageUploadsExceeded && errorMessage.imageUploadsExceeded}
// 			</span>
// 		</>
// 	);
// };

// export default UploadButton;
