package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/SquaredMade2/squared/apps/webhooks/internal/discord"
	"github.com/SquaredMade2/squared/apps/webhooks/internal/scheduler"
)

func main() {
	s := scheduler.NewScheduler()

	if err := s.ScheduleWeekdays(func() {
		err := discord.RunStandupPrNotification()
		if err != nil {
			log.Fatalf("Failed to get PRs: %v", err)
		}
	}); err != nil {
		log.Fatal("Failed to schedule job:", err)
	}

	// Start the scheduler
	s.Start()

	// Show next run time
	nextRun := s.GetNextRun()
	log.Printf("Next job will run at: %s", nextRun.Format("2006-01-02 15:04:05 MST"))

	// Keep the program running
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down scheduler...")
	s.Stop()

}
