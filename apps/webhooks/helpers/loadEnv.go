package helpers

import (
	"log"
	"os"
	"path/filepath"
	"testing"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	// Check if SERVER_URL is already set, indicating environment is already configured
	if os.Getenv("PORT") != "" {
		log.Println("Environment already configured, skipping .env file loading")
		return
	}

	// Start from the current working directory
	dir, err := os.Getwd()
	if err != nil {
		log.Printf("Error getting current directory: %v", err)
		return
	}

	// Traverse up the directory tree until we find the .env file or reach the root
	for {
		envFile := filepath.Join(dir, ".env")
		if _, err := os.Stat(envFile); err == nil {
			err = godotenv.Load(envFile)
			if err != nil {
				log.Printf("Error loading .env file: %v", err)
			}
			return
		}

		// Move up one directory
		parent := filepath.Dir(dir)
		if parent == dir {
			// We've reached the root directory without finding the .env file
			log.Println("Could not find .env file")
			return
		}
		dir = parent
	}
}

func TestMain(m *testing.M) {
	LoadEnv()
	code := m.Run()
	os.Exit(code)
}
