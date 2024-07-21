import type { Team as TaskDataTeam } from '@/store/taskData/taskData.interfaces';
import type { ChangeEvent } from 'react';

export type handleTeamClickNavbar = (team: TaskDataTeam) => void;

export type handleNavbarType = () => void;

export type handleSearchType = (e: ChangeEvent<HTMLInputElement>) => void;

export type handleActiveParamsType = (param: string) => void;

export type getTeamInfoType = (teamIdArray: TaskDataTeam[]) => Promise<void>;
