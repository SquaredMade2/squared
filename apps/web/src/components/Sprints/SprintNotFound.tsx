import { CircleAlert } from "@squared/icons";
import Link from "next/link";
import { Button } from "../ui/button";

interface SprintNotFoundProps {
	workspaceUrl?: string;
	teamIdentifier?: string;
}

export const SprintNotFound = ({
	workspaceUrl,
	teamIdentifier,
}: SprintNotFoundProps) => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="space-y-4 text-center">
				<div className="flex justify-center">
					<CircleAlert className="h-12 w-12 text-yellow-500" />
				</div>
				<h2 className="font-bold text-2xl tracking-tight">Sprint Not Found</h2>
				<p className="text-muted-foreground">
					We couldn't find the sprint you're looking for. It may have been
					deleted or doesn't exist.
				</p>
				<div className="flex justify-center space-x-4">
					<Button asChild>
						<Link href={`/${workspaceUrl}/team/${teamIdentifier}/sprints`}>
							View All Sprints
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href={`/${workspaceUrl}/team/${teamIdentifier}/all`}>
							Go to Task Dashboard
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};
