import type { GithubUser } from '@/store/userSettings/userSettings.interfaces';

export interface GithubIfAuthedDisplaySettingsProps {
  githubUser: GithubUser | null;
}
