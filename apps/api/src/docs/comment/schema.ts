export const CommentSchema = {
	type: "object",
	properties: {
		id: {
			type: "string",
			description: "Unique identifier for the comment",
		},
		comment: {
			type: "string",
			description: "The text content of the comment",
		},
		authorId: {
			type: "string",
			description: "ID of the author who wrote the comment",
		},
		date: {
			type: "string",
			format: "date-time",
			description: "Date when the comment was created",
		},
		taskId: {
			type: "string",
			description: "ID of the task associated with the comment",
		},
	},
};
