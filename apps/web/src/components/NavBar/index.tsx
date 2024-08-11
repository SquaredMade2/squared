"use client";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { usePathname, useRouter } from "next/navigation";
import { setCurrentTeam } from "@/store/taskData";
import NewIssueModal from "@/components/NewIssueModal";
import WorkSpaceDropDown from "@/components/WorkSpaceDropdown";
import NewIssueButton from "@/components/NewIssueButton";
import NavBarTeams from "@/components/NavBarTeams";
import type { Team } from "@/store/taskData/taskData.interfaces";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import IconLeftMenu from "../IconLeftMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import DisplayPreferences from "../DisplayPreferences";
import { LayoutGrid } from "lucide-react";

const styles = {
  main: "flex h-full justify-center bg-popover border-r w-[250px]",
  newIssueModalContainer: "absolute top-[100px] left-full",
  teamsWrapper: "w-full h-full flex flex-col cursor-default text-foreground",
  mainContainer: "w-11/12 flex flex-col",
};

const Navbar = () => {
  const checkRouteIncludes = (pathname: string, ...args: string[]): boolean => {
    return args.some((arg) => pathname.includes(arg));
  };

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const currentYear: number = new Date().getFullYear();

  const allowedRoutes = checkRouteIncludes(pathname, "/team");
  const hideElements = checkRouteIncludes(pathname, "/tasks");
  const handleTeamClick = (team: Team): void => {
    dispatch(setCurrentTeam(team));
    router.push(`/workspace/${workspace.url}/team/${team.identifier}/all`);
  };

  return (
    <div className="flex h-full">
      <div className="w-[50px] h-full bg-muted dark:bg-accent border-r">
        <IconLeftMenu />
      </div>
      {allowedRoutes && (
        <div className={styles.main}>
          <div className={styles.mainContainer}>
            <div className={styles.teamsWrapper}>
              <div className="h-12 flex items-center">
                <WorkSpaceDropDown />
              </div>
              <div>
                <NewIssueButton />
              </div>
              <div>
                <Accordion type="single" collapsible>
                  {workspace?.teams.map((team: Team) => {
                    return (
                      <AccordionItem key={team._id} value={team._id}>
                        <AccordionTrigger className="text-sm">
                          <LayoutGrid className="text-[#9577FF] size-4" />
                          {team.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <NavBarTeams
                            id={team._id}
                            teamName={team.name}
                            onDropdownClick={() => handleTeamClick(team)}
                            teamIdentifier={team.identifier}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
                {!hideElements && (
                  <>
                    <Accordion type="single" collapsible>
                      {workspace?.teams.map((team: Team) => {
                        return (
                          <AccordionItem key={team._id} value={team._id}>
                            <AccordionTrigger className="text-sm">
                              <FontAwesomeIcon
                                className="text-green-500"
                                icon={faUserTag}
                              />
                              {"Assignee"}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div> Assignee Content</div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                    <Accordion type="single" collapsible>
                      {workspace?.teams.map((team: Team) => {
                        return (
                          <AccordionItem key={team._id} value={team._id}>
                            <AccordionTrigger className="text-sm">
                              <FontAwesomeIcon
                                className="text-pink-500"
                                icon={faTags}
                              />
                              {"Labels"}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div> Labels Content</div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                    <Accordion type="single" collapsible>
                      {workspace?.teams.map((team: Team) => {
                        return (
                          <AccordionItem key={team._id} value={team._id}>
                            <AccordionTrigger className="text-sm">
                              <FontAwesomeIcon
                                className="text-orange-500"
                                icon={faArrowUpShortWide}
                              />
                              {"Priority"}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div>Priority Content</div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>

                    <Accordion type="single" collapsible>
                      {workspace?.teams.map((team: Team) => {
                        return (
                          <AccordionItem key={team._id} value={team._id}>
                            <AccordionTrigger className="text-sm">
                              <FontAwesomeIcon
                                className="text-cyan-500"
                                icon={faSliders}
                              />
                              {"Display"}
                            </AccordionTrigger>
                            <AccordionContent>
                              <DisplayPreferences />
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </>
                )}
              </div>
              <div className="mt-auto mb-3 w-full text-center">
                <p className="text-muted-foreground text-xs ">
                  &copy; {currentYear} Squared. All rights reserved
                </p>
              </div>
            </div>
            <div className={styles.newIssueModalContainer}>
              <NewIssueModal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
