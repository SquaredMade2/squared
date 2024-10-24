import { createLogger, format, transports, type Logger } from "winston";

// Define the log levels we want to support
const logLevels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
};

// Create the logger factory function
function createCustomLogger(prefix: string): Logger {
	const logger = createLogger({
		levels: logLevels,
		level: process.env.NODE_ENV === "production" ? "info" : "debug",
		format: format.combine(
			format.timestamp({ format: "MMM DD HH:mm:ss" }),
			format.errors({ stack: true }),
			format.splat(),
			format.simple(),
			format.printf(({ level, message, prefix, timestamp }) => {
				return `${timestamp} [${prefix}] ${level}: ${message}`;
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
				format: format.combine(
					format.colorize(),
					format.simple(),
					format.printf(({ timestamp, level, message, ...meta }) => {
						const prefixString = prefix ? `[${prefix}] ` : "";
						return `${timestamp} ${level}: ${prefixString}${message} ${
							Object.keys(meta).length ? JSON.stringify(meta) : ""
						}`;
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
