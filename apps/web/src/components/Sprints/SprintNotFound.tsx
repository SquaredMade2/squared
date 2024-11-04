import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface SprintNotFoundProps {
	workspaceUrl?: string;
	teamIdentifier?: string;
}

export const SprintNotFound = ({
	workspaceUrl,
	teamIdentifier,
}: SprintNotFoundProps) => {
	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<AlertCircle className="h-12 w-12 text-yellow-500" />
				</div>
				<h2 className="text-2xl font-bold tracking-tight">Sprint Not Found</h2>
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
