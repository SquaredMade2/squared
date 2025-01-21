import { Button } from "@squaredmade/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface SprintErrorProps {
	error: string;
	workspaceUrl?: string;
	teamIdentifier?: string;
}

export const SprintError = ({
	error,
	workspaceUrl,
	teamIdentifier,
}: SprintErrorProps) => {
	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="text-center space-y-4 max-w-md">
				<AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
				<h2 className="text-2xl font-semibold tracking-tight">
					Error Loading Sprint
				</h2>
				<p className="text-muted-foreground break-words">{error}</p>
				<div className="flex justify-center space-x-4">
					<Button variant="outline" asChild>
						<Link href={`/${workspaceUrl}/team/${teamIdentifier}/all`}>
							Go to Dashboard
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};
