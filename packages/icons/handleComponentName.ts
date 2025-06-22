// Define regex patterns at top level
const DASH_UNDERSCORE_PATTERN = /[-_]+/g;
const NON_WORD_SPACE_PATTERN = /[^\w\s]/g;
const WORD_BOUNDARY_PATTERN = /\s+(.)(\w*)/g;
const FIRST_CHAR_PATTERN = /\w/;

export default function handleComponentName(str: string) {
	return `${str}`
		.toLowerCase()
		.replace(DASH_UNDERSCORE_PATTERN, " ")
		.replace(NON_WORD_SPACE_PATTERN, "")
		.replace(WORD_BOUNDARY_PATTERN, (_$1, $2, $3) => `${$2.toUpperCase() + $3}`)
		.replace(FIRST_CHAR_PATTERN, (s) => s.toUpperCase());
}
