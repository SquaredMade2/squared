package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/SquaredMade2/squared/apps/webhooks/github"
	"github.com/SquaredMade2/squared/apps/webhooks/helpers"
	"github.com/SquaredMade2/squared/apps/webhooks/vercel"
)

func main() {
	// Define command line flags
	verboseLogging := flag.Bool("verbose", false, "Enable verbose logging")
	quietLogging := flag.Bool("quiet", false, "Disable all non-essential logging")
	flag.Parse()

	// Set the logging level based on flags
	if *verboseLogging {
		github.SetLogLevel(github.LogLevelFull)
		log.Println("Verbose logging enabled")
	} else if *quietLogging {
		github.SetLogLevel(github.LogLevelQuiet)
		log.Println("Quiet mode enabled")
	} else {
		github.SetLogLevel(github.LogLevelBasic)
	}

	helpers.LoadEnv()
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
