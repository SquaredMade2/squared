package testhelpers

import (
	"time"

	"github.com/google/go-github/v72/github"
)

func CreateTestGithubUser(id int64, login string) *github.User {
	return &github.User{
		ID:    int64Ptr(id),
		Login: stringPtr(login),
	}
}

// Helper function to create a pointer to a string
func stringPtr(s string) *string {
	return &s
}

// Helper function to create a pointer to an int64
func int64Ptr(i int64) *int64 {
	return &i
}

// Helper function to create a pointer to an int
func intPtr(i int) *int {
	return &i
}

// Helper function to create a pointer to a time
func timePtr(t time.Time) *github.Timestamp {
	return &github.Timestamp{Time: t}
}

func CreateTestPR(id int64, number int, state, title, url, userLogin string, createdAt, updatedAt time.Time, reviewers []*github.User) *github.PullRequest {
	return &github.PullRequest{
		ID:                 int64Ptr(id),
		Number:             intPtr(number),
		Title:              stringPtr(title),
		HTMLURL:            stringPtr(url),
		User:               CreateTestGithubUser(100, userLogin),
		CreatedAt:          timePtr(createdAt),
		UpdatedAt:          timePtr(updatedAt),
		RequestedReviewers: reviewers,
		State:              stringPtr(state),
	}
}
