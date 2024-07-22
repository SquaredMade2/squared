import type { HandleWorkspaceNameOverflowType } from '@/app/interfaces/Workspace.interface';

export const truncateString = (string: string, maxLength: number): string => {
  if (string.length > maxLength) {
    let lastSpace = string.lastIndexOf(' ', maxLength);
    if (lastSpace === -1) lastSpace = maxLength;
    return `${string.substring(0, lastSpace)}...`;
  }
  return string;
};

export const replaceSpacesWithDashes = (str: string): string => {
  return str?.replace(/\s+/g, '-');
};

export const handleWorkspaceNameOverflow: HandleWorkspaceNameOverflowType = (
  workspaceName: string,
) => {
  return typeof workspaceName === 'string' && workspaceName.length > 20
    ? `${workspaceName.slice(0, 20)}...`
    : workspaceName;
};

export const getInitials = (name: string) => {
  if (typeof name === 'string') {
    const words = name.split(/(?=[A-Z])|\s+/);
    if (words.length === 1) {
      return name.substr(0, 2).toUpperCase();
    }
    const filteredWords = [words[0], words[1]];
    const initials = filteredWords.map((word) => word.charAt(0));
    return initials.join('').toUpperCase();
  }
};

export const formatUrl = (title: string) => {
  const titleSlug = title
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return titleSlug;
};
