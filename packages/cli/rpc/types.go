package rpc

type MethodInfo struct {
	MethodName     string    `json:"methodName"`
	ParamNames     []string  `json:"paramNames"`
	MethodTimeout  int       `json:"methodTimeout"`
	Help           string    `json:"help"`
	RequestSchema  ZodSchema `json:"requestSchema"`
	ResponseSchema ZodSchema `json:"responseSchema"`
	InputType      string    // Generated TypeScript type
	OutputType     string    // Generated TypeScript type
}

type Service struct {
	Name       string `json:"serviceName"`
	MultiArg   bool   `json:"multiArg"`
	Help       string `json:"help"`
	URL        string
	Interfaces []MethodInfo `json:"interfaces"`
}

type ZodSchema struct {
	Type       string               `json:"type"`
	Properties map[string]ZodSchema `json:"properties,omitempty"`
	Items      *ZodSchema           `json:"items,omitempty"`
	Values     []interface{}        `json:"values,omitempty"`
	Options    []ZodSchema          `json:"options,omitempty"`
	Value      interface{}          `json:"value,omitempty"`
	Inner      *ZodSchema           `json:"inner,omitempty"`
}
