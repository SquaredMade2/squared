import { createLogger, format, transports, type Logger } from "winston";

// Define the log levels we want to support
const logLevels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
	silly: 6,
};

// Create a type for the options we'll accept
type LoggerOptions = {
	service?: string;
	prefix?: string;
};

// Create the logger factory function
function createCustomLogger(options: LoggerOptions = {}): Logger {
	const { service = "default-service", prefix = "" } = options;

	const logger = createLogger({
		levels: logLevels,
		level: process.env.LOG_LEVEL || "info",
		format: format.combine(
			format.timestamp(),
			format.errors({ stack: true }),
			format.splat(),
			format.json(),
			format.printf(({ timestamp, level, message, ...meta }) => {
				const prefixString = prefix ? `[${prefix}] ` : "";
				return `${timestamp} ${level.toUpperCase()}: ${prefixString}${message} ${
					Object.keys(meta).length ? JSON.stringify(meta) : ""
				}`;
			}),
		),
		defaultMeta: { service },
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
