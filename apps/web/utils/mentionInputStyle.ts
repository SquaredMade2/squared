export const CustomMentionStyle = (isFocused: boolean) => ({
  control: {
    boxShadow: isFocused ? '2px 0px 4px 0px #6c79ff' : '',
    border: isFocused ? '1px solid #6c79ff' : '',
    padding: '10px 16px',
    borderRadius: '8px',
    maxWidth: '1065px',
    position: 'relative',
  },
  '&multiLine': {
    control: {
      minHeight: 86,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
    },
  },
  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 16,
    },
  },
  item: {
    padding: '5px 15px',
    borderBottom: '1px solid rgba(0,0,0,0.15)',
    '&focused': {
      backgroundColor: 'green',
    },
  },
});

export type CustomMentionStyleType = ReturnType<typeof CustomMentionStyle>;
