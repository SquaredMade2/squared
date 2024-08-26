const Sentry = require("@sentry/node");

Sentry.init({
	dsn: "https://ca633bd0aa68f0c8d9a9e5fadbd04945@o4506289111302144.ingest.sentry.io/4506289115168768",
	tracesSampleRate: 1.0,
	profilesSampleRate: 1.0,
});

module.exports = Sentry;
