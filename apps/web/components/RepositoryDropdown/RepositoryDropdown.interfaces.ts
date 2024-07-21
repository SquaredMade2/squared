import type { GithubUser } from '@/store/userSettings/userSettings.interfaces';
import type { Dispatch, SetStateAction } from 'react';

export interface RepositoryDropdownProps {
  githubUser: GithubUser;
  selectedRepo: string;
  setSelectedRepo: Dispatch<SetStateAction<string>>;
}
