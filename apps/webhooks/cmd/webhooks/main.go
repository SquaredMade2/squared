package main

import (
	"log"
	"net/http"
	"os"

	"webhooks/internal/config"
	"webhooks/internal/github"
	"webhooks/internal/vercel"
)

func main() {
	config.LoadEnv()
	http.HandleFunc("/", handleRequest)
	http.HandleFunc("/github", github.WebhookHandler)
	http.HandleFunc("/vercel", vercel.WebhookHandler)

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
