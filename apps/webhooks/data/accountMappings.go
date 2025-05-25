package data

// AccountMappings contains mappings between different account types for users
type UserAccounts struct {
	Name    string
	GitHub  string
	Discord string
}

// AccountMappings is a map of user identifiers to their various accounts
// Key can be any consistent identifier (name, email, employee ID, etc.)
var AccountMappings = map[string]UserAccounts{
	"benjamin": {
		Name:    "Benjamin Bruington",
		GitHub:  "BBruington",
		Discord: "255762796162187264",
	},
	"bret": {
		Name:    "Bret Miller",
		GitHub:  "bret-miller2010",
		Discord: "317823605218213898",
	},
	"chase": {
		Name:    "Chase White",
		GitHub:  "Chase-T-White",
		Discord: "414567565843759105",
	},
	"duncan": {
		Name:    "Duncan Whyte",
		GitHub:  "duncanwhyte",
		Discord: "223870029660160001",
	},
	"jacob": {
		Name:    "Jacob",
		GitHub:  "THEjacob1000",
		Discord: "152861183026790402",
	},
	"kaila": {
		Name:    "Kaila Bullard",
		GitHub:  "napqueenkaila",
		Discord: "1074750793128882247",
	},
	"li": {
		Name:    "Li",
		GitHub:  "OuAlcladii",
		Discord: "658611325403922443",
	},
	"mioara": {
		Name:    "Mioara Cenusa",
		GitHub:  "Mioara82",
		Discord: "1063780250611355669",
	},
	"serhii": {
		Name:    "Serhii Derkach",
		GitHub:  "SerhiiDer",
		Discord: "791023762124308500",
	},
	"theo": {
		Name:    "Theo Cocco",
		GitHub:  "tcocco20",
		Discord: "162447718483099648",
	},
	"velina": {
		Name:    "Velina Kennedy",
		GitHub:  "velinakennedy",
		Discord: "669209137376264221",
	},
}

// Helper functions for lookups

// GetAccountsByDiscord returns user accounts for a given Discord ID
func GetAccountsByDiscord(discord string) (*UserAccounts, bool) {
	for _, accounts := range AccountMappings {
		if accounts.Discord == discord {
			return &accounts, true
		}
	}
	return nil, false
}

// GetAccountsByGitHub returns user accounts for a given GitHub username
func GetAccountsByGitHub(github string) (*UserAccounts, bool) {
	for _, accounts := range AccountMappings {
		if accounts.GitHub == github {
			return &accounts, true
		}
	}
	return nil, false
}

// GetAccountsByName returns user accounts for a given name
func GetAccountsByName(name string) (*UserAccounts, bool) {
	for _, accounts := range AccountMappings {
		if accounts.Name == name {
			return &accounts, true
		}
	}
	return nil, false
}

// GetDiscordByGitHub returns the Discord ID for a given GitHub username
func GetDiscordByGitHub(github string) (string, bool) {
	if accounts, exists := GetAccountsByGitHub(github); exists {
		return accounts.Discord, true
	}
	return "", false
}

// GetGitHubByDiscord returns the GitHub username for a given Discord ID
func GetGitHubByDiscord(discord string) (string, bool) {
	if accounts, exists := GetAccountsByDiscord(discord); exists {
		return accounts.GitHub, true
	}
	return "", false
}
