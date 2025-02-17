package github

// A Github User
type User struct {
	Name              string `json:"name"`
	Email             string `json:"email"`
	Login             string `json:"login"`
	Id                int    `json:"id"`
	NodeId            string `json:"node_id"`
	AvatarUrl         string `json:"avatar_url"`
	GravatarId        string `json:"gravatar_id"`
	Url               string `json:"url"`
	HtmlUrl           string `json:"html_url"`
	FollowersUrl      string `json:"followers_url"`
	FollowingUrl      string `json:"following_url"`
	GistsUrl          string `json:"gists_url"`
	StarredUrl        string `json:"starred_url"`
	SubscriptionsUrl  string `json:"subscriptions_url"`
	OrganizationsUrl  string `json:"organizations_url"`
	ReposUrl          string `json:"repos_url"`
	EventsUrl         string `json:"events_url"`
	ReceivedEventsUrl string `json:"received_events_url"`
	Type              string `json:"type"`
	SiteAdmin         bool   `json:"site_admin"`
	StarredAt         string `json:"starred_at"`
	UserViewType      string `json:"user_view_type"`
}

type Label struct {
	Id          int    `json:"id"`
	NodeId      string `json:"node_id"`
	Url         string `json:"url"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Color       string `json:"color"`
	Default     bool   `json:"default"`
}

// A collection of related issues and pull requests
type Milestone struct {
	Url       string `json:"url"`
	HtmlUrl   string `json:"html_url"`
	LabelsUrl string `json:"labels_url"`
	Id        int    `json:"id"`
	NodeId    string `json:"node_id"`
	// The number of the milestone
	Number int `json:"number"`
	// The state of the milestone. Can be "open" or "closed"
	State string `json:"state"`
	// The title of the milestone
	Title        string `json:"title"`
	Description  string `json:"description"`
	Creator      User   `json:"creator"`
	OpenIssues   int    `json:"open_issues"`
	ClosedIssues int    `json:"closed_issues"`
	CreatedAt    string `json:"created_at"`
	UpdatedAt    string `json:"updated_at"`
	ClosedAt     string `json:"closed_at"`
	DueOn        string `json:"due_on"`
}

type Team struct {
	// Unique identifier of the team
	Id     int    `json:"id"`
	NodeId string `json:"node_id"`
	// URL for the team
	Url        string `json:"url"`
	MembersUrl string `json:"members_url"`
	// Name of the team
	Name string `json:"name"`
	// Description of the team
	Description string `json:"description"`
	// Permission that the team will have for its repositories
	Permission string `json:"permission"`
	// The level of privacy this team should have
	Privacy string `json:"privacy"`
	// The notification setting the team has set
	NotificationSetting string `json:"notification_setting"`
	HtmlUrl             string `json:"html_url"`
	RepositoriesUrl     string `json:"repositories_url"`
	Slug                string `json:"slug"`
	// Distinguished name (DN) that team maps to within LDAP environment
	LdapDn string `json:"ldap_dn"`
}

// License Simple
type License struct {
	Key     string `json:"key"`
	Name    string `json:"name"`
	Url     string `json:"url"`
	SpdxId  string `json:"spdx_id"`
	NodeId  string `json:"node_id"`
	HtmlUrl string `json:"html_url"`
}

type Permissions struct {
	Admin    bool `json:"admin"`
	Pull     bool `json:"pull"`
	Triage   bool `json:"triage"`
	Push     bool `json:"push"`
	Maintain bool `json:"maintain"`
}

// A Repository on GitHub
type Repo struct {
	// Unique identifier of the repository
	Id     int    `json:"id"`
	NodeId string `json:"node_id"`
	// The name of the repository.
	Name        string      `json:"name"`
	FullName    string      `json:"full_name"`
	License     License     `json:"license"`
	Forks       int         `json:"forks"`
	Permissions Permissions `json:"permissions"`
	Owner       User        `json:"owner"`
	// Whether the repository is private or public.
	Private          bool    `json:"private"`
	HtmlUrl          string  `json:"html_url"`
	Description      *string `json:"description"`
	Fork             bool    `json:"fork"`
	Url              string  `json:"url"`
	ArchiveUrl       string  `json:"archive_url"`
	AssigneesUrl     string  `json:"assignees_url"`
	BlobsUrl         string  `json:"blobs_url"`
	BranchesUrl      string  `json:"branches_url"`
	CollaboratorsUrl string  `json:"collaborators_url"`
	CommentsUrl      string  `json:"comments_url"`
	CommitsUrl       string  `json:"commits_url"`
	CompareUrl       string  `json:"compare_url"`
	ContentsUrl      string  `json:"contents_url"`
	ContributorsUrl  string  `json:"contributors_url"`
	DeploymentsUrl   string  `json:"deployments_url"`
	DownloadsUrl     string  `json:"downloads_url"`
	EventsUrl        string  `json:"events_url"`
	ForksUrl         string  `json:"forks_url"`
	GitCommitsUrl    string  `json:"git_commits_url"`
	GitRefsUrl       string  `json:"git_refs_url"`
	GitTagsUrl       string  `json:"git_tags_url"`
	GitUrl           string  `json:"git_url"`
	IssueCommentUrl  string  `json:"issue_comment_url"`
	IssueEventsUrl   string  `json:"issue_events_url"`
	IssuesUrl        string  `json:"issues_url"`
	KeysUrl          string  `json:"keys_url"`
	LabelsUrl        string  `json:"labels_url"`
	LanguagesUrl     string  `json:"languages_url"`
	MergesUrl        string  `json:"merges_url"`
	MilestonesUrl    string  `json:"milestones_url"`
	NotificationsUrl string  `json:"notifications_url"`
	PullsUrl         string  `json:"pulls_url"`
	ReleasesUrl      string  `json:"releases_url"`
	SshUrl           string  `json:"ssh_url"`
	StargazersUrl    string  `json:"stargazers_url"`
	StatusesUrl      string  `json:"statuses_url"`
	SubscribersUrl   string  `json:"subscribers_url"`
	SubscriptionUrl  string  `json:"subscription_url"`
	TagsUrl          string  `json:"tags_url"`
	TeamsUrl         string  `json:"teams_url"`
	TreesUrl         string  `json:"trees_url"`
	CloneUrl         string  `json:"clone_url"`
	MirrorUrl        string  `json:"mirror_url"`
	HooksUrl         string  `json:"hooks_url"`
	SvnUrl           string  `json:"svn_url"`
	Homepage         string  `json:"homepage"`
	Language         string  `json:"language"`
	ForksCount       int     `json:"forks_count"`
	StargazersCount  int     `json:"stargazers_count"`
	WatchersCount    int     `json:"watchers_count"`
	// The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
	Size int `json:"size"`
	// The default branch of the repository.
	DefaultBranch   string `json:"default_branch"`
	OpenIssuesCount int    `json:"open_issues_count"`
	// Whether this repository acts as a template that can be used to generate new repositories.
	IsTemplate bool     `json:"is_template"`
	Topics     []string `json:"topics"`
	// Whether issues are enabled.
	HasIssues bool `json:"has_issues"`
	// Whether projects are enabled.
	HasProjects bool `json:"has_projects"`
	// Whether the wiki is enabled.
	HasWiki  bool `json:"has_wiki"`
	HasPages bool `json:"has_pages"`
	// Whether downloads are enabled.
	HasDownloads bool `json:"has_downloads"`
	// Whether discussions are enabled.
	HasDiscussions bool `json:"has_discussions"`
	// Whether the repository is archived.
	Archived bool `json:"archived"`
	// Whether the repository is disabled.
	Disabled bool `json:"disabled"`
	// The repository visibility: public, private, or internal.
	Visibility string `json:"visibility"`
	PushedAt   string `json:"pushed_at"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
	// Whether to allow rebase merges for pull requests.
	AllowRebaseMerge bool   `json:"allow_rebase_merge"`
	TempCloneToken   string `json:"temp_clone_token"`
	// Whether to allow squash merges for pull requests.
	AllowSquashMerge bool `json:"allow_squash_merge"`
	// Whether to allow auto-merging for pull requests.
	AllowAutoMerge bool `json:"allow_auto_merge"`
	// Whether to delte head branches when pull requests are merged.
	DeleteBranchOnMerge bool `json:"delete_branch_on_merge"`
	// Whether or not a pull request head branch that is behind its base branch can always be updated even if it is not required to be up to date before merging.
	AllowUpdateBranch bool `json:"allow_update_branch"`
	// Whether a squash merge commit can use the pull request title as default.
	UseSquashPrTitleAsDefault bool `json:"use_squash_pr_title_as_default"`
	/*
		The default value for a squash merge commit title:
			`PR_TITLE` - default to the pull request's title.
			`COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
		Can be one of: `PR_TITLE`, `COMMIT_OR_PR_TITLE`
	*/
	SquashMergeCommitTitle string `json:"squash_merge_commit_title"`
	/*
		The default value for a squash merge commit message:
			`PR_BODY` - default to the pull request's body.
			`COMMIT_MESSAGES` - default to the branch's commit messages.
			`BLANK` - default to a blank commit message.
		Can be one of: `PR_BODY`, `COMMIT_MESSAGES`, `BLANK`
	*/
	SquashMergeCommitMessage string `json:"squash_merge_commit_message"`
	/*
		The default value for a merge commit title.
			`PR_TITLE` - default to the pull request's title.
			`MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
		Can be one of: `PR_TITLE`, `MERGE_MESSAGE`
	*/
	MergeCommitTitle string `json:"merge_commit_title"`
	/*
		The default value for a merge commit message.
			`PR_TITLE` - default to the pull request's title.
			`PR_BODY` - default to the pull request's body.
			`BLANK` - default to a blank commit message.
		Can be one of: `PR_BODY`, `PR_TITLE`, `BLANK`
	*/
	MergeCommitMessage string `json:"merge_commit_message"`
	// Whether to allow merge commits for pull requests.
	AllowMergeCommit bool `json:"allow_merge_commit"`
	// Whether to allow forking this repo
	AllowForking bool `json:"allow_forking"`
	// Whether to require contributors to sign off on web-based commits
	WebCommitSignoffRequired bool   `json:"web_commit_signoff_required"`
	OpenIssues               int    `json:"open_issues"`
	Watchers                 int    `json:"watchers"`
	MasterBranch             string `json:"master_branch"`
	StarredAt                string `json:"starred_at"`
	// Whether anonymous git access is enabled for this repository
	AnonymousAccessEnabled bool `json:"anonymous_access_enabled"`
}

