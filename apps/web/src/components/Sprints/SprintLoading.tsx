import SquaredLoader from "../Loaders/SquaredLoader";

export const SprintLoading = () => {
	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="text-center space-y-4 flex flex-col items-center">
				<h2 className="text-2xl font-semibold tracking-tight">
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
