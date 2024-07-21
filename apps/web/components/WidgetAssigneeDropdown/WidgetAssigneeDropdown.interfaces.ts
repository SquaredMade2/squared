import type { SetFilter } from '@/app/interfaces/ProjectDataWidget.interfaces';

export interface WidgetAssigneeDropdownProps {
  assignee: [string, number];
  setFilter: SetFilter;
}
