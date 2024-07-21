export const styles = {
  dialog: ' fixed inset-0 p-4 pt-[25vh] overflow-y-auto',
  dialogOverlay: 'fixed inset-0 bg-gray-500/75',
  comboBox:
    'realtive bg-white max-w-xl mx-auto mt-[25vh] rounded-xl shadow-2xl ring-1 ring-black/5 focus:ring-0 divide-y divide-gray-100 overflow-hidden',
  searchIcon: 'flex items-center px-4',
  comboBoxInput:
    'w-full bg-transparent border-0  focus:outline-none text-med py-1 px-2 text-gray-800 placeholder:text-gray-400 h-12',
  optionWrapper: 'py-4 text-sm max-h-60 overflow-y-auto',
  optionDiv: {
    active: 'px-4 py-0.5 space-x-1 bg-indigo-600',
    inactive: 'px-4 py-0.5 space-x-1 bg-indigo-600',
  },
  taskName: {
    active: 'font-md text-white',
    inactive: 'font-md text-gray-900',
  },
  taskStatus: {
    active: 'text-indigo-200',
    inactive: 'text-gray-400',
  },
  noResult: 'p-4 text-sm text-gray-500',
};
