package github

import (
	"fmt"
	"strings"
	"time"

	"github.com/SquaredMade2/squared/apps/webhooks/data"
	"github.com/google/go-github/v72/github"
)

func FormatPrs(prs []*github.PullRequest) string {
	var formattedPrs []string
	for _, pr := range prs {
		formattedPrs = append(formattedPrs, formatPrInfo(pr))
	}
	return strings.Join(formattedPrs, "\n")
}

func formatPrInfo(pr *github.PullRequest) string {
	staleDuration := time.Since(pr.GetUpdatedAt().Time)
	ageDuration := time.Since(pr.GetCreatedAt().Time)

	staleStr := formatDuration(staleDuration)
	ageStr := formatDuration(ageDuration)
	reviewersStr := formatReviewers(pr.RequestedReviewers)

	return fmt.Sprintf("[#%d] [%s](%s) (*%s*)\n*%s stale · %s old* · Waiting on %s", *pr.Number, *pr.Title, *pr.HTMLURL, *pr.User.Login, staleStr, ageStr, reviewersStr)
}

func formatReviewers(reviewers []*github.User) string {
	var reviewerNames []string

	for _, reviewer := range reviewers {
		exists := false
		discordUser, exists := data.GetDiscordByGitHub(*reviewer.Login)
		if exists {
			reviewerNames = append(reviewerNames, fmt.Sprintf("<@%s>", discordUser))
		} else {
			reviewerNames = append(reviewerNames, fmt.Sprintf("@%s", *reviewer.Login))
		}
	}

	return strings.Join(reviewerNames, ", ")
}

// formatDuration converts a duration to human-readable format
func formatDuration(d time.Duration) string {
	hours := int(d.Hours())
	days := int(d.Hours() / 24)
	weeks := days / 7
	months := days / 30

	if hours < 1 {
		return "just now"
	} else if hours == 1 {
		return "an hour"
	} else if hours < 24 {
		return fmt.Sprintf("%d hours", hours)
	} else if days == 1 {
		return "1 day"
	} else if weeks > 4 || months > 0 {
		if months == 1 {
			return "a month"
		}
		return fmt.Sprintf("%d months", months)
	} else if weeks >= 1 {
		if weeks == 1 {
			return "a week"
		}
		return fmt.Sprintf("%d weeks", weeks)
	} else {
		return fmt.Sprintf("%d days", days)
	}
}
