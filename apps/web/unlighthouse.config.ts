import { defineConfig } from 'unlighthouse';

export default defineConfig({
	site: 'https://develop.squaredmade.com',
	urls: [
		'https://develop.squaredmade.com',
		'https://develop.squaredmade.com/join',
		'https://develop.squaredmade.com/login',
		'https://develop.squaredmade.com/onboarding',
		'https://develop.squaredmade.com/register',
		'https://develop.squaredmade.com/tasks/667e4b95f6c039c659b95dbf',
		'https://develop.squaredmade.com/workspace/squared-development',
		'https://develop.squaredmade.com/workspace/squared-development/search',
		'https://develop.squaredmade.com/workspace/squared-development/inbox',
		'https://develop.squaredmade.com/workspace/squared-development/issue/SQU',
		'https://develop.squaredmade.com/workspace/squared-development/settings/members',
		'https://develop.squaredmade.com/workspace/squared-development/settings/github-settings',
		'https://develop.squaredmade.com/workspace/squared-development/settings/new-team',
		'https://develop.squaredmade.com/workspace/squared-development/settings/profile',
		'https://develop.squaredmade.com/workspace/squared-development/team/SQU/views',
		'https://develop.squaredmade.com/workspace/squared-development/team/SQU/all',
		'https://develop.squaredmade.com/workspace/squared-development/settings/teams/SQU',
		'https://develop.squaredmade.com/workspace/squared-development/team/SQU/views/new',
	],
	auth: { username: '************', password: '********' },
});
