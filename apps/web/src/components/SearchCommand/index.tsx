import axios from "axios";
import { toast } from "react-toastify";
import type { RootState } from "@/store";
import { signOut } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClickAwayListener } from "@mui/base";
import { usePathname } from "next/navigation";
import { clearUser } from "@/store/userSettings";
import { setIsMenuOpen } from "@/store/isMenuOpen";
import { setIsWidgetOpen } from "@/store/isWidgetOpen";
import { useDispatch, useSelector } from "react-redux";
import { setShowNewIssue } from "@/store/showNewIssue";
import { motion, AnimatePresence } from "framer-motion";
import { setShowSearchModal } from "@/store/showSearchModal";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { deleteAllCurrentFilters } from "@/store/filterPage/actions";
import SearchCommandView from "../SearchCommandView";
import SearchCommandGoTo from "../SearchCommandGoTo";
import SearchCommandCopy from "../SearchCommandCopy";
import SearchCommandTeams from "../SearchCommandTeams";
import SearchCommandIssue from "../SearchCommandIssue";
import SearchCommandSearch from "../SearchCommandSearch";
import SearchCommandDeleted from "../SearchCommandDeleted";
import SearchCommandProject from "../SearchCommandProject";
import SearchCommandAccount from "../SearchCommandAccount";
import SearchCommandSettings from "../SearchCommandSettings";
import SearchCommandTemplates from "../SearchCommandTemplates";
import SearchCommandNavigation from "../SearchCommandNavigation";
import SearchCommandMiscellaneous from "../SearchCommandMiscellaneous";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandInput,
  CommandSeparator,
} from "@/components/ui/command";

const styles = {
  wrapper:
    "fixed z-10 top-0 left-0 flex items-start justify-center w-screen h-[703.2px] px-3 py-[13vh]  ",
  container:
    "relative flex flex-col w-[748.4px] border border-border bg-popover rounded-lg shadow-[#00000080] shadow-[0px_16px_70px] text-nav",
};

