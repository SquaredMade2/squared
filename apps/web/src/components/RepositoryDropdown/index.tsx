import axios from 'axios';
import type React from 'react';
import { useEffect, useState } from 'react';
import type { Repository } from '@/app/interfaces/Github.interfaces';
import type { RepositoryDropdownProps } from './RepositoryDropdown.interfaces';

const RepositoryDropdown = ({
  githubUser,
  selectedRepo,
  setSelectedRepo,
}: RepositoryDropdownProps) => {
  const [repositories, setRepositories] = useState<Repository[] | []>([]);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    const getGithubRepos: () => Promise<void> = async () => {
      try {
        const response = await axios.get(
          `${githubUser.repos_url}?per_page=${githubUser.public_repos}`,
        );
        setRepositories(response.data);
      } catch (error) {}
    };
    getGithubRepos();
  }, []);

  const handleToggle: (toggle: boolean) => void = (toggle) => {
    setTimeout(() => {
      setToggleDropdown(toggle);
    }, 200);
  };

  const displayedRepositories: () => React.JSX.Element[] = () => {
    return repositories
      .filter((each) => each.name.includes(selectedRepo))
      .map((repo) => {
        return (
          <button
            type="button"
            className={styles.repo}
            key={repo.id}
            onClick={() => setSelectedRepo(repo.name)}
          >
            {repo.name}
          </button>
        );
      });
  };

  const styles = {
    dropdownButton:
      'flex flex-row items-center bg-textField text-foreground w-80 h-12 px-2 rounded-lg',
    dropdown: `absolute flex flex-col w-80 max-h-60 py-2 items-center rounded-b-lg ${
      toggleDropdown === true ? '' : 'hidden'
    } bg-textField text-foreground overflow-auto`,
    repo: 'hover:bg-accent p-2 px-4 rounded-md',
  };

  return (
    <div>
      <input
        type="text"
        value={selectedRepo}
        onChange={(e) => setSelectedRepo(e.target.value)}
        onBlur={() => handleToggle(false)}
        onFocus={() => handleToggle(true)}
        className={styles.dropdownButton}
      />

      <div className={styles.dropdown}>{repositories.length > 0 && displayedRepositories()}</div>
    </div>
  );
};

export default RepositoryDropdown;
