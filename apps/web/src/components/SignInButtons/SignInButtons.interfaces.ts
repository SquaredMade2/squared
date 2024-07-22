export interface SignInButtonProps {
  handleLogInOptions: (provider: string) => void;
  btnStyle: string;
  logo: React.ReactNode;
  provider: string;
}
