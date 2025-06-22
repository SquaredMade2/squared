import { useOrganization } from "@clerk/nextjs";
import type { Comment } from "@squaredmade/db";
import { Trash } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import { toast } from "@squaredmade/ui/toast";
import { formatDate } from "date-fns/format";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import type React from "react";
import { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import type { UserAvatar } from "@/store/users";
import { formatName, getInitials } from "@/utils/formatting";
import MentionHover from "../TextEditor/Menus/MentionHover";
import { DeleteCommentAlertDialog } from "./DeleteCommentAlertDialog";

// !!! This is all part of the code below !!! line 37
// import { Text, type Descendant } from "slate";
// import type { RenderElementProps, RenderLeafProps } from "slate-react";
// import type { CustomElement, CustomText } from "../TextEditor/interfaces";
// import CodeElement from "../TextEditor/TextEditorElements/ElementBlocks/CodeElement";
// import HeaderElement from "../TextEditor/TextEditorElements/ElementBlocks/HeaderElement";
// import Leaf from "../TextEditor/TextEditorElements/LeafBlocks/Leaf";
// import DefaultElement from "../TextEditor/TextEditorElements/ElementBlocks/DefaultElement";

const CommentCard = ({ comment }: { comment: Comment }) => {
	const [authorName, setAuthorName] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const { user } = useUsers();
	const [commentData, setCommentData] = useState<
		MDXRemoteSerializeResult | React.ReactElement
	>(<p>Loading...</p>);
	// Keep here as per rest of the code below line 37
	// const commentData: Descendant[] = JSON.parse(comment.comment);
	const { membership, memberships } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});

	const users = memberships?.data?.map((m) => m.publicUserData);

	const hasMembershipManagePermission = membership?.permissions.includes(
		"org:sys_memberships:manage",
	);
	// Functions

	// !!! Keeping the below here for future use !!! No specific todo here, but will use for testing in the future

	// const renderLeaf = useCallback((props: RenderLeafProps) => {
	// 	return <Leaf {...props} />;
	// }, []);

	// // For each CustomElement type, render a different element node depending on what the type of block it is
	// const renderElement = useCallback((props: RenderElementProps) => {
	// 	switch (props.element.type) {
	// 		case "code":
	// 			return <CodeElement {...props} />;
	// 		case "header":
	// 			return <HeaderElement {...props} />;
	// 		default:
	// 			return <DefaultElement {...props} />;
	// 	}
	// }, []);

	// const renderSlateContent = (nodes: Descendant[]): JSX.Element[] => {
	// 	return nodes.map((node) => {
	// 		if (Text.isText(node)) {
	// 			// Render text (leaf)
	// 			return (
	// 				// Dont really have a unique attributes
	// 				<span key={node.text} className="min-h-6">
	// 					{renderLeaf({
	// 						leaf: node as CustomText,
	// 						children: node.text,
	// 						attributes: { "data-slate-leaf": true },
	// 						text: node as Text,
	// 					})}
	// 				</span>
	// 			);
	// 		}
	// 		// Render block elements
	// 		const elementNode = node as CustomElement;
	// 		return (
	// 			// Dont really have a unique attributes
	// 			<div key={node.type} className="min-h-6">
	// 				{renderElement({
	// 					element: elementNode,
	// 					children: renderSlateContent(elementNode.children),
	// 					attributes: {
	// 						"data-slate-node": "element",
	// 						ref: elementNode.attributes?.ref || null,
	// 					},
	// 				})}
	// 			</div>
	// 		);
	// 	});
	// };

	const hasUserAvatarData = (u: UserAvatar | unknown) => {
		return u && typeof u === "object" && "imageUrl" in u && "firstName" in u;
	};

	useEffect(() => {
		const handleGetUser = () => {
			try {
				if (!users) return;
				const author = users.find((u) => u?.userId === comment.authorId);
				// Needs author !== null despite using hasUserAvatar here for some reason to pass checks
				if (hasUserAvatarData(author) && author !== null) {
					setAuthorName(formatName(author));
					setAvatarUrl(author?.imageUrl ?? "");
				} else {
					toast.error("Error getting author", {
						description: "User data not returned",
					});
				}
			} catch (err) {
				toast.error("Error getting author", {
					description: err instanceof Error ? err.message : "",
				});
			}
		};
		const jSXCommentData = async () => {
			try {
				const formattedComment = comment.comment;

				const mdxSource = await serialize(formattedComment);
				setCommentData(mdxSource);
			} catch (err) {
				toast.error("Error converting to MDX", {
					description: err instanceof Error ? err.message : "",
				});
			}
		};
		jSXCommentData();
		handleGetUser();
	}, [comment]);

	// MDX

	return (
		<div className="my-5 flex flex-col">
			<div className="flex justify-between">
				<div className="my-5 flex items-center">
					<div className="mr-4 text-muted-foreground">
						{formatDate(comment.date, "dd MMM yyyy h:mm a")}
					</div>
					<Avatar className="size-6 text-xxs">
						<AvatarImage className="size-6" src={avatarUrl} />
						<AvatarFallback className="size-6">
							{getInitials(authorName)}
						</AvatarFallback>
					</Avatar>

					<p className="mr-4 ml-2 text-foreground">{authorName}</p>
				</div>
				{(comment.authorId === user?.id || hasMembershipManagePermission) && (
					<>
						<Button
							aria-label="Delete comment"
							className="self-center"
							onClick={() => setShowConfirmDelete(true)}
							size="icon"
							variant="ghost"
						>
							<Trash />
						</Button>
						<DeleteCommentAlertDialog
							commentId={comment.id}
							setShowConfirmDelete={setShowConfirmDelete}
							showConfirmDelete={showConfirmDelete}
						/>
					</>
				)}
			</div>
			<div className="markdown-content inline-flex min-h-20 min-w-60 flex-col items-start rounded-md bg-secondary p-3">
				{"compiledSource" in commentData && (
					<MDXRemote {...commentData} components={{ MentionHover }} />
				)}
			</div>
		</div>
	);
};

export default CommentCard;
