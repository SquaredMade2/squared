package rpc

import (
	"encoding/json"
	"os"
	"path/filepath"
)

func loadServices() ([]Service, error) {
	configPath := filepath.Join(os.Getenv("HOME"), ".squared", "services.json")
	data, err := os.ReadFile(configPath)
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
