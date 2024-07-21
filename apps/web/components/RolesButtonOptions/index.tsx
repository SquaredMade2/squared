import type { RolesButtonOptionsProps } from './RolesButtonOptions.interfaces';

export const RolesButtonOptions = ({ text, action }: RolesButtonOptionsProps) => {
  return (
    <button
      type="button"
      className="cursor-pointer hover:bg-[#999] hover:bg-opacity-10 px-2 py-1 rounded text-foreground"
      onClick={action}
    >
      {text}
    </button>
  );
};
