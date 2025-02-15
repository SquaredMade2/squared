package main

import "time"

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
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	Creator      User      `json:"creator"`
	OpenIssues   int       `json:"open_issues"`
	ClosedIssues int       `json:"closed_issues"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	ClosedAt     time.Time `json:"closed_at"`
	DueOn        time.Time `json:"due_on"`
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
	Id               int         `json:"id"`
	NodeId           string      `json:"node_id"`
	Name             string      `json:"name"`
	FullName         string      `json:"full_name"`
	License          License     `json:"license"`
	Forks            int         `json:"forks"`
	Permissions      Permissions `json:"permissions"`
	Owner            User        `json:"owner"`
	Private          bool        `json:"private"`
	HtmlUrl          string      `json:"html_url"`
	Description      string      `json:"description"`
	Fork             bool        `json:"fork"`
	Url              string      `json:"url"`
	ArchiveUrl       string      `json:"archive_url"`
	AssigneesUrl     string      `json:"assignees_url"`
	BlobsUrl         string      `json:"blobs_url"`
	BranchesUrl      string      `json:"branches_url"`
	CollaboratorsUrl string      `json:"collaborators_url"`
	CommentsUrl      string      `json:"comments_url"`
	CommitsUrl       string      `json:"commits_url"`
	CompareUrl       string      `json:"compare_url"`
	ContentsUrl      string      `json:"contents_url"`
	ContributorsUrl  string      `json:"contributors_url"`
	DeploymentsUrl   string      `json:"deployments_url"`
	DownloadsUrl     string      `json:"downloads_url"`
	EventsUrl        string      `json:"events_url"`
	ForksUrl         string      `json:"forks_url"`
	GitCommitsUrl    string      `json:"git_commits_url"`
	GitRefsUrl       string      `json:"git_refs_url"`
	GitTagsUrl       string      `json:"git_tags_url"`
	GitUrl           string      `json:"git_url"`
	IssueCommentUrl  string      `json:"issue_comment_url"`
	IssueEventsUrl   string      `json:"issue_events_url"`
	IssuesUrl        string      `json:"issues_url"`
	KeysUrl          string      `json:"keys_url"`
	LabelsUrl        string      `json:"labels_url"`
	LanguagesUrl     string      `json:"languages_url"`
	MergesUrl        string      `json:"merges_url"`
	MilestonesUrl    string      `json:"milestones_url"`
	NotificationsUrl string      `json:"notifications_url"`
	PullsUrl         string      `json:"pulls_url"`
	ReleasesUrl      string      `json:"releases_url"`
	SshUrl           string      `json:"ssh_url"`
	StargazersUrl    string      `json:"stargazers_url"`
	StatusesUrl      string      `json:"statuses_url"`
	SubscribersUrl   string      `json:"subscribers_url"`
	SubscriptionUrl  string      `json:"subscription_url"`
	TagsUrl          string      `json:"tags_url"`
	TeamsUrl         string      `json:"teams_url"`
	TreesUrl         string      `json:"trees_url"`
	CloneUrl         string      `json:"clone_url"`
	MirrorUrl        string      `json:"mirror_url"`
	HooksUrl         string      `json:"hooks_url"`
	SvnUrl           string      `json:"svn_url"`
	Homepage         string      `json:"homepage"`
	Language         string      `json:"language"`
	ForksCount       int         `json:"forks_count"`
	StargazersCount  int         `json:"stargazers_count"`
	WatchersCount    int         `json:"watchers_count"`
	Size             int         `json:"size"`
	DefaultBranch    string      `json:"default_branch"`
	OpenIssuesCount  int         `json:"open_issues_count"`
	IsTemplate       bool        `json:"is_template"`
	Topics           []string    `json:"topics"`
	HasIssues        bool        `json:"has_issues"`
	HasProjects      bool        `json:"has_projects"`
	HasWiki          bool        `json:"has_wiki"`
	HasPages         bool        `json:"has_pages"`
	HasDownloads     bool        `json:"has_downloads"`
	HasDiscussions   bool        `json:"has_discussions"`
	Archived         bool        `json:"archived"`
	Disabled         bool        `json:"disabled"`
	// Can be "public", "private", or "internal"
	Visibility                string    `json:"visibility"`
	PushedAt                  time.Time `json:"pushed_at"`
	CreatedAt                 time.Time `json:"created_at"`
	UpdatedAt                 time.Time `json:"updated_at"`
	AllowRebaseMerge          bool      `json:"allow_rebase_merge"`
	TempCloneToken            string    `json:"temp_clone_token"`
	AllowSquashMerge          bool      `json:"allow_squash_merge"`
	DeleteBranchOnMerge       bool      `json:"delete_branch_on_merge"`
	AllowUpdateBranch         bool      `json:"allow_update_branch"`
	UseSquashPrTitleAsDefault bool      `json:"use_squash_pr_title_as_default"`
	SquashMergeCommitTitle    string    `json:"squash_merge_commit_title"`
	SquashMergeCommitMessage  string    `json:"squash_merge_commit_message"`
	MergeCommitTitle          string    `json:"merge_commit_title"`
	MergeCommitMessage        string    `json:"merge_commit_message"`
	AllowMergeCommit          bool      `json:"allow_merge_commit"`
	AllowForking              bool      `json:"allow_forking"`
	WebCommitSignoffRequired  bool      `json:"web_commit_signoff_required"`
	OpenIssues                int       `json:"open_issues"`
	Watchers                  int       `json:"watchers"`
	MasterBranch              string    `json:"master_branch"`
	StarredAt                 string    `json:"starred_at"`
	AnonymousAccessEnabled    bool      `json:"anonymous_access_enabled"`
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
	Title                     string    `json:"title"`
	User                      User      `json:"user"`
	Body                      string    `json:"body"`
	Labels                    []Label   `json:"labels"`
	Milestone                 Milestone `json:"milestone"`
	ActiveLockReason          string    `json:"active_lock_reason"`
	CreatedAt                 time.Time `json:"created_at"`
	UpdatedAt                 time.Time `json:"updated_at"`
	ClosedAt                  time.Time `json:"closed_at"`
	MergedAt                  time.Time `json:"merged_at"`
	MergeCommitSha            string    `json:"merge_commit_sha"`
	Assignee                  User      `json:"assignee"`
	Assignees                 []User    `json:"assignees"`
	RequestedReviewers        []User    `json:"requested_reviewers"`
	RequestedTeams            []Team    `json:"requested_teams"`
	Head                      Head      `json:"head"`
	Base                      Base      `json:"base"`
	Links                     Links     `json:"_links"`
	AuthorAssociation         string    `json:"author_association"`
	Draft                     bool      `json:"draft"`
	Merged                    bool      `json:"merged"`
	Mergeable                 bool      `json:"mergeable"`
	Rebaseable                bool      `json:"rebaseable"`
	MergeableState            string    `json:"mergeable_state"`
	MergedBy                  User      `json:"merged_by"`
	Comments                  int       `json:"comments"`
	ReviewComments            int       `json:"review_comments"`
	MaintainerCanModify       bool      `json:"maintainer_can_modify"`
	Commits                   int       `json:"commits"`
	Additions                 int       `json:"additions"`
	Deletions                 int       `json:"deletions"`
	ChangedFiles              int       `json:"changed_files"`
	AllowAutoMerge            bool      `json:"allow_auto_merge"`
	AllowUpdateBranch         bool      `json:"allow_update_branch"`
	DeleteBranchOnMerge       bool      `json:"delete_branch_on_merge"`
	MergeCommitMessage        string    `json:"merge_commit_message"`
	MergeCommitTitle          string    `json:"merge_commit_title"`
	SquashMergeCommitMessagse string    `json:"squash_merge_commit_message"`
	SquashMergeCommitTitle    string    `json:"squash_merge_commit_title"`
	UseSquashPrTitleAsDefault bool      `json:"use_squash_pr_title_as_default"`
}
