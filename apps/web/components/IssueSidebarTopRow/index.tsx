import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { replaceSpacesWithDashes } from '@/utils/formatting';
import CopyTaskUrl from '../CopyTaskUrl';
import CopyTaskId from '../CopyTaskId';
import CopyGitBranchName from '../CopyGitBranchName';
const style = {
  row: 'bg-popover h-10 text-muted-foreground  rounded-lg min-w-[300px] ',
  rowWrapper: 'w-full px-5 h-full relative flex items-center justify-between',
  buttons: 'flex h-full items-center',
  issueId: 'text-muted-foreground text-sm font-semibold w-24 pr-2',
  copiedAlertBox:
    'absolute left-0 top-[85vh] bg-popover w-full p-2 rounded border border-border transition-all delay-100 duration-1000',

  relative: 'relative',
  urlClipboard: 'text-muted-foreground text-xs font-bold leading-6',
  paste: 'text-muted-foreground text-xs font-bold',
  titleClipboard: 'text-muted-foreground text-xs font-bold ',
};

const IssueSidebarTopRow = () => {
  const task = useAppSelector((state) => state.singleTask.data);
  const [isUrlClicked, setIsUrlClicked] = useState(false);
  const [isIdClicked, setIsIdClicked] = useState(false);
  const [isBranchClicked, setIsBranchClicked] = useState(false);
  const identifier = task?.identifier;
  const title = task !== undefined ? task.title : '';
  const TaskUrl = `${process.env.NEXT_PUBLIC_URL}/tasks/${task?._id}`;
  const gitBranchName = `
			${replaceSpacesWithDashes(`${title.toLowerCase()}-${String(identifier).toLowerCase()}`)}`;

  const copyUrl = async (): Promise<void> => {
    await window.navigator.clipboard.writeText(TaskUrl);
    setIsUrlClicked(true);
    setTimeout(() => {
      setIsUrlClicked(false);
    }, 3000);
  };

  const copyIssueId = async (): Promise<void> => {
    await navigator.clipboard.writeText(`${replaceSpacesWithDashes(title)}-${task?.identifier}`);
    setIsIdClicked(true);
    setTimeout(() => {
      setIsIdClicked(false);
    }, 3000);
  };

  const copyGitBranchName = async (): Promise<void> => {
    await navigator.clipboard.writeText(gitBranchName);
    setIsBranchClicked(true);
    setTimeout(() => {
      setIsBranchClicked(false);
    }, 3000);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === '>') {
        event.preventDefault();
        copyGitBranchName();
      }
      if (event.ctrlKey && event.shiftKey && event.key === '<') {
        event.preventDefault();
        copyUrl();
      }
      if (event.ctrlKey && event.key === '.') {
        event.preventDefault();
        copyIssueId();
      }
    },
    [copyGitBranchName],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={style.row}>
      <div className={style.rowWrapper}>
        <div className={style.issueId}>{identifier}</div>
        <div className={style.buttons}>
          <CopyTaskUrl copyUrl={copyUrl} />

          <CopyTaskId copyTaskId={copyIssueId} />
          <CopyGitBranchName copyGitBranchName={copyGitBranchName} />
        </div>
        <div className={`${style.copiedAlertBox} ${isUrlClicked ? 'opacity-100' : 'opacity-0'}`}>
          <p className={style.urlClipboard}>Task {title} URL copied to clipboard</p>
          <p className={style.paste}>Paste it wherever you like</p>
        </div>
        <div className={`${style.copiedAlertBox} ${isIdClicked ? 'opacity-100' : 'opacity-0'}`}>
          <p className={style.titleClipboard}>
            {`${replaceSpacesWithDashes(title)}-${identifier}`} copied to clipboard
          </p>
          <p className={style.paste}>Paste it wherever you like</p>
        </div>
        <div className={`${style.copiedAlertBox} ${isBranchClicked ? 'opacity-100' : 'opacity-0'}`}>
          <p className={style.titleClipboard}>{gitBranchName} copied to clipboard</p>
          <p className={style.paste}>Paste it wherever you like</p>
        </div>
      </div>
    </div>
  );
};

export default IssueSidebarTopRow;
