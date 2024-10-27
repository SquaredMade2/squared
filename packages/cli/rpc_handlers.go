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
	Name       string                 `json:"name"`
	URL        string                 `json:"url"`
	Interfaces []map[string]interface{} `json:"interfaces,omitempty"`
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

	var serviceInfo map[string]interface{}
	err = json.Unmarshal(body, &serviceInfo)
	if err != nil {
		fmt.Printf("Error parsing service information: %v\n", err)
		return
	}

	serviceName, ok := serviceInfo["serviceName"].(string)
	if !ok {
		fmt.Println("Error: Service name not found in the response")
		return
	}

	service := Service{
		Name: serviceName,
		URL:  serviceURL,
	}

	// Save service information
	services, err := loadServices()
	if err != nil {
		fmt.Printf("Error loading existing services: %v\n", err)
		return
	}

	// Check if service already exists
	for i, s := range services {
		if s.Name == service.Name {
			services[i] = service // Update existing service
			fmt.Printf("Service '%s' updated successfully\n", service.Name)
			return
		}
	}

	// Add new service
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
		fmt.Printf("- %s\n", service.Name)
		fmt.Printf("  URL: %s\n", service.URL)
		if len(service.Interfaces) > 0 {
			fmt.Println("  Interfaces:")
			for _, iface := range service.Interfaces {
				fmt.Printf("    - %s\n", iface["methodName"])
			}
		}
		fmt.Println()
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