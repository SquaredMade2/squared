package main

import (
	"log"
	"net/http"
	"os"

	"github.com/SquaredMade2/squared/apps/integrations/github"
	"github.com/joho/godotenv"
)

func main() {
	http.HandleFunc("/", handleRequest)
	http.HandleFunc("/github", github.WebhookHandler)
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file")
		return
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
