package main

import (
	"log"
	"net/http"
	"os"

	"github.com/SquaredMade2/squared/apps/integrations/src/github"
)

func main() {
	http.HandleFunc("/", handleRequest)
	http.HandleFunc("/github", github.WebhookHandler)
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
