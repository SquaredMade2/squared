import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";
import React, { type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({ errorInfo });
		console.error("Uncaught error:", error, errorInfo);

		// Log additional information
		console.error(
			"Full error object:",
			JSON.stringify(error, Object.getOwnPropertyNames(error)),
		);
		console.error("Current URL:", window.location.href);
		console.error("User Agent:", navigator.userAgent);
	}

	handleGoBack = () => {
		window.history.back();
		// Add a small delay before reloading to ensure the navigation occurs
		setTimeout(() => {
			window.location.reload();
		}, 100);
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex items-center justify-center min-h-screen bg-background p-4">
					<Card className="w-full max-w-3xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-2xl font-bold text-destructive">
								<AlertTriangle className="h-6 w-6" />
								Oops! Something went wrong.
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[60vh] w-full rounded-md border p-4">
								<div className="space-y-4">
									<div>
										<h2 className="text-xl font-semibold mb-2">
											Error Details:
										</h2>
										<pre className="text-sm whitespace-pre-wrap break-words bg-muted p-2 rounded-md">
											{this.state.error?.toString()}
										</pre>
									</div>
									{this.state.error && (
										<div>
											<h3 className="text-lg font-semibold mb-2">
												Error Stack:
											</h3>
											<pre className="text-sm whitespace-pre-wrap break-words bg-muted p-2 rounded-md">
												{this.state.error.stack}
											</pre>
										</div>
									)}
									{this.state.errorInfo && (
										<div>
											<h3 className="text-lg font-semibold mb-2">
												Component Stack:
											</h3>
											<pre className="text-sm whitespace-pre-wrap break-words bg-muted p-2 rounded-md">
												{this.state.errorInfo.componentStack}
											</pre>
										</div>
									)}
								</div>
							</ScrollArea>
						</CardContent>
						<CardFooter className="flex justify-end space-x-4">
							<Button onClick={this.handleGoBack} variant="outline">
								Go Back
							</Button>
							<Button onClick={() => window.location.reload()}>
								Refresh Page
							</Button>
						</CardFooter>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}
