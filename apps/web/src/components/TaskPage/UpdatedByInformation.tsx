import type { TaskEvent } from "@repo/db";
import { useActivityStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/formatting";

enum EventType {
	TaskCreated = "create",
	AssigneeUpdated = "assigneeName",
	StatusUpdated = "status",
	DescriptionUpdated = "description",
	TitleUpdated = "titleUpdated",
	PriorityUpdated = "priority",
	LabelsUpdated = "label",
}

export const UpdatedByInformation = () => {
	const eventLogs = useActivityStore((state) => state.events);

	const findLabelAdded = (
		originalLabels: string[],
		updatedLabels: string[],
	) => {
		const labelName = updatedLabels.filter(
			(label) => !originalLabels.includes(label),
		);
		return labelName;
	};

	const findLabelRemoved = (
		originalLabels: string[],
		updatedLabels: string[],
	) => {
		const labelName = originalLabels.filter(
			(label) => !updatedLabels.includes(label),
		);

		return labelName;
	};

	const displayLabelNames = (labels: string[]) => {
		return labels.join(", ");
	};

	const displayLabelUpdate = (log: TaskEvent) => {
		const originalLabels = log.originalLabels || [];
		const updatedLabels = log.updatedLabels || [];

		if (updatedLabels.length > originalLabels.length) {
			const labelNamesAdded = findLabelAdded(originalLabels, updatedLabels);
			return (
				<p>
					added {labelNamesAdded.length === 1 ? " label " : " labels "}
					<span className="text-foreground">
						{displayLabelNames(labelNamesAdded)}
					</span>
				</p>
			);
		}
		if (originalLabels.length > updatedLabels.length) {
			const labelNamesRemoved = findLabelRemoved(originalLabels, updatedLabels);
			return (
				<p>
					removed {labelNamesRemoved.length === 1 ? " label " : " labels "}
					<span className="text-foreground">
						{displayLabelNames(labelNamesRemoved)}
					</span>
				</p>
			);
		}
	};

	const displayDescriptionUpdate = (log: TaskEvent) => {
		const noDescription = log.originalValue?.length === 0;
		if (noDescription) {
			return (
				<p>
					added description{" "}
					<span className="text-foreground">{log.updatedValue}</span>
				</p>
			);
		}
		if (!log.updatedValue) {
			return <p>removed description </p>;
		}
		return (
			<p>
				updated description to{" "}
				<span className="text-foreground">{log.updatedValue}</span>
			</p>
		);
	};

	// const displayGitUpdate = (log: TaskEvent) => {
	// 	const gitUpdateText = log.gitUpdated || "";
	// 	const urlPattern = /(https?:\/\/[^\s]+)/g;

	// 	// Split the gitUpdateText into an array of strings and URLs
	// 	const parts = gitUpdateText.split(urlPattern);

	// 	return (
	// 		<p>
	// 			{parts.map((part) =>
	// 				urlPattern.test(part) ? (
	// 					<a
	// 						key={`-${part}-`}
	// 						href={part}
	// 						target="_blank"
	// 						rel="noopener noreferrer"
	// 						className="text-blue-500 underline hover:text-blue-700 font-semibold"
	// 					>
	// 						{part}
	// 					</a>
	// 				) : (
	// 					part
	// 				),
	// 			)}
	// 		</p>
	// 	);
	// };

	const getAssigneeActions = (
		originalAssignee: string,
		updatedAssignee: string,
	) => {
		const noPreviousAssignee =
			originalAssignee === "not Assigned" && updatedAssignee !== "not Assigned";

		const assigneeRemoved = updatedAssignee === "not Assigned";

		return {
			noPreviousAssignee,
			assigneeRemoved,
		};
	};

	const displayAssigneeUpdate = (log: TaskEvent) => {
		const { originalAssigneeId, updatedAssigneeId, authorId } = log;
		const { noPreviousAssignee, assigneeRemoved } = getAssigneeActions(
			originalAssigneeId ?? "",
			updatedAssigneeId ?? "",
		);
		const selfAssigned = authorId === updatedAssigneeId;
		if (noPreviousAssignee && selfAssigned) {
			return <p>self assigned task</p>;
		}
		if (noPreviousAssignee && !selfAssigned) {
			return (
				<p>
					assigned task to{" "}
					<span className="text-foreground">{updatedAssigneeId}</span>
				</p>
			);
		}
		if (assigneeRemoved) {
			return <p>unassigned task</p>;
		}
		return (
			<p>
				changed assignee to{" "}
				<span className="text-foreground">{log.updatedValue}</span>
			</p>
		);
	};

	const displayUpdate = (log: TaskEvent) => {
		switch (log.type) {
			case EventType.TaskCreated:
				return (
					<p>
						created task{" "}
						<span className="text-foreground">{log.updatedValue}</span>
					</p>
				);
			case EventType.TitleUpdated:
				return (
					<p>
						updated title to{" "}
						<span className="text-foreground">{log.updatedValue}</span>
					</p>
				);

			case EventType.DescriptionUpdated:
				return displayDescriptionUpdate(log);

			// ADDRESS IN ANOTHER PR: git logs updated to TaskEvent Schema
			// case EventType.GitUpdated:
			// 	return displayGitUpdate(log);
			case EventType.StatusUpdated:
				return (
					<p>
						updated status to{" "}
						<span className="text-foreground">{log.updatedValue}</span>
					</p>
				);
			case EventType.PriorityUpdated:
				return (
					<p>
						updated priority to{" "}
						<span className="text-foreground">{log.updatedValue}</span>
					</p>
				);
			case EventType.LabelsUpdated:
				return displayLabelUpdate(log);
			case EventType.AssigneeUpdated:
				return displayAssigneeUpdate(log);
			default:
				return "";
		}
	};

	const displayDate = (date: string | Date) => {
		if (date) {
			const parsedDate = typeof date === "string" ? new Date(date) : date;
			return parsedDate.toLocaleDateString();
		}
	};

	const displayAuthorProfile = (authorName: string) => {
		return (
			<>
				<Avatar className="size-6 text-xxs">
					<AvatarImage src={authorName} />
					<AvatarFallback>{getInitials(authorName)}</AvatarFallback>
				</Avatar>
			</>
		);
	};

	return (
		<div className="w-full">
			<ul className="list-none px-8">
				{eventLogs?.map((log: TaskEvent) => {
					return (
						<div key={log.id} className="flex items-center px-8">
							<div className="mr-4 text-muted-foreground">
								{displayDate(log.createdAt)}
							</div>
							<div>{displayAuthorProfile(log.authorName ?? "")}</div>
							<p className="text-foreground ml-2 mr-4">{log.authorName}</p>
							<p className="text-sm text-muted-foreground">
								{log.type && displayUpdate(log)}
							</p>
						</div>
					);
				})}
			</ul>
		</div>
	);
};
