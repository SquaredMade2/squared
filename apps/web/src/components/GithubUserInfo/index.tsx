import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import Image from 'next/image';

const styles = {
  ghUserImage: 'w-10 h-10',
  username: 'text-xl text-foreground mx-3 font-medium',
  userExists: 'flex flex-row items-center w-full',
};

const GithubUserInfo = () => {
  const githubUser = useAppSelector((state) => state.userSettings.githubUser);
  if (githubUser) {
    return (
      <div className={styles.userExists}>
        {/* Preferable to use standard html img than nextjs Image because it only allows for px measurements. */}
        <Image
          alt="Github User Avatar"
          className={styles.ghUserImage}
          src={githubUser.avatar_url}
        />
        <header className={styles.username}>{githubUser.login}</header>
      </div>
    );
  }
};

export default GithubUserInfo;
