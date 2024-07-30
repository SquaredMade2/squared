interface Author {
	name: string;
	email: string;
	username: string;
}

interface Commiter {
	name: string;
	email: string;
	username: string;
}

export interface Commits {
	id: string;
	tree_id: string;
	distinct: boolean;
	message: string;
	timestamp: string;
	url: string;
	author: Author;
	committer: Commiter;
	added: [];
	removed: [];
	modified: string[];
	repoName: string;
	owner: string;
}
