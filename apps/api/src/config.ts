/** biome-ignore-all lint/style/noProcessEnv: This is the config for the api */
const config = {
	databaseUrl: process.env.DATABASE_URL,
	port: process.env.PORT,
};

export default config;
