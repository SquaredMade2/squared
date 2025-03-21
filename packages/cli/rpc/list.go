package rpc

import (
	"fmt"

	"github.com/spf13/cobra"
)

func ListServices(cmd *cobra.Command, args []string) {
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
				fmt.Printf("    - %s\n", iface.MethodName)
			}
		}
		fmt.Println()
	}
}
