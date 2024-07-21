export const style = {
  main: 'flex flex-col gap-2 items-end relative hover:bg-accent',
  buttonBg:
    'border border-border rounded flex flex-row gap-2 items-center px-2 py-0.5 text-sm text-muted-foreground cursor-pointer shadow-md bg-card hover:bg-accent hover:shadow-lg active:shadow-sm ',
  popUpBg:
    'bg-card border border-border rounded px-2 py-0.5 shadow transition-opacity duration-300 absolute w-[300px] z-10 top-[30px] ',
  layoutDiv: 'flex flex-row justify-between items-center my-1 gap-2',
  layoutText: 'text-foreground text-sm ',
  displayText: 'text-foreground text-sm pb-1 ',
  listButton:
    'bg-card px-1 mr-1 text-sm text-foreground cursor-pointer transition-200 hover:bg-hover',
  gridButton: 'bg-card px-1 text-sm text-foreground cursor-pointer hover:bg-background',
  listButtonActive:
    'border border-border rounded bg-card px-1 mr-1 text-sm text-foreground cursor-pointer',
  gridButtonActive:
    'border border-border rounded bg-card px-1 text-sm text-foreground cursor-pointer',
  resetDiv: 'flex justify-end border-t border-border px-1 w-full pt-1',
  resetDefault: 'bg-card text-muted-foreground cursor-pointer',
  setDefault: 'bg-card text-foreground pl-5 cursor-pointer',
  displayProperties: 'my-1 border-b border-border',
  group: 'group',
  displaySpan: 'cursor-pointer text-foreground',
};
