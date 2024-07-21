'use client';
import '@/app/globals.css';
import ToggleNavBar from '@/components/ToggleNavBar';
import ButtonIcon from '../ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import Notificationcontrols from '../NotificationControls';

const styles = {
  wrapper:
    'w-full h-10 flex justify-between bg-popover py-2 border-b text-foreground sticky top-0 z-10',
};
const inboxIcon = <FontAwesomeIcon icon={faEnvelope} />;
type Props = {
  toggleInboxList: () => void;
};
const InboxTopMenu: React.FC<Props> = ({ toggleInboxList }) => {
  const taskId = useAppSelector((state) => state.currentTask.currentTaskId);

  return (
    <div className={styles.wrapper}>
      <div className="w-72 md:w-80 lg:px-2 flex items-center">
        <div className={'hidden mdsm:block'}>
          <ToggleNavBar />
        </div>
        <div className={'md:hidden'} onClick={toggleInboxList}>
          <ButtonIcon
            icon={inboxIcon}
            tooltipLabel="Inbox"
            labelPosition="right"
            hoverBg="bg-accent"
          />
        </div>
        <p className="hidden md:block">Inbox</p>
      </div>
      <div className="flex items-center">{taskId !== null && <Notificationcontrols />}</div>
    </div>
  );
};
export default InboxTopMenu;
