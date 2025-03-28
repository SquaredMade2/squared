package github

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
)

type OrgInstallationInfo struct {
	OrgID          string
	OrgName        string
	OrgDescription string
}

func handleInstallEvent(githubService *rpc.GithubService, r *http.Request, w http.ResponseWriter) {
	installationIDStr := r.URL.Query().Get("installation_id")
	workspaceId := r.URL.Query().Get("state")
	if installationIDStr == "" {
		log.Println("installation_id not found in request")
		return
	}

	installationID, err := strconv.ParseInt(installationIDStr, 10, 64)
	if err != nil {
		log.Printf("invalid installation_id: %v", err)
		return
	}

	org, err := GetOrgInstallationInfo(installationID)
	if err != nil {
		log.Printf("failed to get organization installation info: %v", err)
		return
	}

	request := rpc.UploadOrgRequest{
		Id:          org.OrgID,
		Name:        org.OrgName,
		Description: org.OrgDescription,
		WorkspaceId: workspaceId,
	}

	result, err := githubService.UploadOrg(context.TODO(), request)
	if err != nil {
		log.Printf("Error uploading organization: %v", err)
		http.Error(w, "Error uploading organization", http.StatusInternalServerError)
		return
	}
	orgSlug := result.Slug
	log.Printf("Organization Info: %+v", org)
	http.Redirect(w, r, fmt.Sprintf("%s/%s/settings/integrations/github", os.Getenv("APP_URL"), orgSlug), http.StatusFound)

}

func GetOrgInstallationInfo(installationId int64) (*OrgInstallationInfo, error) {
	client, err := createGitHubClient(installationId)
	if err != nil {
		return nil, fmt.Errorf("failed to create GitHub client: %w", err)
	}

	ctx := context.Background()
	installation, _, err := client.Apps.GetInstallation(ctx, installationId)
	if err != nil {
		return nil, fmt.Errorf("failed to get installation: %w", err)
	}

	// Check if the installation is for an organization
	if installation.GetAccount().GetType() != "Organization" {
		return nil, fmt.Errorf("installation is not for an organization")
	}

	orgName := installation.GetAccount().GetLogin()

	// Fetch additional organization details
	org, _, err := client.Organizations.Get(ctx, orgName)
	if err != nil {
		return nil, fmt.Errorf("failed to get organization details: %w", err)
	}

	return &OrgInstallationInfo{
		OrgID:          org.GetNodeID(),
		OrgName:        org.GetName(),
		OrgDescription: org.GetDescription(),
	}, nil
}
