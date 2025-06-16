package github

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"testing"
	"time"

	"webhooks/internal/testhelpers"

	"github.com/google/go-github/v72/github"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Helper function to load test data
func loadTestData(t *testing.T, filename string) string {
	t.Helper()

	// Get the directory of the current test file
	_, currentFile, _, _ := runtime.Caller(0)
	currentDir := filepath.Dir(currentFile)

	// Build path to testdata file (assuming it's relative to the test file)
	filePath := filepath.Join(currentDir, "../../internal/github/testdata", filename)

	data, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to read test data file %s: %v", filename, err)
	}

	return string(data)
}

func TestFilterPrs_WithTestData(t *testing.T) {
	// Load test data from file
	testDataString := loadTestData(t, "github-prs.json")
	testResultString := loadTestData(t, "github-prs-filtered.json")

	// Parse the test data
	var testData []*PrsByRepository
	err := json.Unmarshal([]byte(testDataString), &testData)
	require.NoError(t, err, "Failed to parse test data")

	// Execute the function
	result := FilterPrs(testData)

	// Verify results
	for _, repoResult := range result {
		assert.NotNil(t, repoResult.Repository)
		assert.NotEmpty(t, repoResult.PullRequests)

		// Verify all returned PRs are open and have reviewers
		for _, pr := range repoResult.PullRequests {
			assert.NotNil(t, pr.State)
			assert.Equal(t, "open", *pr.State, "All returned PRs should be open")
			assert.NotEmpty(t, pr.RequestedReviewers, "All returned PRs should have requested reviewers")
		}
	}

	resultJSON, err := json.Marshal(result)
	require.NoError(t, err, "Failed to marshal result to JSON")

	assert.JSONEq(t, testResultString, string(resultJSON), "Filtered result should match expected JSON")
}

func TestFilterPrs_EmptyInput(t *testing.T) {
	result := FilterPrs([]*PrsByRepository{})
	assert.Empty(t, result, "Empty input should return empty result")
}

func TestFilterPrs_NoOpenPrs(t *testing.T) {
	// Create test data with only closed PRs
	reviewers := []*github.User{testhelpers.CreateTestGithubUser(1, "reviewer1")}
	repos := []*PrsByRepository{
		{
			Repository: "org/repo1",
			PullRequests: []*github.PullRequest{
				testhelpers.CreateTestPR(1, 1, "Test PR", "closed", "https://github.com/org/repo/pull/1", "user1",
					time.Now().Add(-1*time.Hour), time.Now().Add(-30*time.Minute), reviewers),
				testhelpers.CreateTestPR(2, 2, "merged", "Test PR", "https://github.com/org/repo/pull/2", "user2",
					time.Now().Add(-2*time.Hour), time.Now().Add(-1*time.Hour), reviewers),
			},
		},
	}

	result := FilterPrs(repos)
	assert.Empty(t, result, "Should return empty result when no open PRs")
}

func TestFilterPrs_OpenPrsWithoutReviewers(t *testing.T) {
	// Create test data with open PRs but no reviewers
	repos := []*PrsByRepository{
		{
			Repository: "org/repo1",
			PullRequests: []*github.PullRequest{
				testhelpers.CreateTestPR(1, 1, "open", "Test PR", "https://github.com/org/repo/pull/1", "user1",
					time.Now().Add(-1*time.Hour), time.Now().Add(-30*time.Minute), []*github.User{}),
				testhelpers.CreateTestPR(2, 2, "open", "Test PR", "https://github.com/org/repo/pull/2", "user2",
					time.Now().Add(-2*time.Hour), time.Now().Add(-1*time.Hour), []*github.User{}),
			},
		},
	}

	result := FilterPrs(repos)
	assert.Empty(t, result, "Should return empty result when open PRs have no reviewers")
}

func TestFilterPrs_MixedScenarios(t *testing.T) {
	// Create test data with mixed scenarios
	reviewers := []*github.User{testhelpers.CreateTestGithubUser(1, "reviewer1")}

	repos := []*PrsByRepository{
		{
			Repository: "org/repo1",
			PullRequests: []*github.PullRequest{
				// This one should be included (open + has reviewers)
				testhelpers.CreateTestPR(1, 1, "open", "Test PR", "https://github.com/org/repo/pull/1", "user1",
					time.Now().Add(-1*time.Hour), time.Now().Add(-30*time.Minute), reviewers),
				// This one should be excluded (closed)
				testhelpers.CreateTestPR(2, 2, "closed", "Test PR", "https://github.com/org/repo/pull/2", "user2",
					time.Now().Add(-2*time.Hour), time.Now().Add(-1*time.Hour), reviewers),
				// This one should be excluded (no reviewers)
				testhelpers.CreateTestPR(3, 3, "open", "Test PR", "https://github.com/org/repo/pull/3", "user3",
					time.Now().Add(-3*time.Hour), time.Now().Add(-2*time.Hour), []*github.User{}),
			},
		},
		{
			Repository: "org/repo2",
			PullRequests: []*github.PullRequest{
				// This one should be included
				testhelpers.CreateTestPR(4, 4, "open", "Test PR", "https://github.com/org/repo/pull/4", "user4",
					time.Now().Add(-4*time.Hour), time.Now().Add(-3*time.Hour), reviewers),
				// This one should be included
				testhelpers.CreateTestPR(5, 5, "open", "Test PR", "https://github.com/org/repo/pull/5", "user5",
					time.Now().Add(-5*time.Hour), time.Now().Add(-4*time.Hour), reviewers),
			},
		},
		{
			Repository: "org/repo3",
			PullRequests: []*github.PullRequest{
				// All closed, should not include this repo in result
				testhelpers.CreateTestPR(6, 6, "closed", "Test PR", "https://github.com/org/repo/pull/6", "user6",
					time.Now().Add(-6*time.Hour), time.Now().Add(-5*time.Hour), reviewers),
				testhelpers.CreateTestPR(7, 7, "merged", "Test PR", "https://github.com/org/repo/pull/7", "user7",
					time.Now().Add(-7*time.Hour), time.Now().Add(-6*time.Hour), reviewers),
			},
		},
	}

	result := FilterPrs(repos)

	// Should have 2 repositories in result (repo1 and repo2)
	assert.Len(t, result, 2)

	// Check repo1
	repo1Result := findRepoByName(result, "org/repo1")
	require.NotNil(t, repo1Result)
	assert.Len(t, repo1Result.PullRequests, 1)
	assert.Equal(t, int64(1), *repo1Result.PullRequests[0].ID)

	// Check repo2
	repo2Result := findRepoByName(result, "org/repo2")
	require.NotNil(t, repo2Result)
	assert.Len(t, repo2Result.PullRequests, 2)
}

