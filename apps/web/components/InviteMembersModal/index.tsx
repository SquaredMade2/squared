import React from 'react';
import WorkspaceInitials from '@/components/WorkspaceImage';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { smallDeleteIcon } from '@/components/Svg';
import type { MembersModalProp } from '@/components/InviteMembersModal/members-modal.interace';
import type { Workspace } from '@/store/taskData/taskData.interfaces';
const styles = {
  projectText: 'text-sm',
  headerText: 'text-sm font-semibold',
  inviteButton: 'bg-purpleButtonHover hover:bg-purpleButton py-1 px-2 rounded text-white ',
  container:
    'fixed z-10 top-0 left-26 flex items-start justify-center w-screen h-[703.2px]  px-2 py-[30vh]',
  subcontainer:
    'relative flex flex-col w-[508.4px] border border-border bg-popover rounded-lg shadow-[#00000080] shadow-[0px_16px_70px] text-nav ',
  headerContainer: 'border-b border-border pb-2 px-8 py-4 flex items-center',
  form: 'flex flex-col px-8 py-4 gap-2',
  input: 'px-2 py-4 bg-transparent border-border border',
};

const InviteMembersModal = ({ handleSubmit, setEmail, setOpenModal }: MembersModalProp) => {
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
  const index = allWorkspaces.findIndex((item: Workspace) => item._id === workspace._id);
  return (
    <div className={styles.container}>
      <div className={styles.subcontainer}>
        <div className={styles.headerContainer}>
          <span className={styles.projectText}>
            <WorkspaceInitials
              workspaceName={workspace.name}
              backgroundColor={index}
              location="workspaceMenu"
            />
          </span>
          <span className={styles.headerText}>Invite to your workspace</span>
          <span onClick={() => setOpenModal(false)} className="text-[#DCD8FE93] ml-auto">
            {smallDeleteIcon()}
          </span>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="invite-user-email">Email</label>
          <input
            id="invite-user-email"
            className={styles.input}
            type="text"
            placeholder="email@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" className={styles.inviteButton}>
            Send invites
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteMembersModal;
