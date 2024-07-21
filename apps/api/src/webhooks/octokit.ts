// import 'dotenv/config';
// import axios from 'axios';
// import { Octokit } from 'octokit';
// import {
// 	PostHookDeckPayload,
// 	PostWebHook,
// } from '../interface/webhooks.interfaces'; //-- disabled for merge into main
// const Octokit = require('octokit');
// const hookdeckToken = process.env.HOOKDECK_AUTH_TOKEN;

// Notes

// Octokit here takes in:
// authToken: github user access token
// owner: gh username
// repo: repository
// url: hookdeck url (payload url)

// From hookdeck, receive calls, hookdeck will direct the hook info to route.
// Things needed to do for Hookdeck:
// Authenticate with api key to use api (add everything past -H to all requests):
// "https://api.hookdeck.com/2024-03-01/connections" -H "Content-Type: application/json" -H "Authorization: Bearer 0m0lfjwxtl7mt6jnsg85kfk3q3tgf5tqa2vygc7gn07yt1nqwm" -d {"name": "shopify-my-api", "source": { "name": "shopify"}, "destination": {"name": "my-api", "url": "https://example.com/webhook"}}
// Use axios to handle cURL
// Hookdeck configurations include:
// directing to the right route (/workspace/webhook/:id)

// const postHookDeckPayload: PostHookDeckPayload = async (
// 	connectionName,
// 	sourceName,
// 	routeUrl,
// 	auth
// ) => {
// 	// Notes:
// 	// connectionName is connection between source (hookdeck payload url), to routeUrl (Node/Express route)
// 	// sourceName: hookdeck payload Name
// 	// routeUrl: Node/Express route
// 	try {
// 		const response = await axios.post(
// 			'https://api.hookdeck.com/2024-03-01/connections',
// 			{
// 				name: connectionName,
// 				source: {
// 					name: sourceName,
// 				},
// 				destination: {
// 					name: 'my-api',
// 					url: routeUrl,
// 				},
// 			},
// 			{
// 				headers: {
// 					'Content-Type': 'application/json',
// 					Authorization: `Bearer ${auth}`,
// 				},
// 			}
// 		);
// 		return response.data.source.url;
// 	} catch (error) {
// 		return error;
// 	}
// };

// export const postWebhook: PostWebHook = async (
// 	ghAuthToken,
// 	owner,
// 	repoName,
// 	connectionName,
// 	sourceName,
// 	routeUrl,
// 	hookDeckAuth
// ) => {
// 	if (hookdeckToken) {
// 		postHookDeckPayload(connectionName, sourceName, routeUrl, hookDeckAuth)
// 			.then(async (hookDeckResponse) => {
// 				

// 				const octokit = new Octokit({
// 					auth: ghAuthToken,
// 				});
// 				await octokit.request(`POST /repos/${owner}/${repoName}/hooks`, {
// 					owner: owner,
// 					repo: repoName,
// 					name: 'web',
// 					active: true,
// 					events: ['push', 'pull_request'],
// 					config: {
// 						url: hookDeckResponse,
// 						content_type: 'json',
// 						insecure_ssl: '0',
// 					},
// 					headers: {
// 						'X-GitHub-Api-Version': '2022-11-28',
// 					},
// 				});
// 				
// 			})
// 			.catch((error) => {
// 				
// 			});
// 	}
// };
