import { useState, type FocusEvent } from 'react';
import { useSelector } from 'react-redux';
import TaskPageDescription from '@/components/taskPageDescription/index';
import { updateTitle } from '@/api/taskApi';
import useLogTaskEvent from '@/hooks/useLogTaskEvent';
import MentionInput from '@/components/MentionsInput';
import { CustomMentionStyle } from '@/utils/mentionInputStyle';
import { transformingMentionInputs } from '@/utils/transformingMentionInputs';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import type { RootState } from '@/store';
import { EventType } from '@/interfaces/event.interfaces';
import type { OnChangeHandlerFunc } from 'react-mentions';

const TaskPageTitle = () => {
  const dispatch = useAppDispatch();

  const title = useSelector((state: RootState) => state.singleTask.data?.title);
  const taskId = useSelector((state: RootState) => state.singleTask.data?._id);

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [isFocused, setIsFocused] = useState(false);

  const { author, storeCommonFields, storeType, storeTaskValue, updateTaskValue } =
    useLogTaskEvent();

  const styles = {
    container: 'flex flex-col',
    title: 'mt-2 text-foreground text-xl text-bold bg-background rounded-lg focus:outline-none',
  };

  const listOfMembers = useSelector(
    (state: RootState) => state.listOfWorkspaceMembers.listOfWorkspaceMembers,
  );

  const { transformedInput: transformedTitleInput } = transformingMentionInputs(updatedTitle ?? '');

  const handleChange: OnChangeHandlerFunc = (e) => {
    setUpdatedTitle(e.target.value);
  };

  const logEvent = () => {
    storeType(EventType.TitleUpdated);
    if (taskId !== undefined) storeTaskValue(title ?? '');
    updateTaskValue(updatedTitle ?? '');
  };

  const handleSubmit = (e: FocusEvent<HTMLFormElement>) => {
    setIsFocused(false);
    e.preventDefault();
    const changeMade: boolean = updatedTitle !== title;
    if (changeMade && taskId !== undefined) {
      storeCommonFields(author, taskId);
      logEvent();
      dispatch(updateTitle(transformedTitleInput, taskId));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    e.preventDefault();
    const changeMade: boolean = updatedTitle !== title;
    if (changeMade && taskId !== undefined) {
      storeCommonFields(author, taskId);
      logEvent();
      dispatch(updateTitle(transformedTitleInput, taskId));
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <MentionInput
        data={listOfMembers}
        className={styles.title}
        value={updatedTitle ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        style={CustomMentionStyle(isFocused)}
        onFocus={() => setIsFocused(true)}
        placeholder={'Title'}
        name={'title'}
      />
      <TaskPageDescription />
    </form>
  );
};

export default TaskPageTitle;
