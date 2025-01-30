import { Mention, MentionsInput } from "react-mentions";
import type { MentionsInputProps } from "./MentionsInput.interfaces";
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
				trigger={"@"}
				data={data}
				className={mentionClass}
				displayTransform={(_, display) => `@${display}`}
				renderSuggestion={(_, __, highlightedDisplay) => (
					<div className="cursor-default rounded-t-sm bg-slate-200 bg-opacity-20 p-2 text-foreground hover:bg-slate-400 hover:bg-opacity-50">
						{highlightedDisplay}
					</div>
				)}
			/>
		</MentionsInput>
	);
};

export default MentionInput;
