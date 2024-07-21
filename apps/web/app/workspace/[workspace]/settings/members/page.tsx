'use client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import SettingsTopNavBar from '@/components/SettingsTopNavBar';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { SearchIcon, threeDotOption, refreshIcon, copyLink } from '@/components/Svg';
import { getListOfUsers } from '@/store/userSettings/thunks';
import {
  joinWorkspace,
  getWorkspace,
  createWorkspaceLinkToken,
  enableUniversalLink,
} from '@/store/taskData/thunks';
import { toast } from 'react-toastify';
import type {
  ListOfUsersProps,
  SelectedMemberProps,
} from '@/app/workspace/[workspace]/settings/members/members.interfaces';
import InviteMembersModal from '@/components/InviteMembersModal';
import { RolesButtonOptions } from '@/components/RolesButtonOptions';
import UpdateMembersInfoModal from '@/components/UpdateMembersModal';
import PurpleToggle from '@/components/PurpleToggle';
import {
  deletingUserFromWorkspace,
  updateTheUsersRole,
  updateUsersInfo,
} from '@/utils/workspace-members-utils';
import { navBarToggle } from '@/store/userSettings';
const styles = {
  mainContainer: 'flex mdsm:flex-col relative bg-card h-auto min-h-screen xs:p-0 w-full',
  pageContainer:
    'flex flex-col h-full w-full items-center bg-background pt-20 md:items-center sm:items-start sm:px-4 xs:pt-10 xs:px-4 ',
  TopNavbar: 'lg:hidden mdsm:visible bg-background',
  navbarWrapper: 'relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out z-10',
  pageWrapper: ' sm:w-full  sm:p-0 xs:w-full xl:w-2/5 md:w-3/4 ',
  line: 'block w-full border-t border-border my-6',
  title: 'text-2xl text-foreground mb-1 font-medium',
  subtitle: 'text-muted-foreground text-sm',
  manageMemberTitle: 'text-lg text-foreground mb-1 font-medium ',
  inviteButtonLight:
    'bg-blueGlowLight py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer',
  inviteButtonDark:
    'bg-blueGlow py-2 px-3 rounded text-blue shadow-lg active:shadow-lg hover:shadow-glow border border-blueGlow cursor-pointer',
  goToPlan: 'text-[#575bc7] text-opacity-1 font-semibold',
  searchIconSVG: ' fill-white h-5 w-5',
  userInputsContainer:
    'flex gap-3 mt-6 items-center justify-between w-full sm:justify-between md:w-full lg:w-full',
  userInputSubContainer: 'relative gap-2 flex items-center md:w-2/3 lg:w-3/5 bg-textField rounded',
  searchInput:
    'border border-border bg-transparent text-sm py-1.5 w-full rounded-md w-full text-foreground placeholder:text-[#999] px-8 xs:py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400',
  searchIcon: 'absolute left-2 top-2.5',
  membersLengthTitle: 'mt-6 text-foreground text-sm',
  membersDescriptionContainer:
    'flex items-center border-border border-b pb-2 mt-4 md:text-sm justify-between xs:text-sm',
  membersInfo: 'flex flex-col w-2/4',
  membersNameOrRole: 'text-foreground',
  membersEmail: 'text-muted-foreground',
  buttonsOptionContainer:
    'flex flex-col -left-28 top-6 bg-background border border-border rounded gap-1 ',
  universalInviteLinkContainer: 'gap-4 flex justify-between items-center mdsm:w-full ',
  createLinkButton: 'hover:bg-[#999] hover:bg-opacity-20 p-1 mr-2 rounded w-[20px]',
  inviteLinkInput:
    'flex border border-border rounded w-full justify-between items-center bg-textField',
  inviteLinkText: 'text-foreground p-1.5 overflow-hidden text-ellipsis whitespace-nowrap  text-sm',
  bodyWrapper: 'flex justify-between',
  textPrimary: 'text-foreground',
  membersButtonWrapper: 'ml-auto relative',
};
export default function Members() {
  const [openInviteModal, setInviteOpenModal] = useState<boolean>(false);
  const [openUpdateMemberModal, setOpenUpdateMemberModal] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<SelectedMemberProps>({
    id: '',
    name: '',
    username: '',
  });
  const [search, setSearch] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [commandOptions, setCommandOptions] = useState<Record<string, boolean>>({});
  const [listOfUsers, setListOfUsers] = useState<ListOfUsersProps[]>([]);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const showNavBar = useAppSelector((state) => state.userSettings.showNavBar);
  const [isActive, setIsActive] = useState<boolean>(workspace.universalTokenLink.isEnabled);
  const currentUser = useAppSelector((state) => state.userSettings.user);
  const theme = useAppSelector((state) => state.userSettings.theme);

  const dispatch = useAppDispatch();

  const handleNavToggle = (): void => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };
  const handleButtonStyle = (): string =>
    theme === 'dark' ? styles.inviteButtonDark : styles.inviteButtonLight;
  const getMembersRole = (userId: string) => {
    const membersRole = workspace.users.find((member) => member.user === userId)?.role;
    if (membersRole) {
      return membersRole[0].toUpperCase() + membersRole?.slice(1);
    }
    return membersRole;
  };

  const getMembers = async () => {
    try {
      const members = await Promise.all(
        workspace?.users.map(async (member) => {
          const user = await getListOfUsers(member?.user);
          return {
            _id: user?._id,
            name: user?.name,
            role: member.role,
            username: user?.username,
            email: user?.email,
          };
        }),
      );
      setListOfUsers(members);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };
  const updateMembersInfo = (name: string, username: string, id: string) => async () => {
    try {
      const data = await updateUsersInfo(id, username, name);
      if (data?.success) {
        setListOfUsers((prev) => {
          return prev.map((user) => {
            if (user._id === id) {
              return { ...user, name: name, username: username };
            }
            return user;
          });
        });
        toast.success(data.message);
      }
      return data;
    } catch (err) {
      toast.error('Could not update username.');
    }
  };
  const updatingUsersRole = async (userId: string, role: string, workspace_Id: string) => {
    try {
      const data = await updateTheUsersRole(userId, workspace_Id, role);
      const listOfUserCopy = [...listOfUsers];
      if (data?.success) {
        setListOfUsers((users) => {
          return users.map((user) => {
            const updatedUserRole = data.updatedUserWorkspace.find(
              (u: { user: string }) => u.user === user._id,
            );
            return user._id === userId ? { ...user, role: updatedUserRole.role } : user;
          });
        });
        await dispatch(getWorkspace({ url: workspace?.url, id: workspace?._id }));
        handleCommandOptions(userId);
        toast.success('Users role updated successfully');
      } else {
        toast.error('Failed to update user role');
        setListOfUsers(listOfUserCopy);
      }
    } catch (err) {
      console.log('error on members page: ', err);
      if (axios.isAxiosError(err)) {
        const serverError = err?.response?.data;
        if (serverError) {
          toast.error(serverError);
        }
      }
    }
  };
  const createWorkspaceLink = async () => {
    try {
      await dispatch(createWorkspaceLinkToken(workspace._id));
      dispatch(getWorkspace({ url: workspace?.url, id: workspace?._id }));
    } catch (error) {
      console.error('Error in createworkspacelink: ', error);
    }
  };
  const deleteUserFromWorkspace = async (memberId: string) => {
    try {
      const data = await deletingUserFromWorkspace(memberId, workspace?._id);
      if (data?.success) {
        setListOfUsers((users) => {
          return users.filter((user) => user._id !== memberId);
        });
        await dispatch(getWorkspace({ url: workspace?.url, id: workspace?._id }));
        toast.success(data.success);
      } else {
        toast.error('Cannot delete member');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getRoleActions = (memberId: string, name?: string, username?: string) => {
    return {
      owner: [
        {
          text: 'Make Owner',
          action: () => updatingUsersRole(memberId, 'owner', workspace?._id),
        },
        {
          text: 'Make Admin',
          action: () => updatingUsersRole(memberId, 'admin', workspace?._id),
        },
        {
          text: 'Make Member',
          action: () => updatingUsersRole(memberId, 'member', workspace?._id),
        },
        {
          text: 'Remove User',
          action: () => deleteUserFromWorkspace(memberId),
        },
        {
          text: 'Update User',
          action: () => {
            setOpenUpdateMemberModal(true);
            handleCommandOptions(memberId);
            setSelectedMember((prev: SelectedMemberProps) => ({
              ...prev,
              id: memberId,
              name: name,
              username: username,
            }));
          },
        },
      ],
      admin: [
        {
          text: 'Remove Member',
          action: () => deleteUserFromWorkspace(memberId),
        },
        {
          text: 'Update User',
          action: () => {
            setOpenUpdateMemberModal(true);
            handleCommandOptions(memberId);
            setSelectedMember((prev: SelectedMemberProps) => ({
              ...prev,
              id: memberId,
              name: name,
              username: username,
            }));
          },
        },
      ],
      self: [
        {
          text: 'Update Profile',
          action: () => {
            setOpenUpdateMemberModal(true);
            handleCommandOptions(memberId);
            setSelectedMember((prev: SelectedMemberProps) => ({
              ...prev,
              id: memberId,
              name: name,
              username: username,
            }));
          },
        },
      ],
    };
  };

  const renderUserOptions = (memberId: string, name?: string, username?: string) => {
    const currentUserRole = getMembersRole(currentUser?._id)?.toLowerCase();
    const memberRole = getMembersRole(memberId)?.toLowerCase();
    let options: { text: string; action: () => void }[] = [];
    const roleActions = getRoleActions(memberId, name, username);
    if (currentUserRole === 'owner' && currentUser?._id !== memberId) {
      options = roleActions.owner;
    } else if (currentUserRole === 'owner' && currentUser?._id === memberId) {
      options = roleActions.self;
    } else if (currentUserRole === 'admin' && memberRole !== 'owner') {
      options = roleActions.admin;
    } else if (currentUser?._id === memberId) {
      options = roleActions.self;
    }
    return options.map((option, i) => (
      <RolesButtonOptions key={`${i}${option.text}`} text={option.text} action={option.action} />
    ));
  };

  const invitingUserToWorkspace = async () => {
    try {
      const data = await dispatch(joinWorkspace({ id: workspace._id, email: email }));
      console.log(data);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error?.response?.data;
        if (serverError) {
          toast.error(serverError);
        } else {
          toast.error('Something with wrong');
        }
      }
    }
  };

  const currentUserRole =
    getMembersRole(currentUser._id) === 'Admin' || getMembersRole(currentUser._id) === 'Owner';

  const handleCommandOptions = (memberId: string) => {
    setCommandOptions((prevState: Record<string, boolean>) => {
      const newState: Record<string, boolean> = {};
      for (const key in prevState) {
        newState[key] = false;
      }
      newState[memberId] = !prevState[memberId];
      return newState;
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    invitingUserToWorkspace();
    setEmail('');
    setInviteOpenModal(false);
  };

  const handleUpdateSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    name: string,
    username: string,
    id: string,
  ): Promise<void> => {
    e.preventDefault();
    await dispatch(updateMembersInfo(name, username, id));
    setOpenUpdateMemberModal(false);
  };
  useEffect(() => {
    setIsActive(workspace.universalTokenLink.isEnabled);
  }, []);
  const handleToggleLink = async () => {
    setIsActive((prev) => !prev);
  };

  const enablingUniversalLink = async () => {
    try {
      await dispatch(
        enableUniversalLink({
          isEnabled: isActive ?? true,
          workspaceId: workspace?._id,
        }),
      );
      dispatch(getWorkspace({ url: workspace.url, id: workspace._id }));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMembers();
    enablingUniversalLink();
  }, [isActive]);
  const workspaceLink = `${process.env.NEXT_PUBLIC_URL}/workspace/${workspace?.url}/accept/${workspace?.universalTokenLink.token}`;

  const filteredMembers = listOfUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className={styles.mainContainer}>
      <div className={styles.TopNavbar}>
        <SettingsTopNavBar setShowNavBar={handleNavToggle} />
      </div>
      <div
        ref={navbarRef}
        className={`${styles.navbarWrapper} ${showNavBar ? 'mdsm:-left-0' : 'mdsm:-left-[500px]'}`}
      >
        {/* <SettingsNavBar setLoading={console.log} /> */}
      </div>

      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <p className={styles.title}>Members</p>

          <p className={styles.subtitle}>Manage who has access to this workspace</p>
          <span className={styles.line} />

          <div className={`${currentUserRole ? 'flex' : 'hidden '} flex-col gap-1`}>
            <div className={styles.bodyWrapper}>
              <p className={styles.textPrimary}>Invite Link</p>
              <PurpleToggle active={isActive} handleClick={handleToggleLink} />
            </div>
            {isActive ? (
              <>
                <p className="text-muted-foreground">
                  Share this link with others you&apos;d like to join your workspace.
                </p>
                <div className={styles.universalInviteLinkContainer}>
                  <div className={styles.inviteLinkInput}>
                    <p className={styles.inviteLinkText}>{workspaceLink}</p>
                    <button
                      type="button"
                      onClick={createWorkspaceLink}
                      className={styles.createLinkButton}
                    >
                      {refreshIcon()}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(workspaceLink)}
                    className={`${handleButtonStyle()} flex items-center gap-1 font-semibold`}
                  >
                    {copyLink(theme)}Copy
                  </button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                Invite links provided a unique URL that allows anyone to join your workspace.
              </p>
            )}
            <span className={styles.line} />
          </div>

          <div>
            <p className={styles.manageMemberTitle}>Manage members</p>
            <p className={styles.subtitle}>
              On the Free plan all members in a workspace are administrators. Upgrade to the
              standard plan to add the ability to assign or remove administrator roles.{' '}
              <a href="www.example.com" className={styles.goToPlan}>
                Go to Plans!
              </a>
            </p>
          </div>
          <div className={styles.userInputsContainer}>
            <div className={styles.userInputSubContainer}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search by name/email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className={styles.searchIcon}>{SearchIcon()}</span>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setInviteOpenModal(true)}
                className={handleButtonStyle()}
              >
                Invite
              </button>
            </div>
          </div>
          <p className={styles.membersLengthTitle}>{workspace?.users.length} members</p>
          {filteredMembers?.map(({ _id, name, email, username }: ListOfUsersProps) => (
            <div key={name} className={styles.membersDescriptionContainer}>
              <div className={styles.membersInfo}>
                <p className={styles.membersNameOrRole}>{name}</p>
                <p className={styles.membersEmail}>{email}</p>
              </div>
              <span className={styles.membersNameOrRole}>{getMembersRole(_id)}</span>
              <div className={styles.membersButtonWrapper}>
                <button
                  type="button"
                  onClick={() => handleCommandOptions(_id)}
                  className={`${
                    commandOptions[_id] ? 'focus:bg-[#333]' : ''
                  }  block px-1 py-0.5 rounded`}
                >
                  {threeDotOption()}
                </button>
                <div
                  className={`${
                    commandOptions[_id] ? 'absolute ' : 'hidden'
                  } ${styles.buttonsOptionContainer}`}
                >
                  {renderUserOptions(_id, name, username)}
                </div>
              </div>
              {/* Modal to update member's info info */}
              {openUpdateMemberModal && (
                <UpdateMembersInfoModal
                  handleSubmit={handleUpdateSubmit}
                  setOpenUserUpdateModal={setOpenUpdateMemberModal}
                  memberDetails={selectedMember}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Modal to invite users */}
      {openInviteModal && (
        <InviteMembersModal
          setEmail={setEmail}
          handleSubmit={handleSubmit}
          setOpenModal={setInviteOpenModal}
        />
      )}
    </div>
  );
}
