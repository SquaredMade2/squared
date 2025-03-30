import superjson from "@squaredmade/superjson";
import request from "supertest";

// Override the `send` method globally on `Test.prototype`
const originalSend = request.Test.prototype.send;

request.Test.prototype.send = function (body) {
	// Apply SuperJSON serialization before sending the request
	return originalSend.call(this, JSON.parse(superjson.stringify(body)));
};

// Override the `end` method to parse the response with SuperJSON
const originalEnd = request.Test.prototype.end;

request.Test.prototype.end = function (fn) {
	return originalEnd.call(this, (err, res) => {
		if (err) return fn?.(err, res);

		try {
			res.body = superjson.parse(JSON.parse(res.text));
		} catch (parseError) {
			// If parsing fails, return the original response
			console.warn("Failed to parse response with SuperJSON:", parseError);
		}

		fn?.(null, res);
	});
};

export default request;
