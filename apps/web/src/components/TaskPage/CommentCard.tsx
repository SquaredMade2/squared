import { useCallback, useEffect, useState } from "react";
import { Text, type Descendant } from "slate";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { formatDate } from "date-fns/format";
import type { Comment } from "@repo/db";
import type { CustomElement, CustomText } from "../TextEditor/interfaces";
import { useUserStore } from "@/store";
import CodeElement from "../TextEditor/TextEditorElements/ElementBlocks/CodeElement";
import HeaderElement from "../TextEditor/TextEditorElements/ElementBlocks/HeaderElement";
import Leaf from "../TextEditor/TextEditorElements/LeafBlocks/Leaf";
import DefaultElement from "../TextEditor/TextEditorElements/ElementBlocks/DefaultElement";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "../ui/use-toast";
import type { UserAvatar } from "@/store/users";

const CommentCard = ({ comment }: { comment: Comment }) => {
	const [authorName, setAuthorName] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const commentData: Descendant[] = JSON.parse(comment.comment);
	const getUser = useUserStore((state) => state.getUser);

	// Functions

	const renderLeaf = useCallback((props: RenderLeafProps) => {
		return <Leaf {...props} />;
	}, []);

	// For each CustomElement type, render a different element node depending on what the type of block it is
	const renderElement = useCallback((props: RenderElementProps) => {
		switch (props.element.type) {
			case "code":
				return <CodeElement {...props} />;
			case "header":
				return <HeaderElement {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	const renderSlateContent = (nodes: Descendant[]): JSX.Element[] => {
		return nodes.map((node) => {
			if (Text.isText(node)) {
				// Render text (leaf)
				return (
					// Dont really have a unique attributes
					<span key={node.text} className="min-h-6">
						{renderLeaf({
							leaf: node as CustomText,
							children: node.text,
							attributes: { "data-slate-leaf": true },
							text: node as Text,
						})}
					</span>
				);
			}
			// Render block elements
			const elementNode = node as CustomElement;
			return (
				// Dont really have a unique attributes
				<div key={node.type} className="min-h-6">
					{renderElement({
						element: elementNode,
						children: renderSlateContent(elementNode.children),
						attributes: {
							"data-slate-node": "element",
							ref: elementNode.attributes?.ref || null,
						},
					})}
				</div>
			);
		});
	};

	const hasUserAvatarData = (user: UserAvatar | unknown) => {
		return (
			user && typeof user === "object" && "avatarUrl" in user && "name" in user
		);
	};

	useEffect(() => {
		const handleGetUser = async () => {
			try {
				const { user } = await getUser(comment.authorId);
				// Needs user !== null despite using hasUserAvatar here for some reason to pass checks
				if (hasUserAvatarData(user) && user !== null) {
					setAuthorName(user.name);
					setAvatarUrl(user.avatarUrl);
				} else {
					toast({
						title: "Error getting author",
						description: "User data not returned",
						variant: "destructive",
					});
				}
			} catch (err) {
				toast({
					title: "Error getting author",
					description: String(err),
					variant: "destructive",
				});
			}
		};
		handleGetUser();
	}, [comment]);
	return (
		<div className="flex flex-col px-8 m-5">
			<div className="flex flex-row items-center my-5">
				<div className="mr-4 text-muted-foreground">
					{formatDate(comment.date, "dd MMM yyyy h:mm a")}
				</div>
				<Avatar className="size-6">
					<AvatarImage src={avatarUrl} className="size-6" />
					<AvatarFallback className="size-6">{""}</AvatarFallback>
				</Avatar>

				<p className="text-foreground ml-2 mr-4">{authorName}</p>
			</div>
			<p className="flex flex-col min-w-60 min-h-20 p-3 bg-secondary rounded-md p-5">
				{renderSlateContent(commentData)}
			</p>
		</div>
	);
};

export default CommentCard;
