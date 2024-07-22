import { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllTasks, createNewTask, incrementCreatedIssues } from '@/store/taskData/thunks';
import { setShowNewIssue } from '@/store/showNewIssue';
import { setResumeNewIssue } from '@/store/resumeNewIssue';
import { setStatus, setLabels, setPriority, setDueDate, setEffortEstimate } from '@/store/taskData';
import CreateNewIssueButton from '@/components/CreateNewIssueButton';
import DesignationsContainer from '@/components/DesignationsContainer';
import NewIssueTopRow from '@/components/NewIssueTopRow';
import { transformingMentionInputs } from '@/utils/transformingMentionInputs';
import MentionInput from '@/components/MentionsInput';
import { getListOfUsers } from '@/store/userSettings/thunks';
import '@/components/NewIssueModal/NewIssueModal.style.css';
import { type WorkspaceMember, getListOfMembers } from '@/store/workspaceMembers';
import { SocketContext } from '@/app/SocketProvider';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import type { Task } from '@/store/taskData/taskData.interfaces';
import type { OnChangeHandlerFunc } from 'react-mentions';

const styles = {
  wrapper:
    'fixed z-10 top-0 left-0 flex items-start justify-center w-screen h-[703.2px] px-3 py-[13vh] ',
  container:
    'relative flex flex-col w-[748.4px] border border-border bg-popover rounded-lg shadow-[#00000080] shadow-[0px_16px_70px] text-nav',
  form: '',
  textContainer: 'mx-6',
  title:
    'w-full leading-6 min-h-min h-full py-4 text-xl mt-2 bg-transparent rounded-lg mb-1 focus:outline-none resize-none',
  description: ' w-full h-full text-base bg-transparent focus:outline-none resize-none mb-1',
  bottomBorder: ' mx-4 mt-1 h-[10px] border-b-2 border-border',
  createIssueButton: 'h-full flex items-center justify-end',
};

