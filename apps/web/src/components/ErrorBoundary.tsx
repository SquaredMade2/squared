import React, { type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
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

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
					<h1 className="text-2xl font-bold mb-4">
						Oops! Something went wrong.
					</h1>
					<div className="bg-muted p-4 rounded-md mb-4 w-full max-w-3xl overflow-auto">
						<h2 className="text-xl font-semibold mb-2">Error Details:</h2>
						<pre className="text-sm whitespace-pre-wrap break-words">
							{this.state.error?.toString()}
						</pre>
						{this.state.error && (
							<>
								<h3 className="text-lg font-semibold mt-4 mb-2">
									Error Stack:
								</h3>
								<pre className="text-sm whitespace-pre-wrap break-words">
									{this.state.error.stack}
								</pre>
							</>
						)}
						{this.state.errorInfo && (
							<>
								<h3 className="text-lg font-semibold mt-4 mb-2">
									Component Stack:
								</h3>
								<pre className="text-sm whitespace-pre-wrap break-words">
									{this.state.errorInfo.componentStack}
								</pre>
							</>
						)}
					</div>
					<div className="flex space-x-4">
						<Button onClick={() => window.location.reload()}>
							Refresh Page
						</Button>
						<Button onClick={() => window.history.back()} variant="outline">
							Go Back
						</Button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
