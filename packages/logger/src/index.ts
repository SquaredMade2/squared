import util from "node:util";
import { type Logger, createLogger, format, transports } from "winston";

// Define the log levels we want to support
const logLevels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
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

		console.log("Type of stack", typeof stack);
		const splatInfo = logMeta[splatSymbol];
		let additionalInfo = "";

		if (Array.isArray(splatInfo) && splatInfo.length > 0) {
			const errorObject = splatInfo[0] as ErrorEvent;
			if (errorObject?.error) {
				additionalInfo = util.inspect(errorObject.error, {
					depth: null,
					colors: true,
					maxArrayLength: null,
				});
			}
		}

		return stack ? `\n${additionalInfo}\n${stack}` : "";
	}
	return "";
};

// Create the logger factory function
function createCustomLogger(prefix: string): Logger {
	const logger = createLogger({
		levels: logLevels,
		level: process.env.NODE_ENV === "production" ? "info" : "debug",
		format: format.combine(
			format.timestamp({ format: "MMM DD HH:mm:ss" }),
			format.simple(),
			format.printf(({ timestamp, level, message, ...meta }) => {
				const prefixString = prefix ? `[${prefix}] ` : "";
				const stackTrace = formatError(level, meta);

				return `${timestamp} ${level}: ${prefixString}${message}${stackTrace}`;
			}),
		),
		transports: [
			new transports.File({ filename: "error.log", level: "error" }),
			new transports.File({ filename: "combined.log" }),
		],
	});

	if (process.env.NODE_ENV !== "production") {
		logger.add(
			new transports.Console({
				silent: process.env.RUNNING_TESTS === "true",
				format: format.combine(
					format.colorize(),
					format.simple(),
					format.printf(({ timestamp, level, message, ...meta }) => {
						const prefixString = prefix ? `[${prefix}] ` : "";
						const stackTrace = formatError(level, meta);

						return `${timestamp} ${level}: ${prefixString}${message}${stackTrace}`;
					}),
				),
			}),
		);
	}

	return logger;
}

// Export the factory function as default
export default createCustomLogger;

// Also export the Winston types for convenience
export { Logger } from "winston";
