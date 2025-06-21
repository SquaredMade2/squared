/** biome-ignore-all lint/style/noProcessEnv: We need to access the environment */
import util from "node:util";
import { createLogger, format, type Logger, transports } from "winston";

// Define the log levels we want to support
const logLevels = {
	debug: 5,
	error: 0,
	http: 3,
	info: 2,
	verbose: 4,
	warn: 1,
};

const splatSymbol = Symbol.for("splat");

interface LogMeta {
	stack?: string;
	[splatSymbol]?: unknown[];
	[key: string]: unknown;
}

const formatError = (level: string, meta: LogMeta) => {
	if (level === "\x1B[31merror\x1B[39m") {
		const logMeta = meta as LogMeta;
		const stack = logMeta.stack?.split("\n").slice(1).join("\n");

		const splatInfo = logMeta[splatSymbol];
		let additionalInfo = "";

		if (Array.isArray(splatInfo) && splatInfo.length > 0) {
			const errorObject = splatInfo[0] as ErrorEvent;
			if (errorObject?.error) {
				additionalInfo = util.inspect(errorObject.error, {
					colors: true,
					depth: null,
					maxArrayLength: null,
				});
			}
		}

		return stack ? `\n${additionalInfo}\n${stack}` : "";
	}
	return "";
};

const formatMessage = (message: unknown, meta: LogMeta) => {
	const splatInfo = meta[splatSymbol];
	let additionalInfo = "";

	if (Array.isArray(splatInfo) && splatInfo.length > 0) {
		// Instead of just joining, properly format each object
		additionalInfo = splatInfo
			.map((item) => {
				if (typeof item === "object" && item !== null) {
					return util.inspect(item, { colors: false, depth: 4 });
				}
				return String(item);
			})
			.join(" ");
	}

	return `${message}${additionalInfo}`;
};

// Create the logger factory function
function createCustomLogger(prefix: string): Logger {
	const logger = createLogger({
		format: format.combine(
			format.timestamp({ format: "MMM DD HH:mm:ss" }),
			format.simple(),
			format.splat(),
			format.printf(({ timestamp, level, message, splat, ...meta }) => {
				const prefixString = prefix ? `[${prefix}] ` : "";
				const stackTrace = formatError(level, meta);

				return `${timestamp} ${level}: ${prefixString}${formatMessage(message, meta)}${stackTrace}`;
			}),
		),
		level: process.env.NODE_ENV === "production" ? "info" : "debug",
		levels: logLevels,
		transports: [
			new transports.File({ filename: "error.log", level: "error" }),
			new transports.File({ filename: "combined.log" }),
		],
	});

	if (process.env.NODE_ENV !== "production") {
		logger.add(
			new transports.Console({
				format: format.combine(
					format.colorize(),
					format.simple(),
					format.splat(),
					format.printf(({ timestamp, level, message, ...meta }) => {
						const prefixString = prefix ? `[${prefix}] ` : "";
						const stackTrace = formatError(level, meta);

						return `${timestamp} ${level}: ${prefixString}${formatMessage(message, meta)}${stackTrace}`;
					}),
				),
				silent: process.env.RUNNING_TESTS === "true",
			}),
		);
	}

	return logger;
}

// Export the factory function as default
export default createCustomLogger;

// Also export the Winston types for convenience
export { Logger } from "winston";
