import { TriangleAlert } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import Link from "next/link";

interface SprintErrorProps {
	error: string | null;
	workspaceUrl?: string;
	teamIdentifier?: string;
}

export const SprintError = ({
	error,
	workspaceUrl,
	teamIdentifier,
}: SprintErrorProps) => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="max-w-md space-y-4 text-center">
				<TriangleAlert className="mx-auto h-12 w-12 text-destructive" />
				<h2 className="font-semibold text-2xl tracking-tight">
					Error Loading Sprint
				</h2>
				<p className="break-words text-muted-foreground">{error}</p>
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
