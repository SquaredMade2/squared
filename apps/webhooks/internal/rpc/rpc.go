package rpc

type Services struct {
	GithubService *GithubService
}

func NewServices(baseURL string) *Services {
	return &Services{
		GithubService: NewGithubService(baseURL),
	}
}
