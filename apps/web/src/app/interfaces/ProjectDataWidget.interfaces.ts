import type React from 'react';

export type RenderTabsType = () => React.JSX.Element;

export type ClosedHeroIconType = () => React.JSX.Element;

export type OpenedHeroIconType = () => React.JSX.Element;

export type FavoritedType = () => React.JSX.Element;

export type NotFavoritedType = () => React.JSX.Element;

export interface AssigneesDataInterface {
  unassigned: number;
  [key: string]: number;
}

export interface LabelsDataInterface {
  [key: string]: number;
}

export type SetFilter = (filterAssignee: string) => void;
