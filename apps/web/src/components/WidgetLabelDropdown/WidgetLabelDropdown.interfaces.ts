import type { SetFilter } from '@/app/interfaces/ProjectDataWidget.interfaces';

export interface WidgetLabelDropdownProps {
  label: [string, number];
  setFilter: SetFilter;
  getColorFromLabel: (labelName: string) => string;
}
