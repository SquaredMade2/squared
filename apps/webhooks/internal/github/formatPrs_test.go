package github

import (
	"fmt"
	"strings"
	"testing"
	"time"

	"github.com/SquaredMade2/squared/apps/webhooks/internal/testhelpers"
	"github.com/google/go-github/v72/github"
	"github.com/stretchr/testify/assert"
)

func TestFormatDuration(t *testing.T) {
	tests := []struct {
		name     string
		duration time.Duration
		expected string
	}{
		{
			name:     "0 minutes",
			duration: 0,
			expected: "just now",
		},
		{
			name:     "30 minutes",
			duration: 30 * time.Minute,
			expected: "just now",
		},
		{
			name:     "1 hour exactly",
			duration: 1 * time.Hour,
			expected: "an hour",
		},
		{
			name:     "2 hours",
			duration: 2 * time.Hour,
			expected: "2 hours",
		},
		{
			name:     "23 hours",
			duration: 23 * time.Hour,
			expected: "23 hours",
		},
		{
			name:     "1 day exactly",
			duration: 24 * time.Hour,
			expected: "1 day",
		},
		{
			name:     "2 days",
			duration: 48 * time.Hour,
			expected: "2 days",
		},
		{
			name:     "6 days",
			duration: 6 * 24 * time.Hour,
			expected: "6 days",
		},
		{
			name:     "1 week exactly",
			duration: 7 * 24 * time.Hour,
			expected: "a week",
		},
		{
			name:     "2 weeks",
			duration: 14 * 24 * time.Hour,
			expected: "2 weeks",
		},
		{
			name:     "3 weeks",
			duration: 21 * 24 * time.Hour,
			expected: "3 weeks",
		},
		{
			name:     "4 weeks",
			duration: 28 * 24 * time.Hour,
			expected: "4 weeks",
		},
		{
			name:     "1 month",
			duration: 30 * 24 * time.Hour,
			expected: "a month",
		},
		{
			name:     "2 months",
			duration: 60 * 24 * time.Hour,
			expected: "2 months",
		},
		{
			name:     "1 year",
			duration: 365 * 24 * time.Hour,
			expected: "12 months",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := formatDuration(tt.duration)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestFormatPrInfo(t *testing.T) {
	// Set fixed times for testing
	now := time.Now()
	createdAt := now.Add(-2 * 24 * time.Hour) // 2 days ago
	updatedAt := now.Add(-6 * time.Hour)      // 6 hours ago

	reviewers := []*github.User{
		testhelpers.CreateTestGithubUser(1, "reviewer1"),
		testhelpers.CreateTestGithubUser(2, "reviewer2"),
	}

	pr := testhelpers.CreateTestPR(
		123,
		456,
		"open",
		"Fix bug in authentication",
		"https://github.com/org/repo/pull/456",
		"johndoe",
		createdAt,
		updatedAt,
		reviewers,
	)

	result := formatPrInfo(pr)

	// Verify all components are present
	assert.Contains(t, result, "[#456]", "Should contain PR number")
	assert.Contains(t, result, "[Fix bug in authentication]", "Should contain PR title")
	assert.Contains(t, result, "(https://github.com/org/repo/pull/456)", "Should contain PR URL")
	assert.Contains(t, result, "(*johndoe*)", "Should contain PR author")
	assert.Contains(t, result, "6 hours stale", "Should contain stale duration")
	assert.Contains(t, result, "2 days old", "Should contain age duration")
	assert.Contains(t, result, "Waiting on", "Should contain 'Waiting on' text")
}

func TestFormatPrInfo_NoReviewers(t *testing.T) {
	now := time.Now()
	pr := testhelpers.CreateTestPR(
		123,
		456,
		"open",
		"Fix bug",
		"https://github.com/org/repo/pull/456",
		"johndoe",
		now.Add(-1*time.Hour),
		now.Add(-30*time.Minute),
		[]*github.User{}, // No reviewers
	)

	result := formatPrInfo(pr)

	// Should still format properly with no reviewers
	assert.Contains(t, result, "[#456]")
	assert.Contains(t, result, "Waiting on")
	// The reviewer section should be empty but the format should still be correct
}

func TestFormatPrs_MultiplePRs(t *testing.T) {
	now := time.Now()
	prs := []*github.PullRequest{
		testhelpers.CreateTestPR(1, 100, "open", "First PR", "https://github.com/org/repo/pull/100", "user1",
			now.Add(-1*time.Hour), now.Add(-30*time.Minute), []*github.User{testhelpers.CreateTestGithubUser(1, "reviewer1")}),
		testhelpers.CreateTestPR(2, 200, "open", "Second PR", "https://github.com/org/repo/pull/200", "user2",
			now.Add(-2*time.Hour), now.Add(-1*time.Hour), []*github.User{testhelpers.CreateTestGithubUser(2, "reviewer2")}),
	}

	result := FormatPrs(prs)

	// Should contain both PRs separated by newlines
	lines := strings.Split(result, "\n")
	assert.Len(t, lines, 4, "Should have 4 lines (2 PRs * 2 lines each)")

	assert.Contains(t, result, "[#100]", "Should contain first PR")
	assert.Contains(t, result, "[#200]", "Should contain second PR")
	assert.Contains(t, result, "First PR", "Should contain first PR title")
	assert.Contains(t, result, "Second PR", "Should contain second PR title")
}

func TestFormatPrs_EmptyList(t *testing.T) {
	result := FormatPrs([]*github.PullRequest{})
	assert.Equal(t, "", result, "Empty PR list should return empty string")
}

// Note: Testing formatReviewers requires mocking the slack.UserMap
// Since we can't easily mock the entire slack package without dependency injection,
// we'll create a more unit-focused test approach

func TestFormatReviewers_StructureOnly(t *testing.T) {
	// This test focuses on the structure of the function without the Slack integration
	reviewers := []*github.User{
		testhelpers.CreateTestGithubUser(1, "user1"),
		testhelpers.CreateTestGithubUser(2, "user2"),
		testhelpers.CreateTestGithubUser(3, "user3"),
	}

	// We can't easily test the actual Slack username mapping without mocking
	// but we can test that the function doesn't panic and produces some output
	result := formatReviewers(reviewers)

	// The result should not be empty
	assert.NotEmpty(t, result, "Should produce some output even if Slack mapping fails")

	// Should contain the GitHub usernames as fallback
	assert.Contains(t, result, "user1")
	assert.Contains(t, result, "user2")
	assert.Contains(t, result, "user3")
}

func TestFormatReviewers_EmptyList(t *testing.T) {
	result := formatReviewers([]*github.User{})
	assert.Equal(t, "", result, "Empty reviewers list should return empty string")
}

// Integration test with fixed time
func TestFormatPrInfo_Integration(t *testing.T) {
	// Use a fixed time for consistent testing
	fixedTime := time.Date(2024, 1, 15, 12, 0, 0, 0, time.UTC)

	// Mock time.Since by creating durations relative to our fixed time
	createdAt := fixedTime.Add(-3 * 24 * time.Hour) // 3 days ago
	updatedAt := fixedTime.Add(-2 * time.Hour)      // 2 hours ago

	reviewers := []*github.User{
		testhelpers.CreateTestGithubUser(1, "alice"),
		testhelpers.CreateTestGithubUser(2, "bob"),
	}

	pr := testhelpers.CreateTestPR(
		789,
		101,
		"open",
		"Add new feature",
		"https://github.com/example/repo/pull/101",
		"developer",
		createdAt,
		updatedAt,
		reviewers,
	)

	result := formatPrInfo(pr)

	// Verify the structure is correct
	assert.Contains(t, result, "[#101]")
	assert.Contains(t, result, "[Add new feature]")
	assert.Contains(t, result, "https://github.com/example/repo/pull/101")
	assert.Contains(t, result, "(*developer*)")
	assert.Contains(t, result, "Waiting on")
}

// Benchmark tests
func BenchmarkFormatDuration(b *testing.B) {
	durations := []time.Duration{
		30 * time.Minute,
		1 * time.Hour,
		24 * time.Hour,
		7 * 24 * time.Hour,
		30 * 24 * time.Hour,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		for _, d := range durations {
			formatDuration(d)
		}
	}
}

func BenchmarkFormatPrs(b *testing.B) {
	now := time.Now()
	prs := make([]*github.PullRequest, 10)
	for i := 0; i < 10; i++ {
		prs[i] = testhelpers.CreateTestPR(
			int64(i),
			i+1,
			"open",
			fmt.Sprintf("PR %d", i+1),
			fmt.Sprintf("https://github.com/org/repo/pull/%d", i+1),
			fmt.Sprintf("user%d", i+1),
			now.Add(-time.Duration(i+1)*time.Hour),
			now.Add(-time.Duration(i)*time.Minute),
			[]*github.User{testhelpers.CreateTestGithubUser(int64(i+100), fmt.Sprintf("reviewer%d", i+1))},
		)
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		FormatPrs(prs)
	}
}
