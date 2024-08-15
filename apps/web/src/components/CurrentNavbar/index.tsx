import IconLeftMenu from "../IconLeftMenu";
import NewIssueModal from "../NewIssueModal";

const CurrentNavbar = () => {
  return (
    <>
      <div className="w-14 min-h-screen bg-muted dark:bg-accent border-r">
        <IconLeftMenu />
      </div>
      <div className="absolute top-[100px] left-full">
        <NewIssueModal />
      </div>
    </>
  );
};

export default CurrentNavbar;
