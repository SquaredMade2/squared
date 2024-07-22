import { useSelector } from 'react-redux';
import { useState, useContext } from 'react';
import axios from 'axios';
import { getSingleTask } from '@/store/task/thunks';
import useLogTaskEvent from '@/hooks/useLogTaskEvent';
import MentionInput from '@/components/MentionsInput';
import { CustomMentionStyle } from '@/utils/mentionInputStyle';
import { transformingMentionInputs } from '@/utils/transformingMentionInputs';
import { SocketContext } from '@/app/SocketProvider';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { EventType } from '@/interfaces/event.interfaces';
import type { OnChangeHandlerFunc } from 'react-mentions';

const TaskPageDescription = () => {
  const dispatch = useAppDispatch();
  const description = useSelector((state: RootState) => state.singleTask.data?.description);
  const taskId = useSelector((state: RootState) => state.singleTask.data?._id);
  const socket = useContext(SocketContext);

  const [updatedDescription, setUpdatedDescription] = useState(description);

  const { author, storeCommonFields, storeType, storeTaskValue, updateTaskValue } =
    useLogTaskEvent();
  const [isFocused, setIsFocused] = useState(false);

  const styles = {
    description:
      'resize-none mt-2 mb-2 text-foreground bg-card rounded-lg border border-transparent ',
  };

  const listOfMembers = useSelector(
    (state: RootState) => state.listOfWorkspaceMembers.listOfWorkspaceMembers,
  );
  const user = useSelector((state: RootState) => state.userSettings.user);
  const handleChange: OnChangeHandlerFunc = (e) => {
    setUpdatedDescription(e.target.value);
  };

  const { transformedInput: transformedDescriptionInput } = transformingMentionInputs(
    updatedDescription ?? '',
  );

  const updateDescription = async () => {
    if (taskId !== undefined) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`, {
          description: transformedDescriptionInput,
        });
        const updatedTaskDescription = await dispatch(getSingleTask(taskId)).unwrap();
        const { userIds: userId } = transformingMentionInputs(updatedDescription ?? '');
        const mentionedUserIds = new Set([...userId]);
        socket.emit('user_mentioned', [...mentionedUserIds], updatedTaskDescription._id, user._id);
      } catch (err) {}
    }
  };

  const logEvent = () => {
    storeType(EventType.DescriptionUpdated);
    storeTaskValue(description ?? '');
    updateTaskValue(updatedDescription ?? '');
  };

  const handleBlur = () => {
    const changeMade = updatedDescription !== description;
    if (changeMade && taskId !== undefined) {
      storeCommonFields(author, taskId);
      logEvent();
      updateDescription();
    }
    setIsFocused(false);
  };

  return (
    <MentionInput
      data={listOfMembers}
      onChange={handleChange}
      className={styles.description}
      placeholder={'Add description...'}
      value={transformedDescriptionInput}
      name={'editDescription'}
      onBlur={handleBlur}
      style={CustomMentionStyle(isFocused)}
      onFocus={() => setIsFocused(true)}
    />
  );
};

export default TaskPageDescription;
