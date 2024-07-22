import React from 'react';
import type { SignInButtonProps } from './SignInButtons.interfaces';

function SignInButtons({ handleLogInOptions, logo, btnStyle, provider }: SignInButtonProps) {
  return (
    <button type="button" onClick={() => handleLogInOptions(provider)} className={`${btnStyle}`}>
      <div className="flex items-center gap-2">
        <span>{logo}</span>
        <span>Sign in with {provider}</span>
      </div>
    </button>
  );
}

export default SignInButtons;
