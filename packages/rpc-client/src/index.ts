import { type Context, getRequestId, withValues } from "@squaredmade/context";
import superjson from "@squaredmade/superjson";

export interface RequestOptions {
	timeout?: number;
}

class BaseClient {
	private baseURL: string;
	private serviceName: string;

	constructor(baseURL: string, serviceName: string) {
		this.baseURL = baseURL.endsWith("/") ? `${baseURL}rpc` : `${baseURL}/rpc`;
		this.serviceName = serviceName;
	}

	protected async doRequest(
		ctx: Context,
		methodName: string,
		// biome-ignore lint/suspicious/noExplicitAny: Parameters are defined by the user and can be of any type
		params?: Record<string, any>,
		// biome-ignore lint/suspicious/noExplicitAny: Parameters are defined by the user and can be of any type
	): Promise<any> {
		const url = `${this.baseURL}/${this.serviceName}/${methodName}`;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		const reqId = getRequestId(ctx);
		if (reqId) {
			headers["X-Request-ID"] = reqId;
		}

		if (ctx.deadline) {
			headers["X-Request-Deadline"] = new Date(ctx.deadline).toISOString();
		}

		let abortController: AbortController | null = null;
		let contextWithSignal = ctx;

		if (!ctx.signal) {
			abortController = new AbortController();
			contextWithSignal = withValues(ctx, {
				signal: abortController.signal,
			});
		}

		try {
			const response = await fetch(url, {
				body: superjson.stringify(params),
				headers,
				method: "POST",
				signal: contextWithSignal.signal,
			});

			if (!response.ok) {
				const errorData = await response.json();
				mapError(this.serviceName, methodName, errorData, response.status);
			}

			return superjson.parse(await response.json());
		} catch (error) {
			console.error("Error occurred during RPC request: ", error);
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Unknown error occurred");
		} finally {
			if (abortController) {
				abortController.abort();
			}
		}
	}
}

function mapError(
	serviceName: string,
	methodName: string,
	// biome-ignore lint/suspicious/noExplicitAny: Error response can have varying structures
	errResult: any,
	status: number,
) {
	const source = `${serviceName}/${methodName}`;

	if (!errResult.type) {
		const newErr = new Error(errResult.message || "Unknown error") as Error & {
			code?: string | number;
			expose?: boolean;
			source: string[];
			status: number;
		};
		newErr.code = errResult.code;
		newErr.expose = errResult.expose;
		newErr.source = [source];
		newErr.status = status;
		throw newErr;
	}

	throw new RpcResponseError(source, errResult, status);
}

export class RpcResponseError extends Error {
	source: string[];
	status: number;
	// biome-ignore lint/suspicious/noExplicitAny: Properties are dynamically assigned based on the response
	[key: string]: any;

	constructor(
		source: string,
		// biome-ignore lint/suspicious/noExplicitAny: Response body can have varying structures
		responseBody: any,
		status: number,
	) {
		super(responseBody.message || "RPC Error");
		this.name = "RpcResponseError";
		Object.assign(this, responseBody);
		this.source = [source, ...(responseBody.source || [])];
		this.status = status;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, RpcResponseError);
		}

		this.stack = `${this.stack}\n${this.source
			.reverse()
			.map((s) => `    via ${s}`)
			.join("\n")}`;
	}
}

export class RPCContextClient extends BaseClient {
	async request(
		ctx: Context,
		methodName: string,
		// biome-ignore lint/suspicious/noExplicitAny: Parameters are defined by the user and can be of any type
		params?: Record<string, any>,
	) {
		return super.doRequest(ctx, methodName, params);
	}
}
