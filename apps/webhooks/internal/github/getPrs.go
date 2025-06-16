package github

import (
	"context"
	"fmt"
	"os"
	"strconv"

	"webhooks/internal/utils"

	"github.com/google/go-github/v72/github"
)

// PrsByRepository represents a collection of pull requests for a specific repository.
// It groups pull requests by their repository name, making it easier to organize and
// display pull requests on a per-repository basis.
//
// Fields:
// - Repository: The full repository name in the format "owner/repo"
// - PullRequests: A slice of GitHub pull request objects associated with this repository
type PrsByRepository struct {
	Repository   string
	PullRequests []*github.PullRequest
}

const (
	PRS_PER_PAGE         = 20
	MAX_CONCURRENT_REPOS = 10
	REPOS_PER_PAGE       = 100
	MAX_CONCURRENT_PAGES = 5
)

// GetPrs retrieves and formats open pull requests from all repositories in the configured GitHub organization.
// It performs the following steps:
// 1. Authenticates with GitHub using installation credentials
// 2. Lists all repositories in the organization specified by GITHUB_ORG_NAME (concurrently)
// 3. For each repository, fetches up to 20 open pull requests concurrently, sorted by most recently updated
//
// Returns:
// - A slice of PrsByRepository containing pull requests organized by repository
// - An error if any GitHub API calls fail or if authentication fails
func GetPrs() ([]*PrsByRepository, error) {
	installationID, err := strconv.ParseInt(os.Getenv("BOT_INSTALLATION_ID"), 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid installation ID: %w", err)
	}

	client, err := createGitHubInstallationClient(installationID)
	if err != nil {
		return nil, err
	}

	repos, err := getAllRepositories(client, os.Getenv("GITHUB_ORG_NAME"))
	if err != nil {
		return nil, err
	}

	// Create concurrent runner
	runner := utils.New(MAX_CONCURRENT_REPOS)

	// Fetch PRs for all repositories concurrently
	results, err := utils.RunWithItemsUnordered(runner, context.Background(), repos,
		func(ctx context.Context, repo *github.Repository) (*PrsByRepository, error) {
			repoPrs, _, err := client.PullRequests.List(ctx,
				repo.GetOwner().GetLogin(),
				repo.GetName(),
				&github.PullRequestListOptions{
					State:     "open",
					Sort:      "updated",
					Direction: "desc",
					ListOptions: github.ListOptions{
						Page:    1,
						PerPage: PRS_PER_PAGE,
					},
				})
			if err != nil {
				return nil, fmt.Errorf("failed to fetch PRs for %s/%s: %w",
					repo.GetOwner().GetLogin(), repo.GetName(), err)
			}

			return &PrsByRepository{
				Repository:   fmt.Sprintf("%s/%s", repo.GetOwner().GetLogin(), repo.GetName()),
				PullRequests: repoPrs,
			}, nil
		})

	if err != nil {
		return nil, err
	}

	return results, nil
}

// repositoryPage represents a single page of repository results
type repositoryPage struct {
	repos    []*github.Repository
	pageNum  int
	response *github.Response
}

// getAllRepositories fetches all repositories for an organization using concurrent page requests.
// It first makes an initial request to determine total pages, then fetches remaining pages concurrently.
func getAllRepositories(client *github.Client, orgName string) ([]*github.Repository, error) {
	// First, make an initial request to get total count and first page
	opts := &github.RepositoryListByOrgOptions{
		Sort: "updated",
		ListOptions: github.ListOptions{
			Page:    1,
			PerPage: REPOS_PER_PAGE,
		},
	}

	firstPageRepos, resp, err := client.Repositories.ListByOrg(context.Background(), orgName, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch first page of repositories: %w", err)
	}

	// If there's only one page, return immediately
	if resp.LastPage <= 1 {
		fmt.Printf("Found %d repositories on single page\n", len(firstPageRepos))
		filteredRepos := filterRepos(firstPageRepos)
		return filteredRepos, nil
	}

	// Create page numbers for remaining pages (skip page 1, already fetched)
	pageNumbers := make([]int, resp.LastPage-1)
	for i := 2; i <= resp.LastPage; i++ {
		pageNumbers[i-2] = i
	}

	// Create concurrent runner for page fetching
	runner := utils.New(MAX_CONCURRENT_PAGES)

	// Fetch remaining pages concurrently
	remainingPages, err := utils.RunWithItems(runner, context.Background(), pageNumbers,
		func(ctx context.Context, pageNum int) (*repositoryPage, error) {
			pageOpts := &github.RepositoryListByOrgOptions{
				Sort: "updated",
				ListOptions: github.ListOptions{
					Page:    pageNum,
					PerPage: REPOS_PER_PAGE,
				},
			}

			pageRepos, pageResp, err := client.Repositories.ListByOrg(ctx, orgName, pageOpts)
			if err != nil {
				return nil, fmt.Errorf("failed to fetch page %d: %w", pageNum, err)
			}

			return &repositoryPage{
				repos:    pageRepos,
				pageNum:  pageNum,
				response: pageResp,
			}, nil
		})

	if err != nil {
		return nil, err
	}

	// Combine all pages into a single slice
	var allRepos []*github.Repository
	allRepos = append(allRepos, firstPageRepos...) // Add first page

	// Add remaining pages in order
	for _, page := range remainingPages {
		allRepos = append(allRepos, page.repos...)
	}

	fmt.Printf("Fetched %d total repositories\n", len(allRepos))
	filteredRepos := filterRepos(allRepos)

	return filteredRepos, nil
}
