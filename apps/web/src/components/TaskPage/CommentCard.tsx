import { useCallback, useEffect, useState } from "react";
import type { Descendant } from "slate";
import { Text } from "slate";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { formatDate } from "date-fns/format";
import type { Comment } from "@repo/db";
import type {
	CustomElement,
	CustomText,
} from "../TextEditor/TextEditor.interfaces";
import { useUserStore } from "@/store";
import ProfileImage from "../ProfileImage";
import CodeElement from "../TextEditor/TextEditorElements/ElementBlocks/CodeElement";
import HeaderElement from "../TextEditor/TextEditorElements/ElementBlocks/HeaderElement";
import Leaf from "../TextEditor/TextEditorElements/LeafBlocks/Leaf";
import DefaultElement from "../TextEditor/TextEditorElements/ElementBlocks/DefaultElement";

const CommentCard = ({ comment }: { comment: Comment }) => {
	const [authorName, setAuthorName] = useState("");
	const commentData: CustomElement[] = JSON.parse(comment.comment);
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

	// Function to render the Slate content outside the editor
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
							text: node as Text, // Add the required `text` property
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
							...elementNode.attributes,
						},
					})}
				</div>
			);
		});
	};

	useEffect(() => {
		const handleGetUser = async () => {
			try {
				const author = await getUser(comment.authorId);
				if (author.user) {
					setAuthorName(author.user.name);
				}
			} catch (err) {
				console.error(err);
			}
		};
		handleGetUser();
	}, [comment]);
	return (
		<div key={comment.id} className="flex flex-col px-8 m-5">
			<div className="flex flex-row items-center my-5">
				<div className="mr-4 text-muted-foreground">
					{formatDate(comment.date, "dd MMM yyyy h:mm a")}
				</div>
				<ProfileImage profileName={authorName} location={"activityItem"} />
				<p className="text-foreground ml-2 mr-4">{authorName}</p>
			</div>
			<p className="flex flex-col min-w-60 min-h-20 p-3 bg-secondary rounded-md p-5">
				{renderSlateContent(commentData)}
			</p>
		</div>
	);
};

export default CommentCard;
