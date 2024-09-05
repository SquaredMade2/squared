export type UserSettingsState = {
	showNavBar: boolean;
};

export type UserSettingsActions = {
	navBarToggle: () => void;
};

export type UserSettingsStore = UserSettingsState & UserSettingsActions;
