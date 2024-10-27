package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"text/template"

	"github.com/spf13/cobra"
)

const (
	configDir  = ".squared"
	configFile = "services.json"
)

type Service struct {
	Name       string        `json:"name"`
	URL        string        `json:"url"`
	Interfaces []interface{} `json:"interfaces"`
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
		Name:       serviceName,
		URL:        serviceURL,
		Interfaces: serviceInfo["interfaces"].([]interface{}),
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
			err = saveServices(services)
			if err != nil {
				fmt.Printf("Error saving service information: %v\n", err)
				return
			}
			generateTypeScriptFile(service)
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
	generateTypeScriptFile(service)
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
				if ifaceMap, ok := iface.(map[string]interface{}); ok {
					if methodName, ok := ifaceMap["methodName"].(string); ok {
						fmt.Printf("    - %s\n", methodName)
					}
				}
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

func generateTypeScriptFile(service Service) {
	cwd, err := os.Getwd()
	if err != nil {
		fmt.Printf("Error getting current working directory: %v\n", err)
		return
	}

	genDir := filepath.Join(cwd, "gen", "rpc")
	err = os.MkdirAll(genDir, 0755)
	if err != nil {
		fmt.Printf("Error creating directory: %v\n", err)
		return
	}

	fileName := filepath.Join(genDir, fmt.Sprintf("%s.ts", service.Name))

	tmpl := template.Must(template.New("typescript").Parse(`
import { Context } from "@squared/context";

export interface {{ .Name }}Client {
{{- range .Interfaces }}
  {{ .methodName }}(ctx: Context, {{ if .paramNames }}{{ range $index, $param := .paramNames }}{{ if $index }}, {{ end }}{{ $param }}: any{{ end }}{{ end }}): Promise<{{ if .responseSchema }}any{{ else }}void{{ end }}>;
{{- end }}
}

export const create{{ .Name }}Client = (baseUrl: string): {{ .Name }}Client => {
  return {
{{- range .Interfaces }}
    {{ .methodName }}: async (ctx: Context, {{ if .paramNames }}{{ range $index, $param := .paramNames }}{{ if $index }}, {{ end }}{{ $param }}: any{{ end }}{{ end }}) => {
      // Implementation goes here
      throw new Error("Not implemented");
    },
{{- end }}
  };
};
`))

	file, err := os.Create(fileName)
	if err != nil {
		fmt.Printf("Error creating file: %v\n", err)
		return
	}
	defer file.Close()

	err = tmpl.Execute(file, service)
	if err != nil {
		fmt.Printf("Error generating TypeScript file: %v\n", err)
		return
	}

	fmt.Printf("Generated TypeScript file: %s\n", fileName)
}