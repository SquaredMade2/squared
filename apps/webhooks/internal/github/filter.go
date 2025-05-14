package github

import (
	"time"

	"github.com/google/go-github/v72/github"
)

// MAX_AGE is the maximum age of a pull request to be included in the results (6 months)
var MAX_AGE = time.Now().AddDate(0, -6, 0)

// FilterPrs filters a list of repositories and their pull requests to only include:
// - Repositories that have at least one open pull request with reviewers
// - Pull requests that are:
//   - Open (not closed or merged)
//   - Have at least one requested reviewer
//
// The filtered results maintain the same structure as the input, with repositories
// containing only their filtered pull requests.
func FilterPrs(repos []*PrsByRepository) []*PrsByRepository {
	var filteredRepos []*PrsByRepository

	for _, repo := range repos {
		var filteredPrs []*github.PullRequest

		// Filter PRs that are open and have requested reviewers
		for _, pr := range repo.PullRequests {
			if pr.State != nil && *pr.State == "open" && len(pr.RequestedReviewers) > 0 && pr.User != nil && pr.User.GetType() != "Bot" && pr.GetUpdatedAt().After(MAX_AGE) {
				filteredPrs = append(filteredPrs, pr)
			}
		}

		if len(filteredPrs) > 0 {
			filteredRepos = append(filteredRepos, &PrsByRepository{
				Repository:   repo.Repository,
				PullRequests: filteredPrs,
			})
		}
	}

	return filteredRepos
}

func filterRepos(repos []*github.Repository) []*github.Repository {
	var filteredRepos []*github.Repository

	for _, repo := range repos {
		if !repo.GetArchived() && repo.GetUpdatedAt().After(MAX_AGE) {
			filteredRepos = append(filteredRepos, repo)
		}
	}

	return filteredRepos
}
