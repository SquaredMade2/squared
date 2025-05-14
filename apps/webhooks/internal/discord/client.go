package discord

import (
	"fmt"
	"os"

	"github.com/bwmarrin/discordgo"
)

func createDiscordClient() (*discordgo.Session, error) {
	token := os.Getenv("DISCORD_TOKEN")

	if token == "" {
		return nil, fmt.Errorf("DISCORD_TOKEN is not set")
	}

	discord, err := discordgo.New("Bot " + token)
	if err != nil {
		return nil, fmt.Errorf("failed to create Discord client: %w", err)
	}

	return discord, nil
}
