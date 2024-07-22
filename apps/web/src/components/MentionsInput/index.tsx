import { Mention, MentionsInput } from 'react-mentions';
import type { MentionsInputProps } from './MentionsInput.interfaces';
const MentionInput = ({
  data,
  className,
  placeholder,
  value,
  onChange,
  name,
  mentionClass,
  spellCheck = false,
  onBlur,
  style,
  onFocus,
}: MentionsInputProps) => {
  return (
    <MentionsInput
      style={style}
      placeholder={placeholder}
      value={value}
      name={name}
      className={className}
      onChange={onChange}
      spellCheck={spellCheck}
      onBlur={onBlur}
      onFocus={onFocus}
    >
      <Mention
        trigger={'@'}
        data={data}
        className={mentionClass}
        displayTransform={(id, display) => `@${display}`}
        renderSuggestion={(suggestion, search, highlightedDisplay) => (
          <div className="text-black p-2 bg-slate-200 bg-opacity-20 cursor-default hover:bg-slate-400 hover:bg-opacity-50 rounded-t-sm">
            {highlightedDisplay}
          </div>
        )}
      />
    </MentionsInput>
  );
};

export default MentionInput;
