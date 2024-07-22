export interface MembersModalProp {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setEmail: (email: string) => void;
  setOpenModal: (isOpen: boolean) => void;
}
