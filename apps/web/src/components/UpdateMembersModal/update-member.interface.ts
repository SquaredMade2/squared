export type MemberDetails = {
  id: string;
  name?: string;
  username?: string;
};

export interface UpdateMemberProps {
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    name: string,
    username: string,
    id: string,
  ) => Promise<void>;
  setOpenUserUpdateModal: (isOpen: boolean) => void;
  memberDetails: MemberDetails;
}
