import SquaredLoader from "../Loaders/SquaredLoader";

export const SprintLoading = () => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="flex flex-col items-center space-y-4 text-center">
				<h2 className="font-semibold text-2xl tracking-tight">
					Loading Sprint
				</h2>
				<p className="text-muted-foreground">
					Please wait while we fetch the sprint data...
				</p>
				<SquaredLoader />
			</div>
		</div>
	);
};
