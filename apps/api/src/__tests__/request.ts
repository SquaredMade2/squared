import superjson from "@squared/superjson";
import request from "supertest";

// Override the `send` method globally on `Test.prototype`
const originalSend = request.Test.prototype.send;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
request.Test.prototype.send = function (body: any) {
	// Apply SuperJSON serialization before sending the request
	return originalSend.call(this, JSON.parse(superjson.stringify(body)));
};

export default request;
