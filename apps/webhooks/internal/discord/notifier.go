package discord

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/SquaredMade2/squared/apps/webhooks/internal/github"
)

func RunStandupPrNotification() error {
	start := time.Now()
	fmt.Println("Running Standup PR Notification...")
	prs, err := github.GetPrs()

	if err != nil {
		log.Fatalf("Failed to get PRs: %v", err)
		return err
	}

	filteredPrs := github.FilterPrs(prs)

	client, err := createDiscordClient()
	if err != nil {
		return err
	}

	for i, repo := range filteredPrs {
		isLast := i == len(filteredPrs)-1
		suffix := "\n\n"
		if isLast {
			suffix = ""
		}
		repoString := fmt.Sprintf("## %s\n%s%s", repo.Repository, github.FormatPrs(repo.PullRequests), suffix)
		client.ChannelMessageSend(os.Getenv("DISCORD_CHANNEL"), repoString)
		// fmt.Println(repoString)
	}

	fmt.Printf("Total time taken: %v\n", time.Since(start))

	return nil
}
