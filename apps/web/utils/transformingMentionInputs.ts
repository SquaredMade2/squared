export const transformingMentionInputs = (inputType: string) => {
  const regex = /\@\[([^\]]+)\]\(([^\)]+)\)/g;
  const userIds: { id: string }[] = [];
  let transformedInput = inputType;
  transformedInput = transformedInput?.replace(regex, (_, p1, p2) => {
    userIds.push(p2);
    return `@${p1}`;
  });
  return { transformedInput, userIds };
};
