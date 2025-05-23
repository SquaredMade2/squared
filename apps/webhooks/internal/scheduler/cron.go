package scheduler

import (
	"log"
	"time"

	"github.com/robfig/cron/v3"
)

type Scheduler struct {
	cron *cron.Cron
}

// NewScheduler creates a new scheduler instance
func NewScheduler() *Scheduler {
	return &Scheduler{
		cron: cron.New(),
	}
}

// ScheduleWeekdays schedules a job to run at 10am Melbourne time on weekdays (Mon-Fri)
func (s *Scheduler) ScheduleWeekdays(job func()) error {
	// Melbourne timezone
	location, err := time.LoadLocation("Australia/Melbourne")
	if err != nil {
		return err
	}

	// Create cron with timezone support
	c := cron.New(cron.WithLocation(location))

	// Cron format: 0 5 * * 1-5 (5am, Monday-Friday)
	// Minute Hour Day Month Weekday
	_, err = c.AddFunc("0 5 * * 1-5", job)
	if err != nil {
		return err
	}

	s.cron = c
	return nil
}

// Start begins the scheduler
func (s *Scheduler) Start() {
	s.cron.Start()
	log.Println("Scheduler started - jobs will run at 5am weekdays (Melbourne time)")
}

// Stop gracefully stops the scheduler
func (s *Scheduler) Stop() {
	ctx := s.cron.Stop()
	select {
	case <-ctx.Done():
		log.Println("Scheduler stopped gracefully")
	case <-time.After(5 * time.Second):
		log.Println("Scheduler stop timeout - forcing exit")
	}
}

// GetNextRun returns the next scheduled run time
func (s *Scheduler) GetNextRun() time.Time {
	entries := s.cron.Entries()
	if len(entries) > 0 {
		return entries[0].Next
	}
	return time.Time{}
}

// ScheduleMultiple schedules multiple jobs with different timings if needed
func (s *Scheduler) ScheduleMultiple(jobs map[string]func()) error {
	location, err := time.LoadLocation("Australia/Melbourne")
	if err != nil {
		return err
	}

	c := cron.New(cron.WithLocation(location))

	// Default: weekdays at 10am for jobs without specific timing
	defaultSchedule := "0 5 * * 1-5"

	for name, job := range jobs {
		_, err := c.AddFunc(defaultSchedule, func() {
			log.Printf("Running job: %s", name)
			job()
		})
		if err != nil {
			return err
		}
	}

	s.cron = c
	return nil
}
