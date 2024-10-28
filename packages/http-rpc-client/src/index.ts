import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import * as context from "@squared/context";

export interface RequestOptions {
	timeout?: number;
}

class BaseClient {
	private baseURL: string;
	private serviceName: string;
	private axiosInstance: AxiosInstance;

	constructor(baseURL: string, serviceName: string) {
		this.baseURL = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
		this.serviceName = serviceName;
		this.axiosInstance = axios.create({ baseURL: this.baseURL });
	}

	protected async doRequest(
		ctx: context.Context,
		methodName: string,
		// biome-ignore lint/suspicious/noExplicitAny: Parameters are defined by the user and can be of any type
		params: Record<string, any>,
	) {
		const url = `${this.baseURL}${methodName}`;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		const reqId = context.getRequestId(ctx);
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
			contextWithSignal = context.withValues(ctx, {
				signal: abortController.signal,
			});
		}

		const config: AxiosRequestConfig = {
			method: "POST",
			url,
			data: params,
			headers,
			signal: contextWithSignal.signal,
		};

		try {
			const response = await this.axiosInstance(config);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const { data, status } = error.response;
				mapError(this.serviceName, methodName, data, status);
			}
			throw error;
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
		ctx: context.Context,
		methodName: string,
		// biome-ignore lint/suspicious/noExplicitAny: Parameters are defined by the user and can be of any type
		params: Record<string, any>,
	) {
		return super.doRequest(ctx, methodName, params);
	}
}
