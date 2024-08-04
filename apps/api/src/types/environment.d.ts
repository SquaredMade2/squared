export type {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MONGO_URL: string;
			JWT_SECRECT: string;
			PORT: string;
			SEED_PASSWORD: string;
			SENTRY_AUTH_TOKEN: string;
		}
	}
}
