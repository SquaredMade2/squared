package main

import (
	"log"
	"net/http"
	"os"

	"github.com/SquaredMade2/squared/apps/webhooks/github"
	"github.com/SquaredMade2/squared/apps/webhooks/vercel"
	"github.com/joho/godotenv"
)

func main() {
	http.HandleFunc("/bob", handleRequest)
	http.HandleFunc("/", github.WebhookHandler)
	http.HandleFunc("/vercel", vercel.WebhookHandler)

	if os.Getenv("PORT") == "" {
		err := godotenv.Load()
		if err != nil {
			log.Printf("Error loading .env file")
			return
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3131"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
