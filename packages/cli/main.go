package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func main() {
	var rootCmd = &cobra.Command{
		Use:   "squared",
		Short: "Squared CLI for managing RPC services",
		Long:  `A CLI tool for installing and managing RPC services in your Squared environment.`,
	}

	rootCmd.AddCommand(rpcCmd)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

var rpcCmd = &cobra.Command{
	Use:   "rpc",
	Short: "Manage RPC services",
	Long:  `Install and list RPC services in your Squared environment.`,
}

func init() {
	rpcCmd.AddCommand(installCmd)
	rpcCmd.AddCommand(listCmd)
}

var installCmd = &cobra.Command{
	Use:   "install [service_url]",
	Short: "Install a service by URL",
	Long:  `Install an RPC service in your Squared environment using the provided URL.`,
	Args:  cobra.ExactArgs(1),
	Run:   installService,
}

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all available services",
	Long:  `List all RPC services available in your Squared environment.`,
	Run:   listServices,
}