type Head struct {
	Label string `json:"label"`
	Ref   string `json:"ref"`
	Repo  Repo   `json:"repo"`
	Sha   string `json:"sha"`
	User  User   `json:"user"`
}

type Base struct {
	Label string `json:"label"`
	Ref   string `json:"ref"`
	// A Repository on Github
	Repo Repo   `json:"repo"`
	Sha  string `json:"sha"`
	// A Github User
	User User `json:"user"`
}

// Hypermedia Link
type Link struct {
	Href string `json:"href"`
}

type Links struct {
	Comments       Link `json:"comments"`
	Commits        Link `json:"commits"`
	Statuses       Link `json:"statuses"`
	Html           Link `json:"html"`
	Issue          Link `json:"issue"`
	ReviewComments Link `json:"review_comments"`
	ReviewComment  Link `json:"review_comment"`
	Self           Link `json:"self"`
}

type Commit struct {
	// An array of files added in the commit. A maximum of 3000 changed files will be reported per commit.
	Added []string `json:"added"`
	// Metaproperties for Git author/committer information.
	Author User `json:"author"`
	// Metaproperties for Git author/committer information.
	Committer User `json:"committer"`
	// Whether this commit is distinct from any that have been pushed before.
	Distinct bool   `json:"distinct"`
	Id       string `json:"id"`
	// The commit message.
	Message string `json:"message"`
	// An array of files modified by the commit. A maximum of 3000 changed files will be reported per commit.
	Modified []string `json:"modified"`
	// An array of files removed in the commit. A maximum of 3000 changed files will be reported per commit.
	Removed []string `json:"removed"`
	// The ISO 8601 timestamp of the commit.
	Timestamp string `json:"timestamp"`
	TreeId    string `json:"tree_id"`
	// The URL to the commit API resource.
	Url string `json:"url"`
}

