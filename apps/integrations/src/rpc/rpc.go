package rpc

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"sync"
	"time"
)

type RpcError struct {
	ServiceName string `json:"serviceName"`
	MethodName  string `json:"methodName"`
	Message     string `json:"message"`
	Code        string `json:"code,omitempty"`
}

func (e *RpcError) Error() string {
	return e.Message
}

type MethodDetails struct {
	MethodName     string      `json:"methodName"`
	MethodTimeout  int         `json:"methodTimeout"`
	ParamNames     []string    `json:"paramNames"`
	RequestSchema  interface{} `json:"requestSchema"`
	ResponseSchema interface{} `json:"responseSchema"`
}

type ServiceDetails struct {
	ServiceName string          `json:"serviceName"`
	MultiArg    bool            `json:"multiArg"`
	Help        string          `json:"help"`
	Interfaces  []MethodDetails `json:"interfaces"`
}

type Service struct {
	Meta           ServiceDetails
	Implementation map[string]func(context.Context, json.RawMessage) (interface{}, error)
}

type ServiceSet struct {
	Services []Service
}

var requestContexts sync.Map

func createRequestHandler(serviceSet ServiceSet) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(pathParts) != 2 {
			http.Error(w, "Invalid path", http.StatusBadRequest)
			return
		}
		serviceName, methodName := pathParts[0], pathParts[1]

		for _, service := range serviceSet.Services {
			if service.Meta.ServiceName == serviceName {
				for _, method := range service.Meta.Interfaces {
					if method.MethodName == methodName {
						ctx, cancel := context.WithTimeout(context.Background(), time.Duration(method.MethodTimeout)*time.Millisecond)
						defer cancel()

						var request json.RawMessage
						if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
							http.Error(w, "Invalid request", http.StatusBadRequest)
							return
						}

						response, err := service.Implementation[methodName](ctx, request)
						if err != nil {
							rpcErr := RpcError{ServiceName: serviceName, MethodName: methodName, Message: err.Error(), Code: "internal_error"}
							w.WriteHeader(http.StatusInternalServerError)
							json.NewEncoder(w).Encode(rpcErr)
							return
						}

						w.Header().Set("Content-Type", "application/json")
						json.NewEncoder(w).Encode(response)
						return
					}
				}
			}
		}
		http.Error(w, "Method Not Found", http.StatusNotFound)
	}
}

type ErrorHandler struct{}

func (e *ErrorHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var rpcErr RpcError
	if err := json.NewDecoder(r.Body).Decode(&rpcErr); err != nil {
		http.Error(w, "Invalid Error Response", http.StatusBadRequest)
		return
	}

	if rpcErr.Code != "" {
		w.WriteHeader(http.StatusBadRequest)
	} else {
		w.WriteHeader(http.StatusInternalServerError)
	}
	json.NewEncoder(w).Encode(rpcErr)
}
