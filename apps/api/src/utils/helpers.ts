import { getRandomValues } from "node:crypto";

export const expirationTimeFormat = (expiration: string) => {
	const msInHour = 60 * 60 * 1000;
	const now = Date.now();

	switch (expiration) {
		case "30m":
			return msInHour / 2 + now;
		case "1h":
			return msInHour + now;
		case "6h":
			return msInHour * 6 + now;
		case "12h":
			return msInHour * 12 + now;
		case "1d":
			return msInHour * 24 + now;
		case "7d":
			return msInHour * 24 * 7 + now;
		default:
			return now;
	}
};

export const generateSecureRandomString = (length = 8) => {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const array = new Uint8Array(length);
	getRandomValues(array);

	return Array.from(array, (byte) => chars[byte % chars.length]).join("");
};
