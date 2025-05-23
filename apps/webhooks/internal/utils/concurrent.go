package utils

import (
	"context"
	"sync"

	"golang.org/x/sync/errgroup"
)

// Task represents a unit of work to be executed concurrently
type Task[T any] func(ctx context.Context) (T, error)

// Runner provides utilities for running tasks concurrently with error handling
type Runner struct {
	maxConcurrency int
}

// New creates a new concurrent runner with specified max concurrency
func New(maxConcurrency int) *Runner {
	return &Runner{
		maxConcurrency: maxConcurrency,
	}
}

// RunTasks executes multiple tasks concurrently and collects results
// Returns results in the same order as input tasks
func RunTasks[T any](r *Runner, ctx context.Context, tasks []Task[T]) ([]T, error) {
	if len(tasks) == 0 {
		return nil, nil
	}

	results := make([]T, len(tasks))
	g, gCtx := errgroup.WithContext(ctx)
	g.SetLimit(r.maxConcurrency)

	var mu sync.Mutex

	for i, task := range tasks {
		i, task := i, task // Capture loop variables
		g.Go(func() error {
			result, err := task(gCtx)
			if err != nil {
				return err
			}

			mu.Lock()
			results[i] = result
			mu.Unlock()
			return nil
		})
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}

	return results, nil
}

// RunTasksUnordered executes multiple tasks concurrently and appends results as they complete
// Results may not be in the same order as input tasks, but this can be more memory efficient
func RunTasksUnordered[T any](r *Runner, ctx context.Context, tasks []Task[T]) ([]T, error) {
	if len(tasks) == 0 {
		return nil, nil
	}

	var results []T
	g, gCtx := errgroup.WithContext(ctx)
	g.SetLimit(r.maxConcurrency)

	var mu sync.Mutex

	for _, task := range tasks {
		task := task // Capture loop variable
		g.Go(func() error {
			result, err := task(gCtx)
			if err != nil {
				return err
			}

			mu.Lock()
			results = append(results, result)
			mu.Unlock()
			return nil
		})
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}

	return results, nil
}

// RunWithItems is a convenience function that takes a slice of items and a function
// that processes each item, executing them concurrently
func RunWithItems[T, R any](r *Runner, ctx context.Context, items []T, fn func(ctx context.Context, item T) (R, error)) ([]R, error) {
	tasks := make([]Task[R], len(items))
	for i, item := range items {
		item := item // Capture loop variable
		tasks[i] = func(ctx context.Context) (R, error) {
			return fn(ctx, item)
		}
	}
	return RunTasks(r, ctx, tasks)
}

// RunWithItemsUnordered is like RunWithItems but doesn't preserve order
func RunWithItemsUnordered[T, R any](r *Runner, ctx context.Context, items []T, fn func(ctx context.Context, item T) (R, error)) ([]R, error) {
	tasks := make([]Task[R], len(items))
	for i, item := range items {
		item := item // Capture loop variable
		tasks[i] = func(ctx context.Context) (R, error) {
			return fn(ctx, item)
		}
	}
	return RunTasksUnordered(r, ctx, tasks)
}
