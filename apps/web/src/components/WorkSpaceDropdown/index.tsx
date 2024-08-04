import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { getAllWorkspaces } from "@/store/taskData/thunks";
import { clearUser } from "@/store/userSettings";
import WorkspaceInitials from "@/components/WorkspaceImage";
import ProfileImage from "../ProfileImage";
import { Check } from "lucide-react";
import { setIsMenuOpen } from "@/store/isMenuOpen";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

const styles = {
  main: "xs:pt-2 sm:pt-3 lg:pt-0 z-40 ",
  email: "mb-3 text-muted-foreground text-sm",
  workspacesWrapper: "py-3 px-3.5",
  workspaces:
    " py-1.5 text-popover-foreground flex items-center hover:bg-accent rounded text-sm font-medium cursor-default justify-start",
  title:
    "flex items-center text-popover-foreground hover:bg-secondary pr-1.5 py-1.5 rounded",
  titleWrapper: "flex items-center w-full justify-between",
  dropDownWrapper:
    "w-64 mt-3 border border-border bg-popover z-40 rounded-lg pb-1 absolute transition-all duration-100",
  menuOpen: "transform translate-y-0 scale-100 opacity-100 pointer-events-auto",
  menuClosed: "transform -translate-y-6 scale-95 opacity-0 pointer-events-none",
  menuItemsWrapper: "px-1.5",
  menuItems:
    "px-2 py-1.5 hover:bg-accent rounded text-sm text-popover-foreground cursor-pointer",
  span: "w-full border-t border-border block pb-1",
  spanTwo: "w-full border-t border-border block my-1",
  cursorDefault: "cursor-default",
  flex: "flex",
  paddingLeft: "pl-1 pb-0.5 ",
};

const WorkSpaceDropDown = () => {
  const dispatch = useAppDispatch();
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
  const user = useAppSelector((state) => state.userSettings.user);
  const currentWorkspace = useAppSelector(
    (state) => state.taskData.currentWorkspace
  );

  const isMenuOpen = useAppSelector((state) => state.isMenuOpen.isMenuOpen);
  useEffect(() => {
    dispatch(getAllWorkspaces());
  }, []);
  const router = useRouter();
  const workspaceUrl = currentWorkspace.url;

  const workspaceSettings = (workspaceSettingsOption: string) => {
    return `/workspace/${workspaceUrl}/settings/${workspaceSettingsOption}`;
  };
  const signOutHandler = async () => {
    await signOut({ redirect: false }).then(() => {
      router.push("/login");
    });
  };

  const index: number = allWorkspaces.findIndex(
    (item) => item._id === currentWorkspace._id
  );

  const handleLogout = async (): Promise<void> => {
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
  };

  // const handleMenu = (): void => {
  //   dispatch(setIsMenuOpen(!isMenuOpen));
  // };

  // useEffect(() => {
  //   function handleClickAway(event: MouseEvent) {
  //     if (
  //       menuRef.current &&
  //       event.target instanceof Node &&
  //       !titleRef.current?.contains(event.target) &&
  //       !menuRef.current.contains(event.target)
  //     ) {
  //       dispatch(setIsMenuOpen(false));
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickAway);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickAway);
  //   };
  // }, []);

  // return (
  //   <>
  //     <div className={styles.main}>
  //       <div className={styles.titleWrapper}>
  //         <div
  //           className={`${styles.title} ${isMenuOpen ? "bg-popover" : ""}`}
  //           onClick={handleMenu}
  //           ref={titleRef}
  //         >
  //           <WorkspaceInitials
  //             workspaceName={currentWorkspace.name}
  //             backgroundColor={index}
  //             location="workspaceMenu"
  //           />
  //           {handleWorkspaceNameOverflow(currentWorkspace.name)}
  //         </div>
  //         {user && (
  //           <ProfileImage profileName={user.name} location="dropdownMenu" />
  //         )}
  //       </div>
  //       {user && (
  //         <div
  //           className={`
  // 				  ${styles.dropDownWrapper}
  // 				  ${isMenuOpen ? styles.isMenuOpen : styles.isMenuClosed}
  // 				`}
  //           ref={menuRef}
  //         >
  //           <div className={styles.workspacesWrapper}>
  //             <p className={styles.email}>{user.email}</p>
  //             <ul>
  //               {allWorkspaces.map((workspace, index) => (
  //                 <Link
  //                   legacyBehavior
  //                   href={`/workspace/${workspace.url}`}
  //                   className={styles.workspaces}
  //                   key={workspace._id}
  //                 >
  //                   <div className={styles.flexJustifyBetween}>
  //                     <div className={styles.flex}>
  //                       <WorkspaceInitials
  //                         workspaceName={workspace.name}
  //                         backgroundColor={index}
  //                         location="workspaceList"
  //                       />
  //                       <li>{handleWorkspaceNameOverflow(workspace.name)}</li>
  //                     </div>
  //                     {workspace.name === currentWorkspace.name && (
  //                       <div className={styles.paddingLeft}>
  //                         <Check className="text-[#575BC7] size-5" />
  //                       </div>
  //                     )}
  //                   </div>
  //                 </Link>
  //               ))}
  //             </ul>
  //           </div>
  //           <span className={styles.span} />
  //           <ul className={styles.menuItemsWrapper}>
  //             <li
  //               onClick={() => router.push(workspaceSettings("workspace"))}
  //               className={styles.menuItems}
  //             >
  //               Workspace settings
  //             </li>
  //             <li
  //               onClick={() => router.push(workspaceSettings("members"))}
  //               className={styles.menuItems}
  //             >
  //               Invite & manage members
  //             </li>
  //             <li
  //               onClick={() => router.push("/join")}
  //               className={styles.menuItems}
  //             >
  //               Create or join a workspace
  //             </li>
  //           </ul>
  //           <span className={styles.spanTwo} />
  //           <ul className={styles.menuItemsWrapper}>
  //             <li onClick={handleLogout} className={styles.menuItems}>
  //               <button type="button">Log out</button>
  //             </li>
  //           </ul>
  //         </div>
  //       )}
  //     </div>
  //   </>
  // );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between w-full text-muted-foreground mt-2">
        <div className="flex gap-2 items-center ml-2">
          <WorkspaceInitials
            workspaceName={currentWorkspace.name}
            backgroundColor={index}
            location="workspaceMenu"
          />
          {handleWorkspaceNameOverflow(currentWorkspace.name)}
        </div>
        {user && (
          <ProfileImage profileName={user.name} location="dropdownMenu" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[265px]">
        {allWorkspaces.map((workspace, index) => (
          <Link
            legacyBehavior
            href={`/workspace/${workspace.url}`}
            className={styles.workspaces}
            key={workspace._id}
          >
            <DropdownMenuItem>
              <WorkspaceInitials
                workspaceName={workspace.name}
                backgroundColor={index}
                location="workspaceList"
              />
              <li>{handleWorkspaceNameOverflow(workspace.name)}</li>
              {workspace.name === currentWorkspace.name && (
                <div className={styles.paddingLeft}>
                  <Check className="text-[#575BC7] size-5" />
                </div>
              )}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(workspaceSettings("workspace"))}
        >
          Workspace Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(workspaceSettings("members"))}
        >
          Invite & manage members
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/join")}>
          Create or join a workspace
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkSpaceDropDown;
