const toolbarStyles = {
  toolbar: 'relative flex justify-evenly items-center mb-[1px] bg-background p-1 w-full z-99',
  inactiveToolbarItem:
    'border-0 flex rounded-lg p-2 cursor-pointer text-muted-foreground hover:text-foreground bg-background',
  activeToolbarItem:
    'border-0 flex rounded-lg p-2 cursor-pointer text-muted-foreground hover:text-foreground bg-background',
  dropdown:
    'z-10 absolute flex flex-col p-[8px] mx-[8px] shadow-lg rounded-lg min-h-[40px] bg-card',
  dropdownText: 'flex flex-grow w-[200px] cursor-pointer hover:text-white ',
  dropdownItem:
    'mx-[8px] p-[8px] cursor-pointer text-foreground bg-transparent flex items-center justify-between rounded-sm min-w-[268px] rounded-lg hover:bg-blue-500 hover:text-white',
  dropdownButton: 'flex justify-evenly w-[100px] items-center',
  hiddenToolbar: 'hidden',
  shownToolbar: 'relative',
  setLinkEditorHidden: 'opacity-0 top-[-10000px] left-[-10000px]',
  setLinkEditorVisible: 'opacity-100',
};

export default toolbarStyles;
