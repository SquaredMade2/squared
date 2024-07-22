import { authorizeGithubRedirect } from '@/store/userSettings/thunks';
import React from 'react';

export const GithubAuthButton = () => {
  // This component is for authing github if you signed into Squared from something other than github
  const handleGithubRedirect: () => void = () => {
    authorizeGithubRedirect();
  };
  return <button onClick={handleGithubRedirect} type="button" />;
};