const SearchCommand = () => {
  const [lastKey, setLastKey] = useState<string>("");
  const [isIssueOpen, setIsIssueOpen] = useState<boolean>(false);
  const [isInputFocus, setIsInputFocus] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const currentTeam = useAppSelector(
    (state: RootState) => state.taskData.currentTeam
  );
  const showSearchModal = useSelector(
    (state: RootState) => state.showSearchModal.isOpen
  );
  const currentWorkspace = useSelector(
    (state: RootState) => state.taskData.currentWorkspace
  );
  const workspace = useAppSelector(
    (state: RootState) => state.taskData.currentWorkspace
  );
  const { toast: copyToast } = useToast();

  useEffect(() => {
    const down = (e: KeyboardEvent): void => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch(setShowSearchModal(true));
      }
      if (e.key === "Escape") {
        dispatch(setShowSearchModal(false));
      }

      if (!showSearchModal || isInputFocus) return;

      if (e.key.toLowerCase() === "c" && lastKey === "shift" && e.ctrlKey) {
        handleCopyUrl();
        return;
      }
      if (e.altKey && e.shiftKey && e.key === "Œ") {
        handleLogout();
        return;
      }
      if (e.ctrlKey && e.key.toLowerCase() === "/") {
        handleOpenNavigation(e);
        return;
      }
      if (e.key.toLowerCase() === "c") {
        handleNewIssue();
      }
      if (lastKey === "o" && e.key.toLowerCase() === "i") {
        setIsIssueOpen((isOpen) => !isOpen);
        console.log("hello");
      }
      if (lastKey === "g" && e.key.toLowerCase() === "i") {
        handleGoToInbox();
      }
      if (lastKey === "g" && e.key.toLowerCase() === "a") {
        handleGoToActiveIssues();
      }
      if (lastKey === "g" && e.key.toLowerCase() === "b") {
        handleGoToBacklog();
      }
      if (lastKey === "g" && e.key.toLowerCase() === "e") {
        handleGoToAllIssues();
      }
      if (lastKey === "g" && e.key.toLowerCase() === "u") {
        handleGoToViews();
      }
      if (lastKey === "o" && e.key.toLowerCase() === "w") {
        handleSwitchWorkspace();
      }
      setLastKey(e.key.toLowerCase());
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isInputFocus, showSearchModal, isIssueOpen, lastKey]);

  function handleClickAway(): void {
    dispatch(setShowSearchModal(false));
  }

  function handleNewIssue(): void {
    dispatch(setShowSearchModal(false));
    dispatch(setShowNewIssue(true));
  }

  function handleGoToInbox(): void {
    router.push(`/workspace/${workspace.url}/inbox`);
    dispatch(setShowSearchModal(false));
  }

  function handleGoToActiveIssues(): void {
    router.push(
      `/workspace/${currentWorkspace.url}/team/${currentTeam.identifier}/active`
    );
    dispatch(setShowSearchModal(false));
  }

  function handleGoToBacklog(): void {
    router.push(
      `/workspace/${currentWorkspace.url}/team/${currentTeam.identifier}/backlog`
    );
    dispatch(setShowSearchModal(false));
  }

  function handleGoToAllIssues(): void {
    router.push(
      `/workspace/${currentWorkspace.url}/team/${currentTeam.identifier}/all`
    );
    dispatch(setShowSearchModal(false));
  }

  function handleGoToViews(): void {
    dispatch(deleteAllCurrentFilters());
    router.push(
      `/workspace/${currentWorkspace.url}/team/${currentTeam.identifier}/views`
    );
    dispatch(setShowSearchModal(false));
  }

  async function handleCopyUrl(): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_URL}${pathname}`;
    await window.navigator.clipboard.writeText(url);
    copyToast({
      description: "URL copied to clipboard.",
    });
    dispatch(setShowSearchModal(false));
  }

  async function signOutHandler() {
    await signOut({ redirect: false }).then(() => {
      router.push("/login");
    });
    dispatch(setShowSearchModal(false));
  }

  async function handleLogout(): Promise<void> {
    await signOutHandler();
    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/logout`,
        withCredentials: true,
      });
      dispatch(clearUser());
      router.push(`${process.env.NEXT_PUBLIC_URL}`);
      toast.success(response.data.success);
    } catch (error) {}
    dispatch(setShowSearchModal(false));
  }

  function handleSwitchWorkspace(): void {
    dispatch(setIsMenuOpen(true));
    dispatch(setShowSearchModal(false));
  }

  function handleOpenNavigation(
    e: React.MouseEvent<HTMLDivElement> | KeyboardEvent
  ): void {
    e.stopPropagation();
    dispatch(setIsWidgetOpen(true));
    dispatch(setShowSearchModal(false));
  }

  return (
    <AnimatePresence>
      {showSearchModal && (
        <div className={styles.wrapper}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <motion.div
              className={styles.container}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Command>
                <CommandInput
                  placeholder="Type a command or search..."
                  onFocusCapture={() => setIsInputFocus(true)}
                  onBlurCapture={() => setIsInputFocus(false)}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <SearchCommandIssue handleNewIssue={handleNewIssue} />
                  <SearchCommandProject />
                  <SearchCommandView />
                  <SearchCommandTemplates />
                  <SearchCommandNavigation
                    isIssueOpen={isIssueOpen}
                    setIsIssueOpen={setIsIssueOpen}
                  />
                  <CommandSeparator />
                  <SearchCommandGoTo
                    handleGoToViews={handleGoToViews}
                    handleGoToInbox={handleGoToInbox}
                    handleGoToBacklog={handleGoToBacklog}
                    handleGoToAllIssues={handleGoToAllIssues}
                    handleGoToActiveIssues={handleGoToActiveIssues}
                  />
                  <CommandSeparator />
                  <SearchCommandDeleted />
                  <CommandSeparator />
                  <SearchCommandCopy handleCopyUrl={handleCopyUrl} />
                  <CommandSeparator />
                  <SearchCommandTeams />
                  <SearchCommandSettings />
                  <SearchCommandAccount
                    handleLogout={handleLogout}
                    handleSwitchWorkspace={handleSwitchWorkspace}
                  />
                  <SearchCommandMiscellaneous
                    handleOpenNavigation={handleOpenNavigation}
                  />
                  <SearchCommandSearch />
                </CommandList>
              </Command>
            </motion.div>
          </ClickAwayListener>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchCommand;
