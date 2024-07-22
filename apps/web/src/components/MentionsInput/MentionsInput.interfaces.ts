import type { FocusEvent } from 'react';
import type { CustomMentionStyleType } from '@/utils/mentionInputStyle';
import type { OnChangeHandlerFunc } from 'react-mentions';

export interface MentionsInputProps {
  data: { id: string; name: string }[];
  className: string;
  placeholder: string;
  value: string;
  onChange: OnChangeHandlerFunc;
  name: string;
  mentionClass?: string;
  spellCheck?: boolean;
  onBlur?:
    | ((
        event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
        clickedSuggestion: boolean,
      ) => void)
    | undefined;
  style?: CustomMentionStyleType;
  onFocus?: () => void;
}