// A GitHub organization. Webhook payloads contain the `organization` property when the webhook is configured for an organization, or when the event occurs from activity in a repository owned by an organization.
type Organization struct {
	// Name of the organization
	Login  string `json:"login"`
	Id     int    `json:"id"`
	NodeId string `json:"node_id"`
	// URL for the organization
	Url              string  `json:"url"`
	ReposUrl         string  `json:"repos_url"`
	EventsUrl        string  `json:"events_url"`
	HooksUrl         string  `json:"hooks_url"`
	IssuesUrl        string  `json:"issues_url"`
	MembersUrl       string  `json:"members_url"`
	PublicMembersUrl string  `json:"public_members_url"`
	AvatarUrl        string  `json:"avatar_url"`
	Description      *string `json:"description"`
}

type PullRequest struct {
	Id                int    `json:"id"`
	Url               string `json:"url"`
	NodeId            string `json:"node_id"`
	HTMLUrl           string `json:"html_url"`
	DiffUrl           string `json:"diff_url"`
	PatchUrl          string `json:"patch_url"`
	IssueUrl          string `json:"issue_url"`
	CommitsUrl        string `json:"commits_url"`
	ReviewCommentsUrl string `json:"review_comments_url"`
	ReviewCommentUrl  string `json:"review_comment_url"`
	CommentsUrl       string `json:"comments_url"`
	StatusesUrl       string `json:"statuses_url"`
	// Number uniquely identifying the pull request within its repository
	Number int `json:"number"`
	// State of the pull request. Can be "open" or "closed"
	State  string `json:"state"`
	Locked bool   `json:"locked"`
	// The title of the pull request
	Title              string    `json:"title"`
	User               User      `json:"user"`
	Body               string    `json:"body"`
	Labels             []Label   `json:"labels"`
	Milestone          Milestone `json:"milestone"`
	ActiveLockReason   string    `json:"active_lock_reason"`
	CreatedAt          string    `json:"created_at"`
	UpdatedAt          string    `json:"updated_at"`
	ClosedAt           string    `json:"closed_at"`
	MergedAt           string    `json:"merged_at"`
	MergeCommitSha     string    `json:"merge_commit_sha"`
	Assignee           User      `json:"assignee"`
	Assignees          []User    `json:"assignees"`
	RequestedReviewers []User    `json:"requested_reviewers"`
	RequestedTeams     []Team    `json:"requested_teams"`
	Head               Head      `json:"head"`
	Base               Base      `json:"base"`
	Links              Links     `json:"_links"`
	/*
		How the author is associated with the repository.
		Can be one of: `COLLABORATOR`, `CONTRIBUTOR`, `FIRST_TIMER`, `FIRST_TIME_CONTRIBUTOR`, `MANNEQUIN`, `MEMBER`, `NONE`, `OWNER`
	*/
	AuthorAssociation string `json:"author_association"`
	// Indicates whether or not the pull request is a draft.
	Draft          bool   `json:"draft"`
	Merged         bool   `json:"merged"`
	Mergeable      bool   `json:"mergeable"`
	Rebaseable     bool   `json:"rebaseable"`
	MergeableState string `json:"mergeable_state"`
	MergedBy       User   `json:"merged_by"`
	Comments       int    `json:"comments"`
	ReviewComments int    `json:"review_comments"`
	// Indicates whether maintainers can modify the pull request.
	MaintainerCanModify bool `json:"maintainer_can_modify"`
	Commits             int  `json:"commits"`
	Additions           int  `json:"additions"`
	Deletions           int  `json:"deletions"`
	ChangedFiles        int  `json:"changed_files"`
	// Whether to allow auto-merge for pull requests.
	AllowAutoMerge bool `json:"allow_auto_merge"`
	// Whether to allow updating the pull request's branch.
	AllowUpdateBranch bool `json:"allow_update_branch"`
	// Whether to delete head branches when pull requests are merged.
	DeleteBranchOnMerge bool `json:"delete_branch_on_merge"`
	/*
		The default value for a merge commit message.
			`PR_TITLE` - default to the pull request's title.
			`PR_BODY` - default to the pull request's body.
			`BLANK` - default to a blank commit message.
		Can be one of: `PR_BODY`, `PR_TITLE`, `BLANK`
	*/
	MergeCommitMessage string `json:"merge_commit_message"`
	/*
		The default value for a merge commit title.
			`PR_TITLE` - default to the pull request's title.
			`MERGE_MESSAGE` - default to the classic title for a merge message (e.g., "Merge pull request #123 from branch-name").
		Can be one of: `PR_TITLE`, `MERGE_MESSAGE`
	*/
	MergeCommitTitle string `json:"merge_commit_title"`
	/*
		The default value for a squash merge commit message:
			`PR_BODY` - default to the pull request's body.
			`COMMIT_MESSAGES` - default to the branch's commit messages.
			`BLANK` - default to a blank commit message.
		Can be one of: `PR_BODY`, `COMMIT_MESSAGES`, `BLANK`
	*/
	SquashMergeCommitMessagse string `json:"squash_merge_commit_message"`
	/*
		The default value for a squash merge commit title:
			`PR_TITLE` - default to the pull request's title.
			`COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
		Can be one of: `PR_TITLE`, `COMMIT_OR_PR_TITLE`
	*/
	SquashMergeCommitTitle string `json:"squash_merge_commit_title"`
	// Whether a squash merge commit can use the pull request title as default.
	UseSquashPrTitleAsDefault bool `json:"use_squash_pr_title_as_default"`
}

