import type { UserAvatar } from "@/store/users";
import { formatName, getInitials } from "@/utils/formatting";
import { useOrganization } from "@clerk/nextjs";
import type { Comment } from "@squaredmade/db";
import { formatDate } from "date-fns/format";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import type React from "react";
import MentionHover from "../TextEditor/Menus/MentionHover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "../ui/use-toast";
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
	const [commentData, setCommentData] = useState<
		MDXRemoteSerializeResult | React.ReactElement
	>(<p>Loading...</p>);
	// Keep here as per rest of the code below line 37
	// const commentData: Descendant[] = JSON.parse(comment.comment);
	const { memberships } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});

	const users = memberships?.data?.map(
		(membership) => membership.publicUserData,
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

	const hasUserAvatarData = (user: UserAvatar | unknown) => {
		return (
			user &&
			typeof user === "object" &&
			"imageUrl" in user &&
			"firstName" in user
		);
	};

	useEffect(() => {
		const handleGetUser = async () => {
			try {
				if (!users) return;
				const user = users.find((u) => u.userId === comment.authorId);
				// Needs user !== null despite using hasUserAvatar here for some reason to pass checks
				if (hasUserAvatarData(user) && user !== null) {
					setAuthorName(formatName(user));
					setAvatarUrl(user?.imageUrl ?? "");
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
					description: err instanceof Error ? err.message : "",
					variant: "destructive",
				});
			}
		};
		const JSXCommentData = async () => {
			try {
				const formattedComment = comment.comment
					.replace(/\n{2,}/g, "<br /><br />")
					.replace(/\n/g, "<br />\n");

				const mdxSource = await serialize(formattedComment);
				setCommentData(mdxSource);
			} catch (err) {
				toast({
					title: "Error converting to MDX",
					description: err instanceof Error ? err.message : "",
					variant: "destructive",
				});
			}
		};
		JSXCommentData();
		handleGetUser();
	}, [comment]);

	// MDX

	return (
		<div className="m-5 flex flex-col px-8">
			<div className="my-5 flex flex-row items-center">
				<div className="mr-4 text-muted-foreground">
					{formatDate(comment.date, "dd MMM yyyy h:mm a")}
				</div>
				<Avatar className="size-6 text-xxs">
					<AvatarImage src={avatarUrl} className="size-6" />
					<AvatarFallback className="size-6">
						{getInitials(authorName)}
					</AvatarFallback>
				</Avatar>

				<p className="mr-4 ml-2 text-foreground">{authorName}</p>
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
