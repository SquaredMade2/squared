import type { ProfileImageProps } from "@/components/ProfileImage/ProfileImage.interfaces";
import { getInitials } from "@/utils/formatting";

const ProfileImage = ({ profileName, location }: ProfileImageProps) => {
  const getStyle = (): string => {
    switch (location) {
      case "settings":
        return "h-40 w-40 rounded-full bg-purpleButtonHover mb-6 flex items-center justify-center text-foreground text-7xl";
      case "dropdownMenu":
        return "h-6 w-6 rounded-full bg-purpleButtonHover flex items-center justify-center text-foreground text-xxs";
      case "comment":
        return "flex items-center justify-center bg-purpleButtonHover rounded-full p-2 mt-3 mr-3 w-6 h-6 text-foreground text-xxs";
      case "taskCard":
        return "absolute right-4 top-4 h-5 w-5 rounded-full bg-purpleButtonHover flex items-center justify-center text-foreground text-tiny";
      case "assigneeDropdown":
        return "h-5 w-5 mx-1 mr-2 rounded-full bg-purpleButtonHover flex items-center justify-center text-foreground text-tiny my-2";
      case "activityItem":
        return "h-5 w-5 mx-1 mr-2 rounded-full bg-purpleButtonHover flex items-center justify-center text-foreground text-tiny my-2";
      default:
        return "";
    }
  };
  return <div className={getStyle()}>{getInitials(profileName)}</div>;
};

export default ProfileImage;