type Action string

const (
	ActionOpened Action = "opened"
)

type GitHubWebhookHeaders struct {
	XGitHubHookID                     string `header:"X-GitHub-Hook-ID"`
	XGitHubEvent                      string `header:"X-GitHub-Event"`
	XGitHubDelivery                   string `header:"X-GitHub-Delivery"`
	XHubSignature                     string `header:"X-Hub-Signature"`
	XHubSignature256                  string `header:"X-Hub-Signature-256"`
	UserAgent                         string `header:"User-Agent"`
	XGitHubHookInstallationTargetType string `header:"X-GitHub-Hook-Installation-Target-Type"`
	XGitHubHookInstallationTargetID   string `header:"X-GitHub-Hook-Installation-Target-ID"`
	XTestOverride                     string `header:"X-Test-Override"`
}

type Body struct {
	From string `json:"from,omitempty"`
}

// The changes to the comment if the action was edited.
type Changes struct {
	Base  *Base `json:"base,omitempty"`
	Body  *Body `json:"body,omitempty"`
	Title *Body `json:"title,omitempty"`
}

// Pull Request Webhook type
type WebhookPullRequest struct {
	// The type of action that was performed on the pull request.
	Action       string        `json:"action"`
	PullRequest  PullRequest   `json:"pull_request"`
	Repository   Repo          `json:"repository"`
	Sender       User          `json:"sender"`
	Changes      *Changes      `json:"changes,omitempty"`
	Organization *Organization `json:"organization,omitempty"`
}

