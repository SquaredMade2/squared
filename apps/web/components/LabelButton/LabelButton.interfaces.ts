import type { labelStyle } from '@/components/LabelButton';

export interface LabelColorProps {
  name: keyof typeof labelStyle;
}
export interface LabelButtonProps {
  location: string;
}