const NewIssueModal = () => {
  const dispatch = useAppDispatch();
  const showNewIssue = useSelector((state: RootState) => state.showNewIssue.isOpen);
  const authorId = useSelector((state: RootState) => state.userSettings.user._id);

  const { currentTeam, status, priority, labels, dueDate, effortEstimate, currentWorkspace } =
    useSelector((state: RootState) => state.taskData);
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [listOfUsers, SetListOfUsers] = useState<WorkspaceMember[]>([]);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const socket = useContext(SocketContext);
  const user = useSelector((state: RootState) => state.userSettings.user);
  const getListOfWorkspaceMembers = async () => {
    try {
      const members = (await Promise.all(
        currentWorkspace.users.map(async (member) => {
          const user = await getListOfUsers(member?.user);
          return {
            display: user?.name,
            id: user?._id.toString(),
            email: user?.email,
          } as {
            display: string;
            id: string;
            email: string;
          };
        }),
      )) as unknown as WorkspaceMember[];
      dispatch(getListOfMembers(members));
      SetListOfUsers(members);
    } catch (error) {}
  };
  useEffect(() => {
    getListOfWorkspaceMembers();
  }, []);

  const handleTitleChange: OnChangeHandlerFunc = (e) => {
    setTitleInput(e.target.value);
  };
  const handleDescriptionChange: OnChangeHandlerFunc = (e) => {
    setDescriptionInput(e.target.value);
  };

  const handleCloseClick = () => {
    if (
      titleInput ||
      descriptionInput ||
      priority ||
      labels.length > 0 ||
      dueDate ||
      effortEstimate
    ) {
      setShowCloseModal(true);
    } else {
      dispatch(setShowNewIssue(false));
    }
  };

  const handleCancelClose = () => {
    setShowCloseModal(false);
  };

  const handleDiscard = () => {
    setShowCloseModal(false);
    dispatch(setShowNewIssue(false));
    dispatch(setResumeNewIssue(false));
    dispatch(setStatus('Todo'));
    dispatch(setPriority(''));
    dispatch(setLabels([]));
    dispatch(setDueDate(null));
    dispatch(setEffortEstimate(null));
  };

  const handleClickAway = (titleInput: string, descriptionInput: string) => {
    if (
      !titleInput &&
      !descriptionInput &&
      !priority &&
      labels.length === 0 &&
      !dueDate &&
      !effortEstimate
    ) {
      dispatch(setShowNewIssue(false));
      dispatch(setResumeNewIssue(false));
    } else {
      dispatch(setResumeNewIssue(true));
      dispatch(setShowNewIssue(false));
    }
  };

  const handleCreateIssue = async () => {
    if (titleInput.replace(/\s+/g, '').length === 0) {
      toast.warn('Please Enter a Title!', {
        autoClose: 2500,
      });
      return;
    }
    dispatch(incrementCreatedIssues(currentWorkspace._id));
    try {
      const { transformedInput: transformedTitle, userIds: titleUserId } =
        transformingMentionInputs(titleInput);
      const { transformedInput: transformedDescriptionInput, userIds: descriptionUserId } =
        transformingMentionInputs(descriptionInput);
      const mentionedUserId = new Set([...descriptionUserId, ...titleUserId]);
      const newTask: Task = {
        authorId: authorId,
        title: transformedTitle,
        description: transformedDescriptionInput,
        identifier: `${currentTeam.identifier}-${currentWorkspace.issuesCreated}`,
        status: status,
        priority: priority,
        labels: labels,
        dueDate: dueDate,
        effortEstimate: effortEstimate,
        team: currentTeam,
        dateCreated: new Date(),
        assignee: null,
        taskName: titleInput,
        _id: '',
      };
      const taskCreatedResponse = await dispatch(createNewTask(newTask as Task)).unwrap();

      dispatch(setResumeNewIssue(false));

      socket.emit('user_mentioned', [...mentionedUserId], taskCreatedResponse._id, user._id);
      dispatch(getAllTasks(currentTeam));
      dispatch(setShowNewIssue(false));
      setTitleInput('');
      setDescriptionInput('');
      dispatch(setStatus('Todo'));
      dispatch(setPriority(''));
      dispatch(setLabels([]));
      dispatch(setDueDate(null));
      dispatch(setEffortEstimate(null));
    } catch (err) {}
  };

  // const resetDefaultStates = () => {
  // 	setTitleInput('');
  // 	setDescriptionInput('');
  // 	dispatch(setStatus('Todo'));
  // 	dispatch(setPriority(''));
  // 	dispatch(setLabels([]));
  // };
  return (
    <>
      <AnimatePresence>
        {showNewIssue && (
          <div className={styles.wrapper}>
            <ClickAwayListener onClickAway={() => handleClickAway(titleInput, descriptionInput)}>
              <motion.div
                className={styles.container}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <NewIssueTopRow
                  showCloseModal={showCloseModal}
                  handleCloseClick={handleCloseClick}
                  handleCancelClose={handleCancelClose}
                  handleDiscard={handleDiscard}
                />
                <form className={styles.form}>
                  <div className={styles.textContainer}>
                    <MentionInput
                      data={listOfUsers}
                      value={titleInput}
                      placeholder={'Issue title...'}
                      className={`${styles.title} `}
                      name={'issueTitle'}
                      onChange={handleTitleChange}
                    />
                    <div className={styles.description} />
                    <MentionInput
                      data={listOfUsers}
                      value={descriptionInput}
                      placeholder={'Add description...'}
                      className={`${styles.description} py-4`}
                      name={'addDescription'}
                      onChange={handleDescriptionChange}
                    />
                  </div>
                </form>
                <div>
                  <div className="mx-5">
                    <DesignationsContainer location={'newIssue'} />
                  </div>
                  <div className={styles.bottomBorder} />
                  <div className={styles.createIssueButton}>
                    <CreateNewIssueButton handleCreateIssue={handleCreateIssue} />
                  </div>
                </div>
              </motion.div>
            </ClickAwayListener>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewIssueModal;