func TestFilterPrs_MultipleReviewers(t *testing.T) {
	// Test with PR that has multiple reviewers
	reviewers := []*github.User{
		testhelpers.CreateTestGithubUser(1, "reviewer1"),
		testhelpers.CreateTestGithubUser(2, "reviewer2"),
		testhelpers.CreateTestGithubUser(3, "reviewer3"),
	}

	repos := []*PrsByRepository{
		{
			Repository: "org/repo1",
			PullRequests: []*github.PullRequest{
				testhelpers.CreateTestPR(1, 1, "open", "Test PR", "https://github.com/org/repo/pull/1", "user1",
					time.Now().Add(-1*time.Hour), time.Now().Add(-30*time.Minute), reviewers),
			},
		},
	}

	result := FilterPrs(repos)
	assert.Len(t, result, 1)
	assert.Len(t, result[0].PullRequests, 1)
	assert.Len(t, result[0].PullRequests[0].RequestedReviewers, 3)
}

// Helper function to find a repository by name in the result
func findRepoByName(repos []*PrsByRepository, name string) *PrsByRepository {
	for _, repo := range repos {
		if repo.Repository == name {
			return repo
		}
	}
	return nil
}

// Benchmark test
func BenchmarkFilterPrs(b *testing.B) {
	// Create test data for benchmarking
	reviewers := []*github.User{testhelpers.CreateTestGithubUser(1, "reviewer1")}

	// Create a large dataset
	var repos []*PrsByRepository
	for i := 0; i < 100; i++ {
		var prs []*github.PullRequest
		for j := 0; j < 10; j++ {
			state := "open"
			if j%3 == 0 {
				state = "closed"
			}

			var prReviewers []*github.User
			if j%2 == 0 {
				prReviewers = reviewers
			}

			prs = append(prs, testhelpers.CreateTestPR(int64(i*10+j), int(i*10+j), state, "Test PR", "https://github.com/org/repo/pull/"+strconv.Itoa(i*10+j), "user"+strconv.Itoa(i*10+j),
				time.Now().Add(-1*time.Hour), time.Now().Add(-30*time.Minute), prReviewers))
		}

		repos = append(repos, &PrsByRepository{
			Repository:   "org/repo" + string(rune(i)),
			PullRequests: prs,
		})
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		FilterPrs(repos)
	}
}

// Test with edge cases
func TestFilterPrs_EdgeCases(t *testing.T) {
	testCases := []struct {
		name     string
		input    []*PrsByRepository
		expected int // expected number of repositories in result
	}{
		{
			name:     "nil input",
			input:    nil,
			expected: 0,
		},
		{
			name: "repository with nil pull requests",
			input: []*PrsByRepository{
				{
					Repository:   "org/repo1",
					PullRequests: nil,
				},
			},
			expected: 0,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := FilterPrs(tc.input)
			assert.Len(t, result, tc.expected)
		})
	}
}

// JSON Schema Validation
func TestFilterPrs_ValidateStructure(t *testing.T) {
	reviewers := []*github.User{testhelpers.CreateTestGithubUser(1, "reviewer1")}

	repos := []*PrsByRepository{
		{
			Repository: "org/repo1",
			PullRequests: []*github.PullRequest{
				testhelpers.CreateTestPR(1, 1, "open", "Test PR", "https://github.com/org/repo/pull/1", "user1",
					time.Now().Add(-1*time.Hour), time.Now().Add(-30*time.Minute), reviewers),
			},
		},
	}

	result := FilterPrs(repos)

	// Validate the structure of the result
	assert.NotNil(t, result)
	for _, repo := range result {
		assert.NotNil(t, repo)
		assert.NotNil(t, repo.Repository)
		assert.NotNil(t, repo.PullRequests)

		for _, pr := range repo.PullRequests {
			assert.NotNil(t, pr)
			assert.NotNil(t, pr.State)
			assert.NotNil(t, pr.RequestedReviewers)
		}
	}
}