// Metaproperties for Git author/committer information.
type Pusher struct {
	Date  string `json:"date"`
	Email string `json:"email"`
	// The git author's name.
	Name     string `json:"name"`
	Username string `json:"username"`
}

type WebhookPushCommit struct {
	// The SHA of the most recent commit on `ref` after the push.
	After   string `json:"after"`
	BaseRef string `json:"base_ref"`
	// The SHA of the most recent commit on `ref` before the push.
	Before string `json:"before"`
	// An array of commit objects describing the pushed commits. (Pushed commits are all commits that are included in the compare between the `before` commit and the `after` commit.) The array includes a maximum of 2048 commits. If necessary, you can use the Commits API to fetch additional commits.
	Commits []Commit `json:"commits"`
	// URL that shows the changes in this ref update, from the `before` commit to the `after` commit. For a newly created ref that is directly based on the default branch, this is the comparison between the head of the default branch and the `after` commit. Otherwise, this shows all commits until the `after` commit.
	Compare string `json:"compare"`
	// Whether this push created the `ref`.
	Created    bool   `json:"created"`
	Deleted    bool   `json:"deleted"`
	Forced     bool   `json:"forced"`
	HeadCommit Commit `json:"head_commit"`
	Pusher     Pusher `json:"pusher"`
	// The full git ref that was pushed. Example: `refs/heads/main` or `refs/tags/v3.14.1`.
	Ref        string `json:"ref"`
	Repository Repo   `json:"repository"`
	Sender     User   `json:"sender"`
}
