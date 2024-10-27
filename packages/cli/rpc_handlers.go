package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

const (
	configDir  = ".squared"
	configFile = "services.json"
)

type Service struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

func installService(cmd *cobra.Command, args []string) {
	serviceURL := args[0]
	fmt.Printf("Installing service from URL: %s\n", serviceURL)

	// Fetch service information
	resp, err := http.Get(serviceURL)
	if err != nil {
		fmt.Printf("Error fetching service information: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading service information: %v\n", err)
		return
	}

	var service Service
	err = json.Unmarshal(body, &service)
	if err != nil {
		fmt.Printf("Error parsing service information: %v\n", err)
		return
	}

	// Save service information
	services, err := loadServices()
	if err != nil {
		fmt.Printf("Error loading existing services: %v\n", err)
		return
	}

	services = append(services, service)
	err = saveServices(services)
	if err != nil {
		fmt.Printf("Error saving service information: %v\n", err)
		return
	}

	fmt.Printf("Service '%s' installed successfully\n", service.Name)
}

func listServices(cmd *cobra.Command, args []string) {
	fmt.Println("Listing all available services:")

	services, err := loadServices()
	if err != nil {
		fmt.Printf("Error loading services: %v\n", err)
		return
	}

	if len(services) == 0 {
		fmt.Println("No services installed")
		return
	}

	for _, service := range services {
		fmt.Printf("- %s (%s)\n", service.Name, service.URL)
	}
}

func loadServices() ([]Service, error) {
	configPath := filepath.Join(os.Getenv("HOME"), configDir, configFile)
	data, err := ioutil.ReadFile(configPath)
	if os.IsNotExist(err) {
		return []Service{}, nil
	} else if err != nil {
		return nil, err
	}

	var services []Service
	err = json.Unmarshal(data, &services)
	if err != nil {
		return nil, err
	}

	return services, nil
}

func saveServices(services []Service) error {
	configPath := filepath.Join(os.Getenv("HOME"), configDir, configFile)
	data, err := json.MarshalIndent(services, "", "  ")
	if err != nil {
		return err
	}

	err = os.MkdirAll(filepath.Dir(configPath), 0755)
	if err != nil {
		return err
	}

	return ioutil.WriteFile(configPath, data, 0644)
}