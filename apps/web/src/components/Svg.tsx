import type React from 'react';

const styles = {
  assigneeButton:
    'absolute right-4 top-4 h-5 w-5 rounded-full flex items-center justify-center text-white text-tiny cursor-pointer hover:scale-110 transition-all',
  unassignButtonInDropdown:
    'h-5 w-5 mx-1 mr-2 rounded-full flex items-center justify-center text-white text-tiny my-2',
};

type IconProps = {
  view?: string;
  theme?: string;
};

export const LeftArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <title>Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
};

export const CalendarIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
      />
    </svg>
  );
};

export const newGridIcon = ({ view, theme }: IconProps) => {
  const setFillColor = () => {
    switch (true) {
      case view === 'grid' && theme === 'dark':
        return '#EEEFFC';
      case view !== 'grid' && theme === 'dark':
        return '#858699';
      case view === 'grid' && theme === 'light':
        return '#282A30';
      case view !== 'grid' && theme === 'light':
        return '#858699';
      default:
        return;
    }
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={setFillColor()}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <path
        d="M6.99967 13.2673V2.73398C6.99967 1.73398 6.57301 1.33398 5.51301 1.33398H2.81967C1.75967 1.33398 1.33301 1.73398 1.33301 2.73398V13.2673C1.33301 14.2673 1.75967 14.6673 2.81967 14.6673H5.51301C6.57301 14.6673 6.99967 14.2673 6.99967 13.2673Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6667 5.68065V2.65398C14.6667 1.71398 14.24 1.33398 13.18 1.33398H10.4867C9.42667 1.33398 9 1.71398 9 2.65398V5.67398C9 6.62065 9.42667 6.99398 10.4867 6.99398H13.18C14.24 7.00065 14.6667 6.62065 14.6667 5.68065Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6667 13.18V10.4867C14.6667 9.42667 14.24 9 13.18 9H10.4867C9.42667 9 9 9.42667 9 10.4867V13.18C9 14.24 9.42667 14.6667 10.4867 14.6667H13.18C14.24 14.6667 14.6667 14.24 14.6667 13.18Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const newListIcon = ({ view, theme }: IconProps) => {
  const setFillColor = () => {
    switch (true) {
      case view === 'list' && theme === 'dark':
        return '#EEEFFC';
      case view !== 'list' && theme === 'dark':
        return '#858699';
      case view === 'list' && theme === 'light':
        return '#282A30';
      case view !== 'list' && theme === 'light':
        return '#858699';
      default:
        return;
    }
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill={setFillColor()}
    >
      <title>Icon</title>
      <path
        d="M7.33301 13H13.9997"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.33301 8.33398H13.9997"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.33301 3.66602H13.9997"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 3.66732L2.66667 4.33398L4.66667 2.33398"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8.33333L2.66667 9L4.66667 7"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12.9993L2.66667 13.666L4.66667 11.666"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const newFilter = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <path
        d="M3.59993 1.40039H12.3999C13.1333 1.40039 13.7333 2.00039 13.7333 2.73372V4.20039C13.7333 4.73372 13.3999 5.40039 13.0666 5.73372L10.1999 8.26706C9.79993 8.60039 9.53327 9.26706 9.53327 9.80039V12.6671C9.53327 13.0671 9.2666 13.6004 8.93327 13.8004L7.99994 14.4004C7.13327 14.9337 5.93327 14.3337 5.93327 13.2671V9.73372C5.93327 9.26706 5.6666 8.66706 5.39994 8.33372L2.8666 5.66706C2.53327 5.33372 2.2666 4.73372 2.2666 4.33372V2.80039C2.2666 2.00039 2.8666 1.40039 3.59993 1.40039Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.28667 1.40039L4 6.66706"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const NewIssue = (styles: string, fill: string) => {
  return (
    <svg className={styles} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 20" fill="none">
      <title>Icon</title>
      <path
        d="M9.66699 1.66797H8.00033C3.83366 1.66797 2.16699 3.33464 2.16699 7.5013V12.5013C2.16699 16.668 3.83366 18.3346 8.00033 18.3346H13.0003C17.167 18.3346 18.8337 16.668 18.8337 12.5013V10.8346"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8666 2.51639L7.2999 9.08306C7.0499 9.33306 6.7999 9.82472 6.7499 10.1831L6.39157 12.6914C6.25823 13.5997 6.8999 14.2331 7.80823 14.1081L10.3166 13.7497C10.6666 13.6997 11.1582 13.4497 11.4166 13.1997L17.9832 6.63306C19.1166 5.49972 19.6499 4.18306 17.9832 2.51639C16.3166 0.849722 14.9999 1.38306 13.8666 2.51639Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.9248 3.45703C13.4831 5.4487 15.0415 7.00703 17.0415 7.5737"
        stroke={fill}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AddIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <title>Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
};

export const taskIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
      />
    </svg>
  );
};

export const checkIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const deleteIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <title>Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};

export const dueDateIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="#6b6f75"
      className="w-4 h-4"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
};

export const priorityIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="#6b6f75"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="#6b6f75"
      className="w-4 h-4"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
      />
    </svg>
  );
};

export const complexityIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="#6b6f75"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="#6b6f75"
      className="w-4 h-4"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
      />
    </svg>
  );
};

export const effortIcon = () => {
  return (
    <svg
      width="15px"
      height="15px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        {' '}
        <path
          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
          stroke="#6b6f75"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{' '}
        <path
          d="M12 6V12"
          stroke="#6b6f75"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{' '}
        <path
          d="M16.24 16.24L12 12"
          stroke="#6b6f75"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />{' '}
      </g>
    </svg>
  );
};

export const settingsIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="#858699"
      className="w-6 h-6 cursor-pointer"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
      />
    </svg>
  );
};

export const additionIcon = (theme: string) => {
  let styles = 'w-6 stroke-[#858699] duration-200 group-hover:stroke-white';
  if (theme === 'light') styles = 'w-6 stroke-[#858699] duration-200 group-hover:stroke-black';
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className={styles}>
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const lightMode = (selected: string) => {
  return (
    <svg
      className={`max-w-[165px] h-auto ${selected} box-border`}
      viewBox="0 0 186 112"
      fill="none"
    >
      <title>Icon</title>
      <rect width="186" height="112" rx="4" fill="white" />
      <rect x="98" width="0.5" height="112" fill="#EFF1F4" />
      <rect x="14" y="75" width="66" height="1" fill="#EFF1F4" />
      <rect x="14" y="84" width="49" height="3" rx="1" fill="#EFF1F4" />
      <rect x="114" y="13" width="45" height="6" rx="1" fill="#EFF1F4" />
      <rect x="33" y="44" width="38" height="3" rx="1" fill="#EFF1F4" />
      <rect x="33" y="60" width="38" height="3" rx="1" fill="#EFF1F4" />
      <rect x="14" y="92" width="37" height="3" rx="1" fill="#EFF1F4" />
      <path
        d="M27.2239 28.0713C27.371 27.944 27.5147 27.8105 27.6545 27.6707C30.7818 24.5433 30.7818 19.4729 27.6545 16.3455C24.5271 13.2182 19.4567 13.2182 16.3293 16.3455C16.1895 16.4853 16.056 16.629 15.9287 16.7761L27.2239 28.0713Z"
        fill="#5E6AD2"
      />
      <path
        d="M26.27 28.7798L15.2202 17.73C14.9986 18.0801 14.8068 18.4436 14.6447 18.817L25.183 29.3553C25.5564 29.1932 25.9199 29.0014 26.27 28.7798Z"
        fill="#5E6AD2"
      />
      <path
        d="M23.9418 29.7765L14.2235 20.0582C14.1053 20.5313 14.0308 21.013 14 21.4971L22.5029 30C22.987 29.9692 23.4687 29.8947 23.9418 29.7765Z"
        fill="#5E6AD2"
      />
      <path
        d="M20.7623 29.9218L14.0782 23.2377C14.3289 24.8603 15.0793 26.4207 16.3293 27.6707C17.5793 28.9207 19.1397 29.6711 20.7623 29.9218Z"
        fill="#5E6AD2"
      />
      <circle cx="18.5" cy="45.5" r="4.5" fill="#EFF1F4" />
      <rect x="114" y="33" width="7" height="4" rx="1" fill="#EFF1F4" />
      <rect x="128" y="33" width="17" height="4" rx="1" fill="#EFF1F4" />
      <path
        d="M167 34.57C167 34.0382 167 33.7723 167.099 33.5671C167.197 33.3622 167.362 33.1969 167.567 33.0985C167.772 33 168.038 33 168.57 33H186V37H168.57C168.038 37 167.772 37 167.567 36.9015C167.362 36.8031 167.197 36.6378 167.099 36.4329C167 36.2277 167 35.9618 167 35.43V34.57Z"
        fill="#EFF1F4"
      />
      <circle cx="156" cy="35" r="2" fill="#EFF1F4" />
      <rect x="114" y="47" width="7" height="4" rx="1" fill="#EFF1F4" />
      <rect x="128" y="47" width="17" height="4" rx="1" fill="#EFF1F4" />
      <path
        d="M167 48.57C167 48.0382 167 47.7723 167.099 47.5671C167.197 47.3622 167.362 47.1969 167.567 47.0985C167.772 47 168.038 47 168.57 47H186V51H168.57C168.038 51 167.772 51 167.567 50.9015C167.362 50.8031 167.197 50.6378 167.099 50.4329C167 50.2277 167 49.9618 167 49.43V48.57Z"
        fill="#EFF1F4"
      />
      <circle cx="156" cy="49" r="2" fill="#EFF1F4" />
      <rect x="114" y="65" width="7" height="4" rx="1" fill="#EFF1F4" />
      <rect x="128" y="65" width="17" height="4" rx="1" fill="#EFF1F4" />
      <path
        d="M167 66.57C167 66.0382 167 65.7723 167.099 65.5671C167.197 65.3622 167.362 65.1969 167.567 65.0985C167.772 65 168.038 65 168.57 65H186V69H168.57C168.038 69 167.772 69 167.567 68.9015C167.362 68.8031 167.197 68.6378 167.099 68.4329C167 68.2277 167 67.9618 167 67.43V66.57Z"
        fill="#EFF1F4"
      />
      <circle cx="156" cy="67" r="2" fill="#EFF1F4" />
      <rect x="114" y="79" width="7" height="4" rx="1" fill="#EFF1F4" />
      <rect x="128" y="79" width="17" height="4" rx="1" fill="#EFF1F4" />
      <path
        d="M167 80.57C167 80.0382 167 79.7723 167.099 79.5671C167.197 79.3622 167.362 79.1969 167.567 79.0985C167.772 79 168.038 79 168.57 79H186V83H168.57C168.038 83 167.772 83 167.567 82.9015C167.362 82.8031 167.197 82.6378 167.099 82.4329C167 82.2277 167 81.9618 167 81.43V80.57Z"
        fill="#EFF1F4"
      />
      <circle cx="156" cy="81" r="2" fill="#EFF1F4" />
      <rect x="114" y="97" width="7" height="4" rx="1" fill="#EFF1F4" />
      <rect x="128" y="97" width="17" height="4" rx="1" fill="#EFF1F4" />
      <path
        d="M167 98.57C167 98.0382 167 97.7723 167.099 97.5671C167.197 97.3622 167.362 97.1969 167.567 97.0985C167.772 97 168.038 97 168.57 97H186V101H168.57C168.038 101 167.772 101 167.567 100.901C167.362 100.803 167.197 100.638 167.099 100.433C167 100.228 167 99.9618 167 99.43V98.57Z"
        fill="#EFF1F4"
      />
      <circle cx="156" cy="99" r="2" fill="#EFF1F4" />
      <circle cx="18.5" cy="61.5" r="4.5" fill="#EFF1F4" />
    </svg>
  );
};

export const darkMode = (selected: string) => {
  return (
    <svg
      className={`max-w-[165px] h-auto ${selected} box-border`}
      viewBox="0 0 186 112"
      fill="none"
    >
      <title>Icon</title>
      <rect width="186" height="112" rx="4" fill="#1F2023" />
      <rect x="98" width="0.5" height="112" fill="#303236" />
      <rect x="14" y="75" width="66" height="1" fill="#303236" />
      <rect x="14" y="84" width="49" height="3" rx="1" fill="#303236" />
      <rect x="114" y="13" width="45" height="6" rx="1" fill="#303236" />
      <rect x="33" y="44" width="38" height="3" rx="1" fill="#303236" />
      <rect x="33" y="60" width="38" height="3" rx="1" fill="#303236" />
      <rect x="14" y="92" width="37" height="3" rx="1" fill="#303236" />
      <path
        d="M27.2239 28.0713C27.371 27.944 27.5147 27.8105 27.6545 27.6707C30.7818 24.5433 30.7818 19.4729 27.6545 16.3455C24.5271 13.2182 19.4567 13.2182 16.3293 16.3455C16.1895 16.4853 16.056 16.629 15.9287 16.7761L27.2239 28.0713Z"
        fill="#5E6AD2"
      />
      <path
        d="M26.27 28.7798L15.2202 17.73C14.9986 18.0801 14.8068 18.4436 14.6447 18.817L25.183 29.3553C25.5564 29.1932 25.9199 29.0014 26.27 28.7798Z"
        fill="#5E6AD2"
      />
      <path
        d="M23.9418 29.7765L14.2235 20.0582C14.1053 20.5313 14.0308 21.013 14 21.4971L22.5029 30C22.987 29.9692 23.4687 29.8947 23.9418 29.7765Z"
        fill="#5E6AD2"
      />
      <path
        d="M20.7623 29.9218L14.0782 23.2377C14.3289 24.8603 15.0793 26.4207 16.3293 27.6707C17.5793 28.9207 19.1397 29.6711 20.7623 29.9218Z"
        fill="#5E6AD2"
      />
      <circle cx="18.5" cy="45.5" r="4.5" fill="#303236" />
      <rect x="114" y="33" width="7" height="4" rx="1" fill="#303236" />
      <rect x="128" y="33" width="17" height="4" rx="1" fill="#303236" />
      <path
        d="M167 34.57C167 34.0382 167 33.7723 167.099 33.5671C167.197 33.3622 167.362 33.1969 167.567 33.0985C167.772 33 168.038 33 168.57 33H186V37H168.57C168.038 37 167.772 37 167.567 36.9015C167.362 36.8031 167.197 36.6378 167.099 36.4329C167 36.2277 167 35.9618 167 35.43V34.57Z"
        fill="#303236"
      />
      <circle cx="156" cy="35" r="2" fill="#303236" />
      <rect x="114" y="47" width="7" height="4" rx="1" fill="#303236" />
      <rect x="128" y="47" width="17" height="4" rx="1" fill="#303236" />
      <path
        d="M167 48.57C167 48.0382 167 47.7723 167.099 47.5671C167.197 47.3622 167.362 47.1969 167.567 47.0985C167.772 47 168.038 47 168.57 47H186V51H168.57C168.038 51 167.772 51 167.567 50.9015C167.362 50.8031 167.197 50.6378 167.099 50.4329C167 50.2277 167 49.9618 167 49.43V48.57Z"
        fill="#303236"
      />
      <circle cx="156" cy="49" r="2" fill="#303236" />
      <rect x="114" y="65" width="7" height="4" rx="1" fill="#303236" />
      <rect x="128" y="65" width="17" height="4" rx="1" fill="#303236" />
      <path
        d="M167 66.57C167 66.0382 167 65.7723 167.099 65.5671C167.197 65.3622 167.362 65.1969 167.567 65.0985C167.772 65 168.038 65 168.57 65H186V69H168.57C168.038 69 167.772 69 167.567 68.9015C167.362 68.8031 167.197 68.6378 167.099 68.4329C167 68.2277 167 67.9618 167 67.43V66.57Z"
        fill="#303236"
      />
      <circle cx="156" cy="67" r="2" fill="#303236" />
      <rect x="114" y="79" width="7" height="4" rx="1" fill="#303236" />
      <rect x="128" y="79" width="17" height="4" rx="1" fill="#303236" />
      <path
        d="M167 80.57C167 80.0382 167 79.7723 167.099 79.5671C167.197 79.3622 167.362 79.1969 167.567 79.0985C167.772 79 168.038 79 168.57 79H186V83H168.57C168.038 83 167.772 83 167.567 82.9015C167.362 82.8031 167.197 82.6378 167.099 82.4329C167 82.2277 167 81.9618 167 81.43V80.57Z"
        fill="#303236"
      />
      <circle cx="156" cy="81" r="2" fill="#303236" />
      <rect x="114" y="97" width="7" height="4" rx="1" fill="#303236" />
      <rect x="128" y="97" width="17" height="4" rx="1" fill="#303236" />
      <path
        d="M167 98.57C167 98.0382 167 97.7723 167.099 97.5671C167.197 97.3622 167.362 97.1969 167.567 97.0985C167.772 97 168.038 97 168.57 97H186V101H168.57C168.038 101 167.772 101 167.567 100.901C167.362 100.803 167.197 100.638 167.099 100.433C167 100.228 167 99.9618 167 99.43V98.57Z"
        fill="#303236"
      />
      <circle cx="156" cy="99" r="2" fill="#303236" />
      <circle cx="18.5" cy="61.5" r="4.5" fill="#303236" />
    </svg>
  );
};

export const backChevron = () => {
  return (
    <svg
      fill="#6b6f75"
      version="1.1"
      baseProfile="tiny"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="12px"
      height="12px"
      viewBox="0 0 42 42"
      xmlSpace="preserve"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <polygon
          fillRule="evenodd"
          points="27.066,1 7,21.068 26.568,40.637 31.502,35.704 16.865,21.068 32,5.933 "
        />
      </g>
    </svg>
  );
};

export const menuLeft = () => {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 1024 1024"
      className="icon"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#6b6f75"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M914.368 673.664h-519.68c-25.152 0-45.568-22.016-45.568-48.896 0-26.88 20.416-48.896 45.568-48.896h519.68c25.216 0 45.632 22.016 45.632 48.896 0 26.88-20.48 48.896-45.632 48.896z m0-228.096h-519.68c-25.152 0-45.568-21.952-45.568-48.896 0-26.88 20.416-48.896 45.568-48.896h519.68c25.216 0 45.632 22.016 45.632 48.896 0 26.88-20.48 48.896-45.632 48.896z m-3.264-219.904H115.328c-26.88 0-50.56-20.352-51.328-47.168A48.896 48.896 0 0 1 112.896 128h795.776c26.88 0 50.56 20.416 51.328 47.168a48.896 48.896 0 0 1-48.896 50.56z m-619.776 447.232V348.672L64 510.784l227.328 162.112c0 0.768 0 0.768 0 0z m-178.432 122.944h795.776c26.88 0 50.56 20.48 51.328 47.232a48.896 48.896 0 0 1-48.896 50.496H115.328c-26.88 0-50.56-20.416-51.328-47.232a48.896 48.896 0 0 1 48.896-50.496z"
          fill="#6b6f75"
        />
      </g>
    </svg>
  );
};

export const menuRight = () => {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 1024 1024"
      className="icon"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#6b6f75"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M109.632 673.664h519.68c25.152 0 45.568-22.016 45.568-48.896 0-26.88-20.416-48.896-45.568-48.896h-519.68c-25.216 0-45.632 22.016-45.632 48.896 0 26.88 20.48 48.896 45.632 48.896z m0-228.096h519.68c25.152 0 45.568-21.952 45.568-48.896 0-26.88-20.416-48.896-45.568-48.896h-519.68c-25.216 0-45.632 22.016-45.632 48.896 0 26.88 20.48 48.896 45.632 48.896z m3.264-219.904h795.776c26.88 0 50.56-20.352 51.328-47.168A48.896 48.896 0 0 0 911.104 128H115.328c-26.88 0-50.56 20.416-51.328 47.168a48.896 48.896 0 0 0 48.896 50.56z m619.776 447.232V348.672L960 510.784l-227.328 162.112c0 0.768 0 0.768 0 0z m178.432 122.944H115.328c-26.88 0-50.56 20.48-51.328 47.232a48.896 48.896 0 0 0 48.896 50.496h795.776c26.88 0 50.56-20.416 51.328-47.232a48.896 48.896 0 0 0-48.896-50.496z"
          fill="#6b6f75"
        />
      </g>
    </svg>
  );
};

export const taskPageTaskIcon = () => {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path d="M9.03917 8H18V9.49347H9.03917V8Z" fill="#6b6f75" />
        <path d="M9.03917 10.9869H18V12.4804H9.03917V10.9869Z" fill="#6b6f75" />
        <path d="M9.03917 13.9739H18V15.4673H9.03917V13.9739Z" fill="#6b6f75" />
        <rect x="6" y="8" width="1.49347" height="1.49347" fill="#6b6f75" />
        <rect x="6" y="10.9869" width="1.49347" height="1.49347" fill="#6b6f75" />
        <rect x="6" y="13.9739" width="1.49347" height="1.49347" fill="#6b6f75" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22 2H2V22H22V2ZM20 4H4V20H20V4Z"
          fill="#6b6f75"
        />
      </g>
    </svg>
  );
};

export const dateTimeIcon = () => {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M20 10V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V10M20 10V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V10M20 10H4M8 3V7M16 3V7"
          stroke="#6b6f75"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="6" y="12" width="3" height="3" rx="0.5" fill="#6b6f75" />
        <rect x="10.5" y="12" width="3" height="3" rx="0.5" fill="#6b6f75" />
        <rect x="15" y="12" width="3" height="3" rx="0.5" fill="#6b6f75" />
      </g>
    </svg>
  );
};

export const statusIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          opacity="0.4"
          d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z"
          fill="#292D32"
        />
        <path
          d="M6.88086 18.9001C6.47086 18.9001 6.13086 18.5601 6.13086 18.1501V16.0801C6.13086 15.6701 6.47086 15.3301 6.88086 15.3301C7.29086 15.3301 7.63086 15.6701 7.63086 16.0801V18.1501C7.63086 18.5701 7.29086 18.9001 6.88086 18.9001Z"
          fill="#292D32"
        />
        <path
          d="M12 18.9C11.59 18.9 11.25 18.56 11.25 18.15V14C11.25 13.59 11.59 13.25 12 13.25C12.41 13.25 12.75 13.59 12.75 14V18.15C12.75 18.57 12.41 18.9 12 18.9Z"
          fill="#292D32"
        />
        <path
          d="M17.1191 18.9002C16.7091 18.9002 16.3691 18.5602 16.3691 18.1502V11.9302C16.3691 11.5202 16.7091 11.1802 17.1191 11.1802C17.5291 11.1802 17.8691 11.5202 17.8691 11.9302V18.1502C17.8691 18.5702 17.5391 18.9002 17.1191 18.9002Z"
          fill="#292D32"
        />
        <path
          d="M17.871 5.8201C17.871 5.7701 17.851 5.7101 17.841 5.6601C17.831 5.6201 17.821 5.5701 17.811 5.5301C17.791 5.4901 17.761 5.4601 17.741 5.4201C17.711 5.3801 17.681 5.3301 17.641 5.3001C17.631 5.2901 17.631 5.2801 17.621 5.2801C17.591 5.2601 17.561 5.2501 17.531 5.2301C17.491 5.2001 17.441 5.1701 17.391 5.1501C17.341 5.1301 17.291 5.1301 17.241 5.1201C17.201 5.1101 17.171 5.1001 17.131 5.1001H14.201C13.791 5.1001 13.451 5.4401 13.451 5.8501C13.451 6.2601 13.791 6.6001 14.201 6.6001H15.451C13.071 9.1001 10.071 10.8601 6.70096 11.7101C6.30096 11.8101 6.05096 12.2201 6.15096 12.6201C6.23096 12.9601 6.54096 13.1901 6.88096 13.1901C6.94096 13.1901 7.00096 13.1801 7.06096 13.1701C10.631 12.2801 13.821 10.4301 16.371 7.8101V8.7801C16.371 9.1901 16.711 9.5301 17.121 9.5301C17.531 9.5301 17.871 9.1901 17.871 8.7801V5.8501C17.871 5.8401 17.871 5.8301 17.871 5.8201Z"
          fill="#292D32"
        />
      </g>
    </svg>
  );
};

export const labelIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#e2e2e2">
      <title>Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2105 4C10.6337 4 11.0126 4.18857 11.24 4.48L14 8L11.24 11.52C11.0126 11.8114 10.6337 12 10.2105 12L3.26316 11.9943C2.56842 11.9943 2 11.4857 2 10.8571V5.14286C2 4.51429 2.56842 4.00571 3.26316 4.00571L10.2105 4ZM11.125 9C11.6773 9 12.125 8.55228 12.125 8C12.125 7.44772 11.6773 7 11.125 7C10.5727 7 10.125 7.44772 10.125 8C10.125 8.55228 10.5727 9 11.125 9Z"
      />
    </svg>
  );
};

export const subTaskIcon = () => {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M7 8H17M7 12H17M11 16H17M4 12V20H20V4H4V7"
          stroke="#6b6f75"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const downIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <title>Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
};

export const ListIcon = () => {
  return (
    <svg
      height="14px"
      width="14px"
      version="1.1"
      id="图层_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 40.00 40.00"
      enableBackground="new 0 0 40 40"
      xmlSpace="preserve"
      fill="#6b6f75"
      stroke="#6b6f75"
      strokeWidth="0.8400000000000001"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <g>
          <g>
            <g>
              <g>
                <path
                  fill="#6b6f75"
                  d="M26,16H14c-0.3,0-0.5-0.2-0.5-0.5S13.7,15,14,15h12c0.3,0,0.5,0.2,0.5,0.5S26.3,16,26,16z"
                />
              </g>
              <g>
                <path
                  fill="#6b6f75"
                  d="M26,20.5H14c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h12c0.3,0,0.5,0.2,0.5,0.5S26.3,20.5,26,20.5z"
                />
              </g>
              <g>
                <path
                  fill="#6b6f75"
                  d="M26,25H14c-0.3,0-0.5-0.2-0.5-0.5S13.7,24,14,24h12c0.3,0,0.5,0.2,0.5,0.5S26.3,25,26,25z"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export const SearchIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#858699" className="sc-jOferD kYvkTg">
      <title>Icon</title>
      <path d="M9.8 6.8C9.8 5.14315 8.45685 3.8 6.8 3.8C5.14315 3.8 3.8 5.14315 3.8 6.8C3.8 8.45685 5.14315 9.8 6.8 9.8C8.45685 9.8 9.8 8.45685 9.8 6.8ZM9.49786 10.7707C8.72901 11.2941 7.80023 11.6 6.8 11.6C4.14903 11.6 2 9.45097 2 6.8C2 4.14903 4.14903 2 6.8 2C9.45097 2 11.6 4.14903 11.6 6.8C11.6 7.80023 11.2941 8.72901 10.7707 9.49786L13.7364 12.4636C14.0879 12.8151 14.0879 13.3849 13.7364 13.7364C13.3849 14.0879 12.8151 14.0879 12.4636 13.7364L9.49786 10.7707Z" />
    </svg>
  );
};
export const NavSearchIcon = (styles: string, theme: string) => {
  const fill = () => (theme === 'light' ? '#797A8C' : 'white');
  return (
    <svg
      className={styles}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <title>Icon</title>
      <path
        d="M9.58366 17.5013C13.9559 17.5013 17.5003 13.9569 17.5003 9.58464C17.5003 5.21238 13.9559 1.66797 9.58366 1.66797C5.2114 1.66797 1.66699 5.21238 1.66699 9.58464C1.66699 13.9569 5.2114 17.5013 9.58366 17.5013Z"
        stroke={fill()}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3337 18.3346L16.667 16.668"
        stroke={fill()}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const cmdIcon = (theme: string) => {
  return (
    <svg
      className="h-auto w-auto"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={theme !== 'light' ? '#EEEFFC' : '#3C4149'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="miter"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <rect x="8" y="8" width="8" height="8" />
        <path d="M5,2H5A3,3,0,0,0,2,5H2A3,3,0,0,0,5,8H8V5A3,3,0,0,0,5,2Z" />
        <path d="M22,5h0a3,3,0,0,0-3-3h0a3,3,0,0,0-3,3V8h3A3,3,0,0,0,22,5Z" />
        <path d="M2,19H2a3,3,0,0,0,3,3H5a3,3,0,0,0,3-3V16H5A3,3,0,0,0,2,19Z" />
        <path d="M19,22h0a3,3,0,0,0,3-3h0a3,3,0,0,0-3-3H16v3A3,3,0,0,0,19,22Z" />
      </g>
    </svg>
  );
};

export const ViewListIcon = ({ view, theme }: IconProps) => {
  const setFillColor = () => {
    switch (true) {
      case view === 'list' && theme === 'dark':
        return '#EEEFFC';
      case view !== 'list' && theme === 'dark':
        return '#858699';
      case view === 'list' && theme === 'light':
        return '#282A30';
      case view !== 'list' && theme === 'light':
        return '#858699';
      default:
        return;
    }
  };
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill={setFillColor()}
    >
      <path
        d="M7.33301 13H13.9997"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.33301 8.33398H13.9997"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.33301 3.66602H13.9997"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 3.66732L2.66667 4.33398L4.66667 2.33398"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8.33333L2.66667 9L4.66667 7"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12.9993L2.66667 13.666L4.66667 11.666"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ViewGridIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="transparent"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <path
        d="M6.99967 13.2673V2.73398C6.99967 1.73398 6.57301 1.33398 5.51301 1.33398H2.81967C1.75967 1.33398 1.33301 1.73398 1.33301 2.73398V13.2673C1.33301 14.2673 1.75967 14.6673 2.81967 14.6673H5.51301C6.57301 14.6673 6.99967 14.2673 6.99967 13.2673Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6667 5.68065V2.65398C14.6667 1.71398 14.24 1.33398 13.18 1.33398H10.4867C9.42667 1.33398 9 1.71398 9 2.65398V5.67398C9 6.62065 9.42667 6.99398 10.4867 6.99398H13.18C14.24 7.00065 14.6667 6.62065 14.6667 5.68065Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6667 13.18V10.4867C14.6667 9.42667 14.24 9 13.18 9H10.4867C9.42667 9 9 9.42667 9 10.4867V13.18C9 14.24 9.42667 14.6667 10.4867 14.6667H13.18C14.24 14.6667 14.6667 14.24 14.6667 13.18Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const displayIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <path
        d="M12.667 14.6673V7.33398"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.667 4.66732V1.33398"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 14.6673V11.334"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.66732V1.33398"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33301 14.6673V7.33398"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33301 4.66732V1.33398"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 7.33398H4.66667"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.333 7.33398H13.9997"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66699 8.66602H9.33366"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const personIcon = (
  props: (React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) | undefined,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#6B6F76"
    className="sc-iAbQMe idhleX"
    {...props}
  >
    <title>Icon</title>
    <path
      fill="#90959D"
      d="M8 4a2 2 0 0 0-2 2v.5a2 2 0 0 0 4 0V6a2 2 0 0 0-2-2ZM5.155 12.857c-.672-.459-.609-1.403-.034-1.978A3 3 0 0 1 7.243 10h1.514a3 3 0 0 1 2.122.879c.575.575.638 1.52-.034 1.978-.367.25-.769.45-1.195.593l-.059.02a5.032 5.032 0 0 1-3.182 0l-.06-.02a4.822 4.822 0 0 1-1.194-.593Z"
    />
    <path
      fill="#90959D"
      fillRule="evenodd"
      d="M14.988 8.417a.473.473 0 0 1-.543.433l-.496-.065a.537.537 0 0 1-.453-.563 5.646 5.646 0 0 0 0-.444.537.537 0 0 1 .453-.563l.496-.065a.473.473 0 0 1 .543.433 7.1 7.1 0 0 1 0 .834Zm-.727-3.551a.473.473 0 0 1-.254.646l-.462.192a.538.538 0 0 1-.674-.261 5.497 5.497 0 0 0-.22-.38.538.538 0 0 1 .11-.715l.396-.305a.473.473 0 0 1 .687.102c.153.231.292.472.417.72Zm-2.406-2.71c.23.152.27.468.102.687l-.305.396a.538.538 0 0 1-.714.11 5.49 5.49 0 0 0-.38-.22.538.538 0 0 1-.261-.674l.191-.462a.473.473 0 0 1 .646-.254c.25.125.49.264.72.417ZM8.416 1.012a.473.473 0 0 1 .433.543l-.065.496a.537.537 0 0 1-.563.453 5.627 5.627 0 0 0-.444 0 .537.537 0 0 1-.563-.453l-.065-.496a.473.473 0 0 1 .433-.543 7.109 7.109 0 0 1 .834 0Zm-3.551.727a.473.473 0 0 1 .646.254l.192.462a.538.538 0 0 1-.261.674c-.13.069-.257.142-.38.22a.537.537 0 0 1-.715-.11l-.305-.396a.473.473 0 0 1 .102-.687c.231-.153.472-.292.72-.417Zm-2.71 2.406a.473.473 0 0 1 .687-.102l.396.305a.537.537 0 0 1 .11.714 5.49 5.49 0 0 0-.22.38.538.538 0 0 1-.674.262l-.462-.192a.473.473 0 0 1-.254-.646c.125-.25.264-.49.417-.72ZM1.555 7.15a.473.473 0 0 0-.543.433 7.109 7.109 0 0 0 0 .834.473.473 0 0 0 .543.433l.496-.065a.537.537 0 0 0 .453-.563 5.627 5.627 0 0 1 0-.444.537.537 0 0 0-.453-.563l-.496-.065Zm.184 3.984a.473.473 0 0 1 .254-.646l.462-.191a.538.538 0 0 1 .674.26c.069.13.142.257.22.38a.538.538 0 0 1-.11.715l-.396.305a.473.473 0 0 1-.687-.103 6.989 6.989 0 0 1-.417-.72Zm2.406 2.71a.473.473 0 0 1-.102-.687l.305-.396a.538.538 0 0 1 .714-.11 5.5 5.5 0 0 0 .38.22c.245.128.367.419.262.674l-.192.462a.473.473 0 0 1-.646.254 6.999 6.999 0 0 1-.72-.417Zm3.438 1.144a.473.473 0 0 1-.433-.543l.065-.496a.537.537 0 0 1 .563-.453 5.646 5.646 0 0 0 .444 0c.276-.011.527.18.563.453l.065.496a.473.473 0 0 1-.433.543 7.1 7.1 0 0 1-.834 0Zm3.551-.727a.473.473 0 0 1-.646-.254l-.191-.462a.538.538 0 0 1 .26-.674c.13-.069.257-.142.38-.22a.538.538 0 0 1 .715.11l.305.396a.473.473 0 0 1-.103.687c-.23.153-.47.292-.72.417Zm2.023-2.304a.473.473 0 0 0 .687-.103c.153-.23.292-.47.417-.72a.473.473 0 0 0-.254-.646l-.462-.191a.538.538 0 0 0-.674.26c-.069.13-.142.257-.22.38a.538.538 0 0 0 .11.715l.396.305Z"
      clipRule="evenodd"
    />
  </svg>
);
// Start of SVGs for IssueSidebar

export const todoIcon = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    aria-label="Todo"
    className="color-override"
    {...props}
  >
    <title>Icon</title>
    <rect width={12} height={12} x={1} y={1} stroke="#E2E2E2" strokeWidth={2} rx={6} />
    <path fill="#E2E2E2" d="M7 7V3.5z" />
  </svg>
);

export const verticalSixDots = (
  props: (React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) | undefined,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={15}
    className="sc-ilhmMj sc-bKCeHe iIZTzm jKzgYI"
    viewBox="0 0 6 10"
    {...props}
  >
    <title>Icon</title>
    <path
      fill="#90959D"
      fillRule="evenodd"
      d="M1 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM1 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM1 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
      clipRule="evenodd"
    />
  </svg>
);

export const nullPriority = (
  props: (React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) | undefined,
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="#6B6F76"
      aria-label="No Priority"
      {...props}
    >
      <title>Icon</title>
      <rect width={3} height={1.5} x={1} y={7.25} opacity={0.9} rx={0.5} />
      <rect width={3} height={1.5} x={6} y={7.25} opacity={0.9} rx={0.5} />
      <rect width={3} height={1.5} x={11} y={7.25} opacity={0.9} rx={0.5} />
    </svg>
  );
};

export const downArrow = (
  fillColor: string | undefined,
  width: string | number | undefined,
  height: string | number | undefined,
) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 9"
      fill={fillColor}
      className="sc-hItEmJ bNexPQ"
    >
      <title>Icon</title>
      <path
        d="M10.1611 0.314094L5.99463 4.48054L1.82819 0.314094C1.4094 -0.104698 0.732886 -0.104698 0.314094 0.314094C-0.104698 0.732886 -0.104698 1.4094 0.314094 1.82819L5.24295 6.75705C5.66175 7.17584 6.33825 7.17584 6.75705 6.75705L11.6859 1.82819C12.1047 1.4094 12.1047 0.732886 11.6859 0.314094C11.2671 -0.0939598 10.5799 -0.104698 10.1611 0.314094Z"
        transform="translate(0.77832 0.998535)"
      />
    </svg>
  );
};

export const Star = (props: { className: string }) => {
  const { className = '' } = props || {};
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className={className}>
      <title>Icon</title>
      <path d="M10.5193 4.98997L9.46118 2.01693C9.34483 1.70806 9.1452 1.45362 8.88451 1.27433C8.62466 1.09562 8.31641 1 8.00081 1C7.68521 1 7.37696 1.09562 7.11712 1.27433C6.85642 1.45362 6.65679 1.70806 6.54528 2.00374L5.48248 4.98997L2.55536 4.98997C2.23765 4.98973 1.92683 5.08675 1.66556 5.26809C1.40342 5.45004 1.20379 5.70812 1.09414 6.00737C0.984248 6.30728 0.970192 6.63372 1.05394 6.94194C1.13753 7.2496 1.31442 7.52386 1.56019 7.7275L4.08545 9.80411L3.02371 12.9604C2.91854 13.2733 2.91647 13.6112 3.01776 13.9252C3.11884 14.2385 3.3175 14.5113 3.58464 14.7044C3.85102 14.8969 4.17178 15.0003 4.50071 14.9996C4.82872 14.9993 5.14907 14.8951 5.41483 14.702L8.00053 12.8223L10.5851 14.7014C10.8496 14.8944 11.17 14.9991 11.4991 15C11.8281 15.0009 12.1491 14.8978 12.4157 14.7054C12.6831 14.5124 12.882 14.2394 12.9833 13.926C13.0848 13.6113 13.0827 13.2731 12.9773 12.9602L11.9156 9.80207L14.444 7.72408C14.695 7.51166 14.8686 7.23684 14.9493 6.92968C15.0168 6.67352 15.0167 6.40505 14.9504 6.15011L14.9022 5.99753C14.791 5.70157 14.5918 5.44667 14.3314 5.26673C14.0718 5.08736 13.7637 4.9909 13.4479 4.98998L10.5193 4.98997ZM13.4986 6.54821C13.4962 6.55733 13.491 6.56562 13.4832 6.57224L10.7049 8.85551C10.546 8.98629 10.4307 9.16168 10.3739 9.35896C10.3168 9.55714 10.3214 9.76807 10.3875 9.96371L11.5556 13.4385C11.5586 13.4474 11.5587 13.4565 11.5559 13.4652C11.553 13.4741 11.5467 13.4827 11.5378 13.4891C11.5281 13.4961 11.5159 13.5 11.503 13.5C11.4902 13.5 11.4779 13.496 11.4683 13.4889L8.60012 11.4036C8.42554 11.2769 8.21577 11.2088 8.00055 11.2088C7.78531 11.2088 7.5755 11.2769 7.40134 11.4034L4.53289 13.4886C4.52321 13.4957 4.511 13.4996 4.49835 13.4996C4.48523 13.4997 4.47312 13.4958 4.46329 13.4887C4.45442 13.4822 4.44826 </svg>13.4738 4.4453 13.4646C4.44255 13.4561 4.4426 13.4471 4.44547 13.4386L5.61393 9.96499C5.67961 9.76981 5.68428 9.5592 5.62728 9.3612C5.57043 9.16375 5.45499 8.98835 5.29643 8.85789L2.51507 6.57069C2.50925 6.56586 2.50387 6.55753 2.50146 6.54865C2.49919 6.54032 2.49957 6.53163 2.50257 6.52343C2.50583 6.51453 2.5121 6.50643 2.52085 6.50035C2.53046 6.49368 2.54238 6.48996 2.55479 6.48997H5.8221C6.03248 6.4897 6.23685 6.42501 6.40824 6.30453C6.58053 6.18341 6.71109 6.01179 6.78158 5.81318L7.9609 2.49821C7.95727 2.50944 7.95646 2.51419 7.9574 2.5155C7.97668 2.50367 7.98851 2.5 8.00081 2.5C8.01311 2.5 8.02494 2.50367 8.03451 2.51025C8.04324 2.51625 8.04952 2.52427 8.05284 2.53307L9.22029 5.81379C9.29053 6.01192 9.42137 6.18383 9.59407 6.30503C9.76589 6.4256 9.97082 6.49011 10.1806 6.48997H13.4457C13.4563 6.49001 13.4686 6.49385 13.4786 6.50077L13.4902 6.5114L13.4977 6.52418C13.5004 6.53198 13.5007 6.54022 13.4986 6.54821Z" />
    </svg>
  );
};

export const checkMark = (color: string | undefined) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#00000070"
    className="sc-jcMfQk hhWQyR"
    viewBox="0 0 20 20"
  >
    <title>Icon</title>
    <path
      fill={!color ? '#282A30' : color}
      d="M7.92 17a1.31 1.31 0 0 1-1-.47l-3.63-4.36a1.24 1.24 0 0 1 .19-1.78 1.32 1.32 0 0 1 1.82.19l2.51 3 6.81-10a1.31 1.31 0 0 1 1.79-.36A1.24 1.24 0 0 1 16.78 5L9 16.43A1.3 1.3 0 0 1 8 17Z"
    />
  </svg>
);

export const urgentPriority = (fill?: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#fc7840"
    aria-label="Urgent Priority"
  >
    <title>Icon</title>
    <path
      fill={fill}
      fillOpacity={0.44}
      d="M3 1.346a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2H3Zm3.914 3h1.738L8.5 9.948H7.07l-.156-5.602Zm1.809 7.164a.95.95 0 0 1-.938.938.934.934 0 1 1 0-1.867c.5 0 .934.417.938.929Z"
    />
  </svg>
);

export const highPriority = (fill?: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#DCD8FE93"
    aria-label="High Priority"
  >
    <title>Icon</title>
    <rect width={3} height={6} x={1} y={8} fill={fill} fillOpacity={0.576} rx={1} />
    <rect width={3} height={9} x={6} y={5} fill={fill} fillOpacity={0.576} rx={1} />
    <rect width={3} height={12} x={11} y={2} fill={fill} fillOpacity={0.576} rx={1} />
  </svg>
);

export const mediumPriority = (fill?: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#DCD8FE93"
    aria-label="Medium Priority"
  >
    <title>Icon</title>
    <rect width={3} height={6} x={1} y={8} fill={fill} fillOpacity={0.576} rx={1} />
    <rect width={3} height={9} x={6} y={5} fill={fill} fillOpacity={0.576} rx={1} />
    <rect width={3} height={12} x={11} y={2} fill={fill} fillOpacity={0.4} rx={1} />
  </svg>
);

export const lowPriority = (fill?: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#DCD8FE93"
    aria-label="Low Priority"
  >
    <title>Icon</title>
    <rect width={3} height={6} x={1} y={8} fill={fill} fillOpacity={0.576} rx={1} />
    <rect width={3} height={9} x={6} y={5} fill={fill} fillOpacity={0.4} rx={1} />
    <rect width={3} height={12} x={11} y={2} fill={fill} fillOpacity={0.4} rx={1} />
  </svg>
);

export const GitBranch = ({
  className,
  onClick,
}: {
  className: string;
  onClick: () => void;
}) => {
  return (
    <svg
      fill="#9597AD"
      className={className}
      onClick={onClick}
      viewBox="0 0 14 14"
      role="img"
      focusable="false"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 3.8000778,1.800156 C 2.9170015,1.800156 2.200234,2.516924 2.200234,3.4 c 0,0.590279 0.3237166,1.100917 0.8001562,1.378723 l 0,5.243178 C 2.524419,10.299239 2.200234,10.809409 2.200234,11.400156 2.200234,12.282764 2.9170015,13 3.8000778,13 c 0.8830764,0 1.5998439,-0.717236 1.5998439,-1.599844 0,-0.590747 -0.3232481,-1.100917 -0.8001562,-1.378255 l 0,-5.243178 C 5.0766736,4.500917 5.3999217,3.990279 5.3999217,3.4 c 0,-0.883076 -0.7167675,-1.599844 -1.5998439,-1.599844 z m 0,10.399688 c -0.4413039,0 -0.8001561,-0.357915 -0.8001561,-0.800156 0,-0.441304 0.3583837,-0.800156 0.8001561,-0.800156 0.4427094,0 0.8001562,0.358383 0.8001562,0.800156 0,0.442241 -0.3574468,0.800156 -0.8001562,0.800156 z m 0,-7.999688 C 3.3587739,4.200156 2.9999217,3.842709 2.9999217,3.4 c 0,-0.442709 0.3583837,-0.800156 0.8001561,-0.800156 0.4427094,0 0.8001562,0.357447 0.8001562,0.800156 0,0.442709 -0.3574468,0.800156 -0.8001562,0.800156 z m 7.2000002,5.821745 0,-5.022057 c 0,-2.40609 -2.4,-2.4 -2.4,-2.4 l -0.800156,0 0,-1.599844 -2.4000003,2.4 2.4000003,2.4 0,-1.599844 c 0,0 0.333554,0 0.800156,0 0.705524,0 0.800156,0.800156 0.800156,0.800156 l 0,5.021589 c -0.47644,0.277338 -0.800156,0.786571 -0.800156,1.378255 0,0.882608 0.717236,1.599844 1.599844,1.599844 0.882608,0 1.599844,-0.717236 1.599844,-1.599844 0,-0.590747 -0.323717,-1.100917 -0.800157,-1.378255 z m -0.799688,2.177943 c -0.441304,0 -0.800156,-0.357915 -0.800156,-0.800156 0,-0.441304 0.358384,-0.800156 0.800156,-0.800156 0.442241,0 0.800156,0.358383 0.800156,0.800156 0,0.442241 -0.357915,0.800156 -0.800156,0.800156 z" />
    </svg>
  );
};

export const IssueId = ({
  className,
  onClick,
}: {
  className: string;
  onClick: () => void;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      onClick={onClick}
      className={className}
    >
      <title>Icon</title>
      <path
        d="M14.166 11.1654V13.6654C14.166 16.9987 12.8327 18.332 9.49935 18.332H6.33268C2.99935 18.332 1.66602 16.9987 1.66602 13.6654V10.4987C1.66602 7.16536 2.99935 5.83203 6.33268 5.83203H8.83268"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1673 11.1654H11.5007C9.50065 11.1654 8.83398 10.4987 8.83398 8.4987V5.83203L14.1673 11.1654Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66602 1.66797H12.9993"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83398 4.16797C5.83398 2.78464 6.95065 1.66797 8.33398 1.66797H10.5173"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3339 6.66797V11.8263C18.3339 13.118 17.2839 14.168 15.9922 14.168"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.334 6.66797H15.834C13.959 6.66797 13.334 6.04297 13.334 4.16797V1.66797L18.334 6.66797Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IssueUrl = ({
  className,
  onClick,
}: {
  className: string;
  onClick: () => void;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      onClick={onClick}
    >
      <title>Icon</title>
      <path
        d="M10.8832 9.11719C12.7582 10.9922 12.7582 14.0255 10.8832 15.8922C9.00821 17.7589 5.97487 17.7672 4.1082 15.8922C2.24154 14.0172 2.2332 10.9839 4.1082 9.11719"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.82578 11.1734C6.87578 9.22344 6.87578 6.05677 8.82578 4.09844C10.7758 2.14011 13.9424 2.14844 15.9008 4.09844C17.8591 6.04844 17.8508 9.21511 15.9008 11.1734"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ShiftIcon = ({ className }: { className: string }) => {
  return (
    <svg
      width="10px"
      height="10px"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="shiftIconTitle"
      stroke="#000000"
      strokeWidth="1"
      strokeLinecap="square"
      strokeLinejoin="miter"
      fill="none"
      color="#000000"
      className={className}
    >
      {' '}
      <title id="shiftIconTitle">Shift</title>{' '}
      <path d="M5,21 L19,21 L5,21 Z M16,12 L16,17 L8,17 L8,12 L3,12 L12,3 L21,12 L16,12 Z" />{' '}
    </svg>
  );
};

export const checkmark = () => {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="sc-jcMfQk hhWQyR">
      <title>Icon</title>
      <path d="M7.92,17a1.31,1.31,0,0,1-1-.47L3.29,12.17a1.24,1.24,0,0,1,.19-1.78,1.32,1.32,0,0,1,1.82.19l2.51,3,6.81-10a1.31,1.31,0,0,1,1.79-.36A1.24,1.24,0,0,1,16.78,5L9,16.43A1.3,1.3,0,0,1,8,17Z" />
    </svg>
  );
};

export const menuCheckMark = (fill: string | undefined) => {
  return (
    <svg width="16" height="9" viewBox="0 0 16 12" fill={fill} className="sc-hoaEDx dXtDNk">
      <title>Icon</title>
      <path d="M4.93942 9.69781L1.62578 6.38648C1.25336 6.01431 0.651746 6.01431 0.27932 6.38648C-0.0931065 6.75865 -0.0931065 7.35984 0.27932 7.73201L4.27096 11.7209C4.64339 12.093 5.245 12.093 5.61743 11.7209L15.7207 1.62465C16.0931 1.25248 16.0931 0.651292 15.7207 0.279125C15.3483 -0.0930417 14.7466 -0.0930417 14.3742 0.279125L4.93942 9.69781Z" />
    </svg>
  );
};

export const backlog = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <g clipPath="url(#clip0_1473_12451)">
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="#9597AD"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 3.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_1473_12451">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const closeButton = (fill: string | undefined) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={fill}>
      <title>Icon</title>
      <path d="M2.96967 2.96967C3.26256 2.67678 3.73744 2.67678 4.03033 2.96967L8 6.939L11.9697 2.96967C12.2626 2.67678 12.7374 2.67678 13.0303 2.96967C13.3232 3.26256 13.3232 3.73744 13.0303 4.03033L9.061 8L13.0303 11.9697C13.2966 12.2359 13.3208 12.6526 13.1029 12.9462L13.0303 13.0303C12.7374 13.3232 12.2626 13.3232 11.9697 13.0303L8 9.061L4.03033 13.0303C3.73744 13.3232 3.26256 13.3232 2.96967 13.0303C2.67678 12.7374 2.67678 12.2626 2.96967 11.9697L6.939 8L2.96967 4.03033C2.7034 3.76406 2.6792 3.3474 2.89705 3.05379L2.96967 2.96967Z" />
    </svg>
  );
};

export const todo = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <circle cx="8" cy="8" r="7" stroke="#9597AD" strokeWidth="1.5" />
    </svg>
  );
};

export const inProgress = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <g clipPath="url(#clip0_1473_20025)">
        <circle cx="8" cy="8" r="7" stroke="#7394FF" strokeWidth="1.5" />
        <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1V15Z" fill="#7394FF" />
      </g>
      <defs>
        <clipPath id="clip0_1473_20025">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const done = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <g clipPath="url(#clip0_1473_20082)">
        <circle cx="8" cy="8" r="7" stroke="#7394FF" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM11.9049 6.5308C12.198 6.23816 12.1984 5.76329 11.9058 5.47014C11.6132 5.17699 11.1383 5.17657 10.8451 5.4692L7.12297 9.18481L5.53033 7.59217C5.23744 7.29928 4.76256 7.29928 4.46967 7.59217C4.17678 7.88506 4.17678 8.35994 4.46967 8.65283L6.59217 10.7753C6.88488 11.068 7.35939 11.0682 7.65236 10.7758L11.9049 6.5308Z"
          fill="#7394FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_1473_20082">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const canceled = () => {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-label="Canceled"
      fill="#95a2b3"
      className="color-override sc-eJNOVp bGuMmM"
      width={16}
    >
      <title>Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM5.03033 3.96967C4.73744 3.67678 4.26256 3.67678 3.96967 3.96967C3.67678 4.26256 3.67678 4.73744 3.96967 5.03033L5.93934 7L3.96967 8.96967C3.67678 9.26256 3.67678 9.73744 3.96967 10.0303C4.26256 10.3232 4.73744 10.3232 5.03033 10.0303L7 8.06066L8.96967 10.0303C9.26256 10.3232 9.73744 10.3232 10.0303 10.0303C10.3232 9.73744 10.3232 9.26256 10.0303 8.96967L8.06066 7L10.0303 5.03033C10.3232 4.73744 10.3232 4.26256 10.0303 3.96967C9.73744 3.67678 9.26256 3.67678 8.96967 3.96967L7 5.93934L5.03033 3.96967Z"
        stroke="none"
      />
    </svg>
  );
};

export const duplicate = () => {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-label="Duplicate"
      fill="#95a2b3"
      className="color-override sc-eJNOVp bGuMmM"
      width={16}
    >
      <title>Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM5.03033 3.96967C4.73744 3.67678 4.26256 3.67678 3.96967 3.96967C3.67678 4.26256 3.67678 4.73744 3.96967 5.03033L5.93934 7L3.96967 8.96967C3.67678 9.26256 3.67678 9.73744 3.96967 10.0303C4.26256 10.3232 4.73744 10.3232 5.03033 10.0303L7 8.06066L8.96967 10.0303C9.26256 10.3232 9.73744 10.3232 10.0303 10.0303C10.3232 9.73744 10.3232 9.26256 10.0303 8.96967L8.06066 7L10.0303 5.03033C10.3232 4.73744 10.3232 4.26256 10.0303 3.96967C9.73744 3.67678 9.26256 3.67678 8.96967 3.96967L7 5.93934L5.03033 3.96967Z"
        stroke="none"
      />
    </svg>
  );
};

export const noPriority = () => {
  return (
    <svg viewBox="0 0 16 16" aria-label="No Priority" fill="#e2e2e2">
      <title>Icon</title>
      <rect x="1" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9" />
      <rect x="6" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9" />
      <rect
        x="11"
        y="7.25"
        width="3"
        height="1.5"
        rx="0.5"
        // opacity="1.4"
      />
    </svg>
  );
};

export const urgent = () => {
  return (
    <svg viewBox="0 0 16 16" fill="#F2994A" aria-label="Urgent Priority">
      <title>Icon</title>
      <path d="M3 1.346a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2H3Zm3.914 3h1.738L8.5 9.948H7.07l-.156-5.602Zm1.809 7.164a.95.95 0 0 1-.938.938.934.934 0 1 1 0-1.867c.5 0 .934.417.938.929Z" />
    </svg>
  );
};

export const high = () => {
  return (
    <svg fill="#6B6F76" viewBox="0 0 16 16" aria-label="High Priority">
      <title>Icon</title>
      <rect x="1" y="8" width="3" height="6" rx="1" />
      <rect x="6" y="5" width="3" height="9" rx="1" />
      <rect x="11" y="2" width="3" height="12" rx="1" />
    </svg>
  );
};

export const medium = () => {
  return (
    <svg fill="#6B6F76" viewBox="0 0 16 16" aria-label="Medium Priority">
      <title>Icon</title>
      <rect x="1" y="8" width="3" height="6" rx="1" />
      <rect x="6" y="5" width="3" height="9" rx="1" />
      <rect x="11" y="2" width="3" height="12" rx="1" fillOpacity="0.4" />
    </svg>
  );
};

export const low = () => {
  return (
    <svg fill="#6B6F76" viewBox="0 0 16 16" aria-label="Low Priority">
      <title>Icon</title>
      <rect x="1" y="8" width="3" height="6" rx="1" />
      <rect x="6" y="5" width="3" height="9" rx="1" fillOpacity="0.4" />
      <rect x="11" y="2" width="3" height="12" rx="1" fillOpacity="0.4" />
    </svg>
  );
};

export const miniHigh = () => {
  return (
    <svg width="20px" height="20px" fill="#6B6F76" viewBox="0 0 16 16" aria-label="High Priority">
      <title>Icon</title>
      <rect x="1" y="8" width="3" height="6" rx="1" />
      <rect x="6" y="5" width="3" height="9" rx="1" />
      <rect x="11" y="2" width="3" height="12" rx="1" />
    </svg>
  );
};

export const miniMedium = () => {
  return (
    <svg width="20px" height="20px" fill="#6B6F76" viewBox="0 0 16 16" aria-label="Medium Priority">
      <title>Icon</title>
      <rect x="1" y="8" width="3" height="6" rx="1" />
      <rect x="6" y="5" width="3" height="9" rx="1" />
      <rect x="11" y="2" width="3" height="12" rx="1" fillOpacity="0.4" />
    </svg>
  );
};

export const miniLow = () => {
  return (
    <svg width="20px" height="20px" fill="#6B6F76" viewBox="0 0 16 16" aria-label="Low Priority">
      <title>Icon</title>
      <rect x="1" y="8" width="3" height="6" rx="1" />
      <rect x="6" y="5" width="3" height="9" rx="1" fillOpacity="0.4" />
      <rect x="11" y="2" width="3" height="12" rx="1" fillOpacity="0.4" />
    </svg>
  );
};
export const noAssignee = () => {
  return (
    <svg viewBox="0 0 16 16" fill="#DCD8FE93">
      <title>Icon</title>
      <path d="M8 4C6.89545 4 6 4.89545 6 6V6.5C6 7.60455 6.89545 8.5 8 8.5C9.10455 8.5 10 7.60455 10 6.5V6C10 4.89545 9.10455 4 8 4Z" />
      <path d="M5.15493 12.8571C4.48326 12.3982 4.54607 11.4539 5.12128 10.8787V10.8787C5.6839 10.316 6.44696 10 7.24255 10H8.75732C9.55292 10 10.316 10.3161 10.8786 10.8787V10.8787C11.4538 11.4539 11.5167 12.3982 10.845 12.8571C10.478 13.1079 10.0762 13.3079 9.65017 13.4499L9.59096 13.4697C8.55825 13.8139 7.44175 13.8139 6.40904 13.4697L6.3499 13.45C5.92382 13.3079 5.52198 13.1079 5.15493 12.8571Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9878 8.41658C14.9716 8.69225 14.7189 8.88531 14.445 8.84959L13.9492 8.78492C13.6754 8.7492 13.4847 8.49813 13.4956 8.2222C13.4985 8.14856 13.5 8.07449 13.5 8C13.5 7.92551 13.4985 7.85144 13.4956 7.7778C13.4847 7.50187 13.6754 7.2508 13.9492 7.21508L14.445 7.15041C14.7189 7.11469 14.9716 7.30775 14.9878 7.58342C14.9959 7.72124 15 7.86014 15 8C15 8.13986 14.9959 8.27876 14.9878 8.41658ZM14.2609 4.86589C14.3847 5.11273 14.2621 5.40623 14.007 5.51201L13.5451 5.70354C13.29 5.80932 12.9995 5.68696 12.8709 5.4426C12.8025 5.3127 12.729 5.18581 12.6507 5.0622C12.503 4.82892 12.5419 4.5161 12.7609 4.34784L13.1573 4.04317C13.3763 3.87491 13.6918 3.9151 13.8441 4.14548C13.9967 4.3764 14.136 4.61691 14.2609 4.86589ZM11.8545 2.1559C12.0849 2.30816 12.1251 2.62371 11.9568 2.84266L11.6522 3.23912C11.4839 3.45808 11.1711 3.49703 10.9378 3.34927C10.8142 3.27098 10.6873 3.19752 10.5574 3.12914C10.313 3.0005 10.1907 2.70997 10.2965 2.45489L10.488 1.99303C10.5938 1.73795 10.8873 1.61531 11.1341 1.73911C11.3831 1.86399 11.6236 2.00329 11.8545 2.1559ZM8.41658 1.01219C8.69225 1.02837 8.88531 1.28114 8.84959 1.55497L8.78492 2.05077C8.7492 2.32459 8.49813 2.5153 8.2222 2.50438C8.14856 2.50147 8.07449 2.5 8 2.5C7.92551 2.5 7.85144 2.50147 7.7778 2.50438C7.50187 2.5153 7.2508 2.32459 7.21508 2.05077L7.15041 1.55497C7.11469 1.28114 7.30775 1.02837 7.58342 1.01219C7.72124 1.0041 7.86014 1 8 1C8.13986 1 8.27876 1.0041 8.41658 1.01219ZM4.86589 1.73911C5.11273 1.61531 5.40623 1.73795 5.51201 1.99303L5.70354 2.45489C5.80932 2.70997 5.68696 3.0005 5.4426 3.12914C5.3127 3.19752 5.18581 3.27098 5.0622 3.34927C4.82892 3.49703 4.5161 3.45808 4.34784 3.23912L4.04317 2.84266C3.87491 2.62371 3.9151 2.30816 4.14548 2.1559C4.3764 2.00329 4.61691 1.86399 4.86589 1.73911ZM2.1559 4.14548C2.30816 3.9151 2.62371 3.87491 2.84266 4.04317L3.23912 4.34784C3.45808 4.5161 3.49703 4.82892 3.34927 5.0622C3.27098 5.18581 3.19752 5.3127 3.12914 5.44261C3.0005 5.68696 2.70997 5.80932 2.45489 5.70354L1.99303 5.51201C1.73795 5.40624 1.61531 5.11273 1.73911 4.86589C1.86399 4.61691 2.00329 4.3764 2.1559 4.14548ZM1.55497 7.15041C1.28114 7.11469 1.02837 7.30775 1.01219 7.58342C1.0041 7.72124 1 7.86014 1 8C1 8.13986 1.0041 8.27876 1.01219 8.41658C1.02837 8.69225 1.28114 8.88531 1.55497 8.84959L2.05077 8.78492C2.32459 8.7492 2.5153 8.49813 2.50438 8.2222C2.50147 8.14856 2.5 8.07449 2.5 8C2.5 7.92551 2.50147 7.85144 2.50438 7.7778C2.5153 7.50187 2.32459 7.2508 2.05077 7.21508L1.55497 7.15041ZM1.73911 11.1341C1.61531 10.8873 1.73795 10.5938 1.99303 10.488L2.45489 10.2965C2.70997 10.1907 3.0005 10.313 3.12914 10.5574C3.19752 10.6873 3.27098 10.8142 3.34927 10.9378C3.49703 11.1711 3.45808 11.4839 3.23912 11.6522L2.84266 11.9568C2.62371 12.1251 2.30816 12.0849 2.1559 11.8545C2.00329 11.6236 1.86399 11.3831 1.73911 11.1341ZM4.14548 13.8441C3.9151 13.6918 3.87491 13.3763 4.04317 13.1573L4.34784 12.7609C4.5161 12.5419 4.82892 12.503 5.0622 12.6507C5.18582 12.729 5.3127 12.8025 5.4426 12.8709C5.68696 12.9995 5.80932 13.29 5.70354 13.5451L5.51201 14.007C5.40624 14.2621 5.11273 14.3847 4.86589 14.2609C4.61691 14.136 4.3764 13.9967 4.14548 13.8441ZM7.58342 14.9878C7.30775 14.9716 7.11469 14.7189 7.15041 14.445L7.21508 13.9492C7.2508 13.6754 7.50187 13.4847 7.7778 13.4956C7.85144 13.4985 7.92551 13.5 8 13.5C8.07449 13.5 8.14856 13.4985 8.2222 13.4956C8.49813 13.4847 8.7492 13.6754 8.78492 13.9492L8.84959 14.445C8.88531 14.7189 8.69225 14.9716 8.41658 14.9878C8.27876 14.9959 8.13986 15 8 15C7.86014 15 7.72124 14.9959 7.58342 14.9878ZM11.1341 14.2609C10.8873 14.3847 10.5938 14.2621 10.488 14.007L10.2965 13.5451C10.1907 13.29 10.313 12.9995 10.5574 12.8709C10.6873 12.8025 10.8142 12.729 10.9378 12.6507C11.1711 12.503 11.4839 12.5419 11.6522 12.7609L11.9568 13.1573C12.1251 13.3763 12.0849 13.6918 11.8545 13.8441C11.6236 13.9967 11.3831 14.136 11.1341 14.2609ZM13.1573 11.9568C13.3763 12.1251 13.6918 12.0849 13.8441 11.8545C13.9967 11.6236 14.136 11.3831 14.2609 11.1341C14.3847 10.8873 14.2621 10.5938 14.007 10.488L13.5451 10.2965C13.29 10.1907 12.9995 10.313 12.8709 10.5574C12.8025 10.6873 12.729 10.8142 12.6507 10.9378C12.503 11.1711 12.5419 11.4839 12.7609 11.6522L13.1573 11.9568Z"
      />
    </svg>
  );
};

export const addSymbol = () => {
  return (
    <svg viewBox="0 0 16 16" fill="#858699" className="sc-ljyFIh hJVkjM">
      <title>Icon</title>
      <path d="M8.75 3C8.75 2.58579 8.41421 2.25 8 2.25C7.58579 2.25 7.25 2.58579 7.25 3V7.25H3C2.58579 7.25 2.25 7.58579 2.25 8C2.25 8.41421 2.58579 8.75 3 8.75H7.25V13C7.25 13.4142 7.58579 13.75 8 13.75C8.41421 13.75 8.75 13.4142 8.75 13V8.75H13C13.4142 8.75 13.75 8.41421 13.75 8C13.75 7.58579 13.4142 7.25 13 7.25H8.75V3Z" />
    </svg>
  );
};

export const project = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      stroke="none"
      fill="#9577FF"
      className="sc-UpCWa ejOORC color-override"
    >
      <title>Icon</title>
      <path d="M5.948 2H2.623A.623.623 0 0 0 2 2.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.279.623-.623V2.623A.623.623 0 0 0 5.948 2ZM13.377 2h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.279.623-.623V2.623A.623.623 0 0 0 13.377 2ZM5.948 9.429H2.623a.623.623 0 0 0-.623.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623ZM13.377 9.429h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623Z" />
    </svg>
  );
};

// End of SVGs for IssueSidebar

export const toggleNavBar = ({
  props,
}: {
  props?: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>;
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6B6F76" {...props}>
    <title>Icon</title>
    <path d="M15 5.25A3.25 3.25 0 0 0 11.75 2h-7.5A3.25 3.25 0 0 0 1 5.25v5.5A3.25 3.25 0 0 0 4.25 14h7.5A3.25 3.25 0 0 0 15 10.75v-5.5Zm-3.5 7.25H7v-9h4.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2Zm-6 0H4.25a1.75 1.75 0 0 1-1.75-1.75v-5.5c0-.966.784-1.75 1.75-1.75H5.5v9Z" />
  </svg>
);

export const toggleNavRight = (
  props: (React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) | undefined,
) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6B6F76" {...props}>
    <title>Icon</title>
    <g transform="translate(16, 0) scale(-1, 1)">
      <path d="M15 5.25A3.25 3.25 0 0 0 11.75 2h-7.5A3.25 3.25 0 0 0 1 5.25v5.5A3.25 3.25 0 0 0 4.25 14h7.5A3.25 3.25 0 0 0 15 10.75v-5.5Zm-3.5 7.25H7v-9h4.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2Zm-6 0H4.25a1.75 1.75 0 0 1-1.75-1.75v-5.5c0-.966.784-1.75 1.75-1.75H5.5v9Z" />
    </g>
  </svg>
);

// Filter Dropdown SVGs

export function aiFilter() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#FEFFFE"
        fillRule="evenodd"
        d="M15.264 10.964L12.38 8.08a4.525 4.525 0 10-1.14 1.14l2.885 2.885.002.002a.813.813 0 001.136 0l.002-.002a.806.806 0 000-1.14zM5.78 5.514a2.897 2.897 0 115.795.001 2.897 2.897 0 01-5.795 0z"
        clipRule="evenodd"
      />
      <path
        fill="#FEFFFE"
        d="M3.357 7.753a.26.26 0 01.254.209l.487 2.436 1.919.479a.26.26 0 010 .504l-1.919.48-.487 2.435a.26.26 0 01-.509 0l-.487-2.436-1.918-.48a.26.26 0 010-.503l1.918-.48.487-2.435a.26.26 0 01.255-.209zM6.473 12.427a.26.26 0 01.246.178l.219.656.656.219a.26.26 0 010 .492l-.656.219-.219.656a.26.26 0 01-.492 0l-.22-.656-.655-.219a.26.26 0 010-.492l.656-.22.219-.655a.26.26 0 01.246-.178z"
      />
    </svg>
  );
}

export function status() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="#DCD8FE93"
      aria-label="Backlog"
      viewBox="0 0 14 14"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M13.94 7.914l-1.982-.258a5.06 5.06 0 000-1.312l1.983-.258a7.054 7.054 0 010 1.828zM13.47 4.32a6.995 6.995 0 00-.915-1.581l-1.586 1.218c.265.345.485.724.653 1.13l1.848-.767zm-2.207-2.874l-1.22 1.586a4.991 4.991 0 00-1.129-.653L9.68.53c.569.236 1.1.545 1.582.915zM7.913.06l-.258 1.983a5.064 5.064 0 00-1.312 0L6.086.06a7.066 7.066 0 011.828 0zM4.32.531l.767 1.848a4.993 4.993 0 00-1.13.653L2.74 1.446A6.993 6.993 0 014.32.531zM1.446 2.74l1.586 1.218a4.993 4.993 0 00-.653 1.13L.53 4.32c.236-.569.545-1.1.915-1.581zM.06 6.086a7.066 7.066 0 000 1.828l1.983-.258a5.064 5.064 0 010-1.312L.06 6.086zM.531 9.68l1.848-.767c.168.406.388.785.653 1.13l-1.586 1.219A6.993 6.993 0 01.531 9.68zm2.208 2.874l1.218-1.586c.345.265.724.485 1.13.653L4.32 13.47a6.995 6.995 0 01-1.581-.915zm3.347 1.387l.258-1.983a5.06 5.06 0 001.312 0l.258 1.983a7.054 7.054 0 01-1.828 0zm3.594-.472l-.767-1.848a4.994 4.994 0 001.13-.653l1.219 1.586a6.995 6.995 0 01-1.582.915zm2.874-2.207l-1.586-1.22c.265-.344.485-.723.653-1.129l1.848.767c-.236.569-.545 1.1-.915 1.582z"
      />
    </svg>
  );
}

export function assignee() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M8 4a2 2 0 00-2 2v.5a2 2 0 004 0V6a2 2 0 00-2-2z"
      />
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        fillRule="evenodd"
        d="M8 15A7 7 0 108 1a7 7 0 000 14zm-2.879-4.121l-1.01 1.01a5.5 5.5 0 117.778 0l-1.01-1.01A3 3 0 008.757 10H7.243a3 3 0 00-2.122.879z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function creator() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M8 4a2 2 0 00-2 2v.5a2 2 0 004 0V6a2 2 0 00-2-2z"
      />
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        fillRule="evenodd"
        d="M8 15A7 7 0 108 1a7 7 0 000 14zm-2.879-4.121l-1.01 1.01a5.5 5.5 0 117.778 0l-1.01-1.01A3 3 0 008.757 10H7.243a3 3 0 00-2.122.879z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function priority() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <rect width="3" height="6" x="1" y="8" fill="#DCD8FE" fillOpacity="0.576" rx="1" />
      <rect width="3" height="9" x="6" y="5" fill="#DCD8FE" fillOpacity="0.576" rx="1" />
      <rect width="3" height="12" x="11" y="2" fill="#DCD8FE" fillOpacity="0.576" rx="1" />
    </svg>
  );
}

export function label() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        fillRule="evenodd"
        d="M10.21 4c.424 0 .803.189 1.03.48L14 8l-2.76 3.52c-.227.291-.606.48-1.03.48l-6.947-.006c-.695 0-1.263-.508-1.263-1.137V5.143c0-.629.568-1.137 1.263-1.137L10.21 4zm.915 5a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function content() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        fillRule="evenodd"
        d="M2.11 1.937C2 2.207 2 2.55 2 3.235v9.53c0 .685 0 1.027.11 1.298a1.5 1.5 0 00.827.827c.27.11.613.11 1.298.11h7.53c.685 0 1.027 0 1.298-.11a1.5 1.5 0 00.827-.827c.11-.27.11-.613.11-1.298v-9.53c0-.685 0-1.027-.11-1.298a1.5 1.5 0 00-.827-.827C12.793 1 12.45 1 11.765 1H4.235c-.685 0-1.027 0-1.298.11a1.5 1.5 0 00-.827.827zM12 3.5a.5.5 0 00-.5-.5h-7a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h.11a.5.5 0 00.485-.379l.33-1.318A.4.4 0 015.811 4H7.25v7a1 1 0 01-1 1h-.417a.833.833 0 00-.833.833c0 .092.075.167.167.167h5.666a.167.167 0 00.167-.167.833.833 0 00-.833-.833H9.75a1 1 0 01-1-1V4h1.438a.4.4 0 01.388.303l.33 1.318A.5.5 0 0011.39 6h.11a.5.5 0 00.5-.5v-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function projectFilter() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      className="sc-UpCWa kiPXzL"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M5.948 2H2.623A.623.623 0 002 2.623v3.325c0 .344.28.623.623.623h3.325a.623.623 0 00.623-.623V2.623A.623.623 0 005.948 2zm7.429 0h-3.325a.623.623 0 00-.623.623v3.325c0 .344.279.623.623.623h3.325A.623.623 0 0014 5.948V2.623A.623.623 0 0013.377 2zM5.948 9.429H2.623a.623.623 0 00-.623.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 00-.623-.623zm7.429 0h-3.325a.623.623 0 00-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 00-.623-.623z"
      />
    </svg>
  );
}

export function projectStatus() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        fillRule="evenodd"
        d="M12.5 5.361L8 2.736 3.5 5.361v5.277L8 13.263l4.5-2.625V5.361zm-3.744-3.92a1.5 1.5 0 00-1.512 0l-4.5 2.625A1.5 1.5 0 002 5.36v5.277a1.5 1.5 0 00.744 1.296l4.5 2.625a1.5 1.5 0 001.512 0l4.5-2.625A1.5 1.5 0 0014 10.638V5.361a1.5 1.5 0 00-.744-1.295l-4.5-2.625z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function roadMap() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M6 1v12l4 2V3.002L6 1zM5 13V1L1.403 3.046A.75.75 0 001 3.71v10.54a.75.75 0 001.136.643L5 13zM14.694 12.105L11 15V3.002l2.864-1.895A.75.75 0 0115 1.75v9.75a.75.75 0 01-.306.605z"
      />
    </svg>
  );
}

export function parentIssues() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        fillRule="evenodd"
        d="M11.111 1H4.89l-.207.005C2.631 1.111 1 2.781 1 4.826v6.348l.005.203C1.113 13.396 2.81 15 4.89 15h.26l.105-.007a.77.77 0 00.672-.758.772.772 0 00-.778-.766h-.26l-.159-.005c-1.214-.08-2.173-1.075-2.173-2.29V4.826l.005-.157c.082-1.194 1.093-2.138 2.328-2.138h6.222l.16.005c1.214.08 2.18 1.075 2.18 2.29v.104a.774.774 0 00.771.662c.43 0 .778-.343.778-.766l-.005-.203C14.887 2.604 13.19 1 11.11 1zm3.857 8.903a.295.295 0 00-.038-.325l-2.025-2.462a.326.326 0 00-.484-.015l-2.314 2.461a.303.303 0 00-.082.207c0 .17.142.308.318.308h1.122c-.155 3.783-3.159 4.305-3.198 4.312a.311.311 0 00-.267.303v.025c.013.16.152.284.318.283.054 0 5.305-.058 5.518-4.923h.845a.32.32 0 00.287-.174z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function subIssues() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M10.25 8a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 100 1.5h.75v.75c0 .414.336.75.75.75zM5 8.75a.75.75 0 111.5 0v.75h.75a.75.75 0 110 1.5h-1.5a.75.75 0 01-.75-.75v-1.5z"
      />
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M12 1a3 3 0 013 3v4a3 3 0 01-3 3h-1v1a3 3 0 01-3 3H4a3 3 0 01-3-3V8a3 3 0 013-3h1V4a3 3 0 013-3h4zm-2.5 9a.5.5 0 01.5-.5h2A1.5 1.5 0 0013.5 8V4A1.5 1.5 0 0012 2.5H8A1.5 1.5 0 006.5 4v2a.5.5 0 01-.5.5H4A1.5 1.5 0 002.5 8v4A1.5 1.5 0 004 13.5h4A1.5 1.5 0 009.5 12v-2z"
      />
    </svg>
  );
}

export function blockedIssues() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M8.387 9a.6.6 0 01.6.6l-.002.999c2.177.264 7.002.997 7.002 1.403 0 .311-2.334.768-7 1.371v1.115a.6.6 0 01-1.001.446l-2.887-2.592a.4.4 0 010-.595l2.887-2.593a.6.6 0 01.4-.153zM2.75 1.04a.75.75 0 01.743.648l.007.102v12.476a.75.75 0 01-1.493.102L2 14.266V1.79a.75.75 0 01.75-.75zm2.343-.023l.077.027 7.535 3.375a.5.5 0 01.094.858l-.082.05L5.183 8.95a.5.5 0 01-.71-.368l-.007-.083V1.501a.5.5 0 01.627-.484z"
      />
    </svg>
  );
}

export function blockingIssues() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M12.566 9a.6.6 0 01.4.154l2.888 2.593a.4.4 0 010 .595l-2.887 2.592a.6.6 0 01-1.001-.446v-1.114c-4.667-.604-7-1.06-7-1.372 0-.406 4.825-1.139 7.001-1.403l-.001-.998a.6.6 0 01.6-.6zM2.75 1.04a.75.75 0 01.743.648l.007.102v12.476a.75.75 0 01-1.493.102L2 14.266V1.79a.75.75 0 01.75-.75zm2.343-.023l.077.027 7.535 3.375a.5.5 0 01.094.858l-.082.05L5.183 8.95a.5.5 0 01-.71-.368l-.007-.083V1.501a.5.5 0 01.627-.484z"
      />
    </svg>
  );
}

export function issuesWithReferences() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M5.378 7.5a.6.6 0 01.6.6l-.002 1.774c2.375.224 8.027.917 8.027 1.328 0 .311-2.675.796-8.024 1.453l-.001 1.747a.6.6 0 01-.992.454L1.14 11.548a.4.4 0 010-.607l3.848-3.297a.6.6 0 01.39-.144zm4.79-6.291a.6.6 0 01.846-.064l3.847 3.309a.4.4 0 010 .607l-3.848 3.296a.6.6 0 01-.99-.455V6.128C7.65 5.904 1.998 5.21 1.998 4.799c0-.31 2.675-.795 8.024-1.452l.001-1.747a.6.6 0 01.145-.391z"
      />
    </svg>
  );
}

export function duplicates() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M10.82 3.151l3.805 1.956c.362.186.388.422.371.547l-1.819 3.32s-.27.207-.662-.027L9.086 6.898a.154.154 0 00-.215.061l-.148.29a.152.152 0 000 .14l3.183 6.218a.61.61 0 11-1.088.557L7.13 6.96a.153.153 0 00-.156-.082.155.155 0 00-.06.02L3.485 8.947c-.391.234-.61.068-.661.027-.089-.08-1.8-3.2-1.82-3.317-.017-.125.01-.364.371-.548l3.806-1.956-.14-.272a.611.611 0 011.089-.557L7.865 5.71A.151.151 0 008 5.794a.153.153 0 00.137-.083l1.734-3.39a.611.611 0 011.088.558l-.14.272z"
      />
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M4.094 13.608a.611.611 0 101.088.557L7.622 9.4a.155.155 0 000-.14l-.516-1.005a.153.153 0 00-.272 0l-2.74 5.352z"
      />
    </svg>
  );
}

export function dueDate() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M11 1a4 4 0 014 4v6a4 4 0 01-4 4H5a4 4 0 01-4-4V5a4 4 0 014-4h6zm2.5 5h-11v5A2.5 2.5 0 005 13.5h6a2.5 2.5 0 002.5-2.5V6z"
      />
    </svg>
  );
}

export function createdDate() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M11 1a4 4 0 014 4v1.25a.75.75 0 01-1.5 0V6h-11v5A2.5 2.5 0 005 13.5h1.25a.75.75 0 010 1.5H5a4 4 0 01-4-4V5a4 4 0 014-4h6z"
      />
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M13.263 8.138l-3.885 3.91a2.594 2.594 0 011.672 1.547l3.826-3.847c.293-.266.008-1.107-.258-1.37-.279-.275-1.103-.552-1.355-.24zM10.25 14.364a1.622 1.622 0 00-1.587-1.456c-.247.491-.5 1.249-.65 1.73a.277.277 0 00.329.355c.56-.127 1.48-.363 1.909-.63z"
      />
    </svg>
  );
}

export function updatedDate() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        fillRule="evenodd"
        d="M15 5a4 4 0 00-4-4H5a4 4 0 00-4 4v6a4 4 0 004 4h1.25a.75.75 0 000-1.5H5A2.5 2.5 0 012.5 11V6h11v.25a.75.75 0 001.5 0V5zm-4 2.25a.75.75 0 000 1.5A2.25 2.25 0 0113.25 11h-.61a.4.4 0 00-.25.712l1.36 1.088a.4.4 0 00.5 0l1.36-1.088a.4.4 0 00-.25-.712h-.61A3.75 3.75 0 0011 7.25zM6.64 11h.61A3.75 3.75 0 0011 14.75a.75.75 0 000-1.5A2.25 2.25 0 018.75 11h.61a.4.4 0 00.25-.712L8.25 9.2a.4.4 0 00-.5 0l-1.36 1.088a.4.4 0 00.25.712z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function startedDate() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M11 1a4 4 0 014 4v1.25a.75.75 0 01-1.5 0V6h-11v5A2.5 2.5 0 005 13.5h1.25a.75.75 0 010 1.5H5a4 4 0 01-4-4V5a4 4 0 014-4h6z"
      />
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M13.263 8.138l-3.885 3.91a2.594 2.594 0 011.672 1.547l3.826-3.847c.293-.266.008-1.107-.258-1.37-.279-.275-1.103-.552-1.355-.24zM10.25 14.364a1.622 1.622 0 00-1.587-1.456c-.247.491-.5 1.249-.65 1.73a.277.277 0 00.329.355c.56-.127 1.48-.363 1.909-.63z"
      />
    </svg>
  );
}

export function autoClosed() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="#DCD8FE93"
      aria-label="Canceled"
      viewBox="0 0 14 14"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        fillRule="evenodd"
        d="M7 14A7 7 0 107 0a7 7 0 000 14zM5.03 3.97a.75.75 0 00-1.06 1.06L5.94 7 3.97 8.97a.75.75 0 101.06 1.06L7 8.06l1.97 1.97a.75.75 0 101.06-1.06L8.06 7l1.97-1.97a.75.75 0 10-1.06-1.06L7 5.94 5.03 3.97z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function close() {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        {' '}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
          fill="#bababa"
        />{' '}
      </g>
    </svg>
  );
}

export function subscriber() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        d="M6 13h4a2 2 0 01-3.995.15L6 13h4-4zM8 1a4 4 0 014 4v3.03l1.684 1.578a1 1 0 01.316.73V11a1 1 0 01-1 1H3a1 1 0 01-1-1v-.662a1 1 0 01.316-.73L4 8.03V5a4 4 0 014-4z"
      />
    </svg>
  );
}

export function links() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#DCD8FE93"
      viewBox="0 0 16 16"
    >
      <title>Icon</title>
      <path
        fill="#DCD8FE"
        fillOpacity="0.576"
        fillRule="evenodd"
        d="M11.111 1H4.89l-.207.005C2.631 1.111 1 2.781 1 4.826v6.348l.005.203C1.113 13.396 2.81 15 4.89 15h.26l.105-.007a.77.77 0 00.672-.758.772.772 0 00-.778-.766h-.26l-.159-.005c-1.214-.08-2.173-1.075-2.173-2.29V4.826l.005-.157c.082-1.194 1.093-2.138 2.328-2.138h6.222l.16.005c1.214.08 2.18 1.075 2.18 2.29v.104a.774.774 0 00.771.662c.43 0 .778-.343.778-.766l-.005-.203C14.887 2.604 13.19 1 11.11 1zM9.146 7.745a.693.693 0 00.064.92.72.72 0 001.008 0l.45-.444.101-.091a1.682 1.682 0 012.25.09c.65.64.65 1.675 0 2.314l-.45.444-.064.071a.693.693 0 00.063.92.72.72 0 001.008 0l.451-.444.12-.125a3.002 3.002 0 00-.12-4.17 3.123 3.123 0 00-4.366 0l-.45.443-.065.072zm2.824 5.795a.693.693 0 00-.064-.92.72.72 0 00-1.007 0l-.451.444-.1.09a1.682 1.682 0 01-2.251-.09 1.617 1.617 0 010-2.313l.45-.444.064-.072a.693.693 0 00-.063-.92.72.72 0 00-1.008 0l-.45.444-.121.126a3.002 3.002 0 00.12 4.17 3.123 3.123 0 004.366 0l.451-.444.064-.071zm.227-4.408a.757.757 0 010 1.082l-2.074 2.041a.787.787 0 01-1.1 0 .757.757 0 010-1.082l2.074-2.04a.787.787 0 011.1 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function filterBacklog() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="#bec2c8"
      aria-label="Backlog"
      className="color-override"
      viewBox="0 0 14 14"
    >
      <title>Icon</title>
      <path
        fill="#BEC2C8"
        d="M13.94 7.914l-1.982-.258a5.06 5.06 0 000-1.312l1.983-.258a7.054 7.054 0 010 1.828zM13.47 4.32a6.995 6.995 0 00-.915-1.581l-1.586 1.218c.265.345.485.724.653 1.13l1.848-.767zm-2.207-2.874l-1.22 1.586a4.991 4.991 0 00-1.129-.653L9.68.53c.569.236 1.1.545 1.582.915zM7.913.06l-.258 1.983a5.064 5.064 0 00-1.312 0L6.086.06a7.066 7.066 0 011.828 0zM4.32.531l.767 1.848a4.993 4.993 0 00-1.13.653L2.74 1.446A6.993 6.993 0 014.32.531zM1.446 2.74l1.586 1.218a4.993 4.993 0 00-.653 1.13L.53 4.32c.236-.569.545-1.1.915-1.581zM.06 6.086a7.066 7.066 0 000 1.828l1.983-.258a5.064 5.064 0 010-1.312L.06 6.086zM.531 9.68l1.848-.767c.168.406.388.785.653 1.13l-1.586 1.219A6.993 6.993 0 01.531 9.68zm2.208 2.874l1.218-1.586c.345.265.724.485 1.13.653L4.32 13.47a6.995 6.995 0 01-1.581-.915zm3.347 1.387l.258-1.983a5.06 5.06 0 001.312 0l.258 1.983a7.054 7.054 0 01-1.828 0zm3.594-.472l-.767-1.848a4.994 4.994 0 001.13-.653l1.219 1.586a6.995 6.995 0 01-1.582.915zm2.874-2.207l-1.586-1.22c.265-.344.485-.723.653-1.129l1.848.767c-.236.569-.545 1.1-.915 1.582z"
      />
    </svg>
  );
}

export function filterTodo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      aria-label="Todo"
      className="color-override"
      viewBox="0 0 14 14"
    >
      <title>Icon</title>
      <rect width="12" height="12" x="1" y="1" stroke="#E2E2E2" strokeWidth="2" rx="6" />
      <path fill="#E2E2E2" d="M7 7V3.5z" />
    </svg>
  );
}

export function filterInProgress() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      aria-label="In Progress"
      className="color-override"
      viewBox="0 0 14 14"
    >
      <title>Icon</title>
      <rect width="12" height="12" x="1" y="1" stroke="#F2C94C" strokeWidth="2" rx="6" />
      <path fill="#F2C94C" d="M7 7V3.5a3.5 3.5 0 010 7z" />
    </svg>
  );
}

export function filterDone() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <g clipPath="url(#clip0_1473_20082)">
        <circle cx="8" cy="8" r="7" stroke="#7394FF" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM11.9049 6.5308C12.198 6.23816 12.1984 5.76329 11.9058 5.47014C11.6132 5.17699 11.1383 5.17657 10.8451 5.4692L7.12297 9.18481L5.53033 7.59217C5.23744 7.29928 4.76256 7.29928 4.46967 7.59217C4.17678 7.88506 4.17678 8.35994 4.46967 8.65283L6.59217 10.7753C6.88488 11.068 7.35939 11.0682 7.65236 10.7758L11.9049 6.5308Z"
          fill="#7394FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_1473_20082">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function filterCancelled() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="#95a2b3"
      aria-label="Canceled"
      className="color-override"
      viewBox="0 0 14 14"
    >
      <title>Icon</title>
      <path
        fill="#95A2B3"
        fillRule="evenodd"
        d="M7 14A7 7 0 107 0a7 7 0 000 14zM5.03 3.97a.75.75 0 00-1.06 1.06L5.94 7 3.97 8.97a.75.75 0 101.06 1.06L7 8.06l1.97 1.97a.75.75 0 101.06-1.06L8.06 7l1.97-1.97a.75.75 0 10-1.06-1.06L7 5.94 5.03 3.97z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// End Filter Dropdown SVG

export const saveView = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#858699">
    <title>Icon</title>
    <path
      fillRule="evenodd"
      d="m1.894 8.895 4.722 3.176a2.492 2.492 0 0 0 2.783-.002l4.709-3.172.409.263a1 1 0 0 1 .208.177l.084.109a1 1 0 0 1-.182 1.316l-.093.07-5.97 3.998a1 1 0 0 1-.997.067l-.116-.067-5.983-3.998a1 1 0 0 1-.078-1.605l.095-.068.41-.264ZM8.421 1.1l.115.065 6.013 3.96a.999.999 0 0 1 .102 1.593l-.093.07-5.993 4.037-.003.001h.002a.993.993 0 0 1-.33.144l-.048.01a.966.966 0 0 1-.243.014l-.13-.017-.033-.007a.996.996 0 0 1-.33-.144l-4.18-2.81-1.828-1.23a1 1 0 0 1-.196-.173l-.08-.105a1 1 0 0 1 .19-1.315l.093-.07 5.986-3.957A1 1 0 0 1 8.42 1.1Zm-.54 1.903a.75.75 0 0 0-.644.745l.003 1.505H5.76l-.102.007a.75.75 0 0 0-.647.743l.007.102c.05.365.363.647.741.647h1.485l.005 1.51.007.102c.05.365.365.646.743.645l.102-.007a.75.75 0 0 0 .645-.744L8.74 6.751l1.514.001.102-.007a.75.75 0 0 0 .647-.742l-.007-.102a.749.749 0 0 0-.742-.647H8.737l-.004-1.51-.007-.102a.749.749 0 0 0-.743-.646l-.102.007Z"
      clipRule="evenodd"
    />
  </svg>
);

export const saveFilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="#9b9ba9"
    className="sc-UpCWa fArOsr sc-jTMoxg epgAwZ color-override"
    viewBox="0 0 16 16"
  >
    <title>Icon</title>
    <path
      fill="#BEC2C8"
      fillRule="evenodd"
      d="M8.76 5.5H7.24c-.605 0-.965.001-1.231.024-.129.01-.198.024-.23.032a.129.129 0 0 0-.035.015.5.5 0 0 0-.173.173.129.129 0 0 0-.015.034 1.527 1.527 0 0 0-.032.23C5.5 6.276 5.5 6.636 5.5 7.24v1.52c0 .605.001.965.024 1.231.01.129.024.198.032.23a.13.13 0 0 0 .015.036.5.5 0 0 0 .173.172c.01.007.022.012.034.015.033.008.102.021.23.032.267.023.627.024 1.232.024h1.52c.605 0 .965-.001 1.231-.024.129-.01.198-.024.23-.032a.127.127 0 0 0 .036-.015.5.5 0 0 0 .172-.172.126.126 0 0 0 .015-.035c.008-.033.021-.102.032-.23.023-.267.024-.627.024-1.232V7.24c0-.605-.001-.965-.024-1.231a1.529 1.529 0 0 0-.032-.23.126.126 0 0 0-.015-.035.5.5 0 0 0-.172-.173.13.13 0 0 0-.035-.015 1.526 1.526 0 0 0-.23-.032C9.724 5.5 9.364 5.5 8.76 5.5Zm-4.528-.436C4 5.504 4 6.082 4 7.24v1.52c0 1.158 0 1.737.232 2.176a2 2 0 0 0 .832.832C5.504 12 6.082 12 7.24 12h1.52c1.158 0 1.737 0 2.176-.232a2 2 0 0 0 .832-.832C12 10.496 12 9.918 12 8.76V7.24c0-1.158 0-1.737-.232-2.176a2 2 0 0 0-.832-.832C10.496 4 9.918 4 8.76 4H7.24c-1.158 0-1.737 0-2.176.232a2 2 0 0 0-.832.832Z"
      clipRule="evenodd"
    />
    <path
      fill="#BEC2C8"
      fillRule="evenodd"
      d="M14.25 5.75H11.2a.2.2 0 0 1-.2-.2v-1.1c0-.11.09-.2.2-.2h3.05a.75.75 0 0 1 0 1.5ZM14.25 11.75H11.2a.2.2 0 0 1-.2-.2v-1.1c0-.11.09-.2.2-.2h3.05a.75.75 0 0 1 0 1.5ZM14.25 8.75H11.2a.2.2 0 0 1-.2-.2v-1.1c0-.11.09-.2.2-.2h3.05a.75.75 0 0 1 0 1.5Z"
      clipRule="evenodd"
    />
    <path
      fill="#BEC2C8"
      fillRule="evenodd"
      d="M10.25 14.25V11.2c0-.11.09-.2.2-.2h1.1c.11 0 .2.09.2.2v3.05a.75.75 0 0 1-1.5 0ZM4.25 14.25V11.2c0-.11.09-.2.2-.2h1.1c.11 0 .2.09.2.2v3.05a.75.75 0 0 1-1.5 0ZM7.25 14.25V11.2c0-.11.09-.2.2-.2h1.1c.11 0 .2.09.2.2v3.05a.75.75 0 0 1-1.5 0ZM5.75 1.75V4.8a.2.2 0 0 1-.2.2h-1.1a.2.2 0 0 1-.2-.2V1.75a.75.75 0 0 1 1.5 0ZM11.75 1.75V4.8a.2.2 0 0 1-.2.2h-1.1a.2.2 0 0 1-.2-.2V1.75a.75.75 0 0 1 1.5 0ZM8.75 1.75V4.8a.2.2 0 0 1-.2.2h-1.1a.2.2 0 0 1-.2-.2V1.75a.75.75 0 0 1 1.5 0Z"
      clipRule="evenodd"
    />
    <path
      fill="#BEC2C8"
      fillRule="evenodd"
      d="M1.75 10.25H4.8c.11 0 .2.09.2.2v1.1a.2.2 0 0 1-.2.2H1.75a.75.75 0 0 1 0-1.5ZM1.75 4.25H4.8c.11 0 .2.09.2.2v1.1a.2.2 0 0 1-.2.2H1.75a.75.75 0 0 1 0-1.5ZM1.75 7.25H4.8c.11 0 .2.09.2.2v1.1a.2.2 0 0 1-.2.2H1.75a.75.75 0 0 1 0-1.5Z"
      clipRule="evenodd"
    />
    <path
      fill="#BEC2C8"
      d="M7 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Z"
    />
  </svg>
);

export const lock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#9b9ba9">
    <title>Icon</title>
    <path
      fill="#E4E4F3"
      fillRule="evenodd"
      d="M11 7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6ZM8 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0-8a3 3 0 0 1 3 3v2H9.5V4a1.5 1.5 0 1 0-3 0v2H5V4a3 3 0 0 1 3-3Z"
      clipRule="evenodd"
    />
  </svg>
);

export const miniBackChevron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    height={10}
    width={10}
  >
    <title>Icon</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const plusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#858699"
    className="sc-jGHpYF jUemOD"
  >
    <title>Icon</title>
    <path d="M8.75 3a.75.75 0 0 0-1.5 0v4.25H3a.75.75 0 0 0 0 1.5h4.25V13a.75.75 0 0 0 1.5 0V8.75H13a.75.75 0 0 0 0-1.5H8.75V3Z" />
  </svg>
);

export const cancelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#DCD8FE93">
    <title>Icon</title>
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      fillRule="evenodd"
      d="M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Z"
      clipRule="evenodd"
    />
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      fillRule="evenodd"
      d="m3.502 11.44 9-8 .996 1.12-9 8-.996-1.12Z"
      clipRule="evenodd"
    />
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      fillRule="evenodd"
      d="M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Z"
      clipRule="evenodd"
    />
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      fillRule="evenodd"
      d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-7 5.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
      clipRule="evenodd"
    />
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      fillRule="evenodd"
      d="m3.502 11.44 9-8 .996 1.12-9 8-.996-1.12Z"
      clipRule="evenodd"
    />
  </svg>
);

export const magnifyingGlass = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#858699" viewBox="1 1 13 13">
    <title>Icon</title>
    <path
      fillRule="evenodd"
      d="M9.5 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-.252 3.309a4 4 0 1 1 1.06-1.06l2.472 2.47a.75.75 0 1 1-1.06 1.061L9.248 10.31Z"
      clipRule="evenodd"
    />
  </svg>
);

export const stackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#858699"
    className="sc-byhhpF haMnMm"
  >
    <title>Icon</title>
    <path
      fillRule="evenodd"
      d="m12.654 10.795 2.1.826a.4.4 0 0 1 .073.707l-.072.038-6.399 2.526a1 1 0 0 1-.615.039l-.12-.04-6.368-2.526a.4.4 0 0 1-.072-.706l.072-.038 2.09-.825 3.726 1.48c.59.233 1.246.234 1.836 0l3.75-1.48Zm0-4.018 2.1.826a.4.4 0 0 1 .073.707l-.072.037L10.6 9.988l-.981.387-1.263.5-.039.011-.081.027a.986.986 0 0 1-.372.023l-.123-.023-.12-.04-1.23-.488-1.002-.397-4.136-1.641a.4.4 0 0 1-.072-.707l.072-.037 2.09-.825L7.07 8.257c.59.234 1.246.234 1.836.001l3.75-1.481ZM7.622 1.07a1 1 0 0 1 .733 0l6.4 2.515a.4.4 0 0 1 0 .744L10.6 5.969l-2.244.887-.081.028a1.008 1.008 0 0 1-.411.034l-.123-.024-.12-.039L1.252 4.33a.4.4 0 0 1 0-.744L7.622 1.07Z"
      clipRule="evenodd"
    />
  </svg>
);

export const Ellipsis = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill={className}>
    <title>Icon</title>
    <path d="M3 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
  </svg>
);

export const ellipsisTwo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#858699">
    <title>Icon</title>
    <path
      fill="#EEEFFC"
      d="M3 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
    />
  </svg>
);

export const downChevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="#858699">
    <title>Icon</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
      fill="#858699"
    />
  </svg>
);

export const upChevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="#858699">
    <title>Icon</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"
      fill="#858699"
    />
  </svg>
);

export const rightChevron = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      className="w-3 h-3 stroke-gray-500"
    >
      <title>Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
};

export const largeRightChevron = () => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        {' '}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.29289 4.29289C8.68342 3.90237 9.31658 3.90237 9.70711 4.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L9.70711 19.7071C9.31658 20.0976 8.68342 20.0976 8.29289 19.7071C7.90237 19.3166 7.90237 18.6834 8.29289 18.2929L14.5858 12L8.29289 5.70711C7.90237 5.31658 7.90237 4.68342 8.29289 4.29289Z"
          fill="#bababa"
        />{' '}
      </g>
    </svg>
  );
};

export const editView = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#DCD8FE93">
    <title>Icon</title>
    <path
      fill="#FEFFFE"
      d="M10.18 3.342 4.143 9.416a4.031 4.031 0 0 1 2.598 2.402l5.948-5.975a7.495 7.495 0 0 1-2.508-2.501ZM13.74 4.716a1.8 1.8 0 0 0-.255-2.194 1.744 1.744 0 0 0-2.187-.246 5.993 5.993 0 0 0 2.441 2.44ZM3.031 10.75a2.52 2.52 0 0 1 2.467 2.261c-.665.415-2.096.781-2.967.978a.43.43 0 0 1-.51-.552c.232-.747.625-1.923 1.01-2.687Z"
    />
  </svg>
);

export const duplicateView = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#DCD8FE93">
    <title>Icon</title>
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      fillRule="evenodd"
      d="m1.894 8.895 4.722 3.176a2.492 2.492 0 0 0 2.783-.002l4.709-3.172.409.263a1 1 0 0 1 .208.177l.084.109a1 1 0 0 1-.182 1.316l-.093.07-5.97 3.998a1 1 0 0 1-.997.067l-.116-.067-5.983-3.998a1 1 0 0 1-.078-1.605l.095-.068.41-.264ZM8.421 1.1l.115.065 6.013 3.96a.999.999 0 0 1 .102 1.593l-.093.07-5.993 4.037-.003.001h.002a.993.993 0 0 1-.33.144l-.048.01a.966.966 0 0 1-.243.014l-.13-.017-.033-.007a.996.996 0 0 1-.33-.144l-4.18-2.81-1.828-1.23a1 1 0 0 1-.196-.173l-.08-.105a1 1 0 0 1 .19-1.315l.093-.07 5.986-3.957A1 1 0 0 1 8.42 1.1Zm-.54 1.903a.75.75 0 0 0-.644.745l.003 1.505H5.76l-.102.007a.75.75 0 0 0-.647.743l.007.102c.05.365.363.647.741.647h1.485l.005 1.51.007.102c.05.365.365.646.743.645l.102-.007a.75.75 0 0 0 .645-.744L8.74 6.751l1.514.001.102-.007a.75.75 0 0 0 .647-.742l-.007-.102a.749.749 0 0 0-.742-.647H8.737l-.004-1.51-.007-.102a.749.749 0 0 0-.743-.646l-.102.007Z"
      clipRule="evenodd"
    />
  </svg>
);

export const changeViewOwner = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#DCD8FE93">
    <title>Icon</title>
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      d="M8 4a2 2 0 0 0-2 2v.5a2 2 0 0 0 4 0V6a2 2 0 0 0-2-2ZM5.155 12.857c-.672-.459-.609-1.403-.034-1.978A3 3 0 0 1 7.243 10h1.514a3 3 0 0 1 2.122.879c.575.575.638 1.52-.034 1.978-.367.25-.769.45-1.195.593l-.059.02a5.032 5.032 0 0 1-3.182 0l-.06-.02a4.822 4.822 0 0 1-1.194-.593Z"
    />
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      fillRule="evenodd"
      d="M14.988 8.417a.473.473 0 0 1-.543.433l-.496-.065a.537.537 0 0 1-.453-.563 5.646 5.646 0 0 0 0-.444.537.537 0 0 1 .453-.563l.496-.065a.473.473 0 0 1 .543.433 7.1 7.1 0 0 1 0 .834Zm-.727-3.551a.473.473 0 0 1-.254.646l-.462.192a.538.538 0 0 1-.674-.261 5.497 5.497 0 0 0-.22-.38.538.538 0 0 1 .11-.715l.396-.305a.473.473 0 0 1 .687.102c.153.231.292.472.417.72Zm-2.406-2.71c.23.152.27.468.102.687l-.305.396a.538.538 0 0 1-.714.11 5.49 5.49 0 0 0-.38-.22.538.538 0 0 1-.261-.674l.191-.462a.473.473 0 0 1 .646-.254c.25.125.49.264.72.417ZM8.416 1.012a.473.473 0 0 1 .433.543l-.065.496a.537.537 0 0 1-.563.453 5.627 5.627 0 0 0-.444 0 .537.537 0 0 1-.563-.453l-.065-.496a.473.473 0 0 1 .433-.543 7.109 7.109 0 0 1 .834 0Zm-3.551.727a.473.473 0 0 1 .646.254l.192.462a.538.538 0 0 1-.261.674c-.13.069-.257.142-.38.22a.537.537 0 0 1-.715-.11l-.305-.396a.473.473 0 0 1 .102-.687c.231-.153.472-.292.72-.417Zm-2.71 2.406a.473.473 0 0 1 .687-.102l.396.305a.537.537 0 0 1 .11.714 5.49 5.49 0 0 0-.22.38.538.538 0 0 1-.674.262l-.462-.192a.473.473 0 0 1-.254-.646c.125-.25.264-.49.417-.72ZM1.555 7.15a.473.473 0 0 0-.543.433 7.109 7.109 0 0 0 0 .834.473.473 0 0 0 .543.433l.496-.065a.537.537 0 0 0 .453-.563 5.627 5.627 0 0 1 0-.444.537.537 0 0 0-.453-.563l-.496-.065Zm.184 3.984a.473.473 0 0 1 .254-.646l.462-.191a.538.538 0 0 1 .674.26c.069.13.142.257.22.38a.538.538 0 0 1-.11.715l-.396.305a.473.473 0 0 1-.687-.103 6.989 6.989 0 0 1-.417-.72Zm2.406 2.71a.473.473 0 0 1-.102-.687l.305-.396a.538.538 0 0 1 .714-.11 5.5 5.5 0 0 0 .38.22c.245.128.367.419.262.674l-.192.462a.473.473 0 0 1-.646.254 6.999 6.999 0 0 1-.72-.417Zm3.438 1.144a.473.473 0 0 1-.433-.543l.065-.496a.537.537 0 0 1 .563-.453 5.646 5.646 0 0 0 .444 0c.276-.011.527.18.563.453l.065.496a.473.473 0 0 1-.433.543 7.1 7.1 0 0 1-.834 0Zm3.551-.727a.473.473 0 0 1-.646-.254l-.191-.462a.538.538 0 0 1 .26-.674c.13-.069.257-.142.38-.22a.538.538 0 0 1 .715.11l.305.396a.473.473 0 0 1-.103.687c-.23.153-.47.292-.72.417Zm2.023-2.304a.473.473 0 0 0 .687-.103c.153-.23.292-.47.417-.72a.473.473 0 0 0-.254-.646l-.462-.191a.538.538 0 0 0-.674.26c-.069.13-.142.257-.22.38a.538.538 0 0 0 .11.715l.396.305Z"
      clipRule="evenodd"
    />
  </svg>
);

export const rightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#858699"
    className="sc-gikAfH sc-gKelgU ddfjha cFHOBO"
  >
    <title>Icon</title>
    <path d="M7.002 10.624a.5.5 0 0 1-.752-.432V5.808a.5.5 0 0 1 .752-.432l3.758 2.192a.5.5 0 0 1 0 .864l-3.758 2.192Z" />
  </svg>
);

export const viewVisibility = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#DCD8FE93">
    <title>Icon</title>
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      d="M1 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v.5H6A2.5 2.5 0 0 0 3.5 6v5H3a2 2 0 0 1-2-2V3Z"
    />
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      fillRule="evenodd"
      d="M7 5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm3 5c.966 0 1.5-.784 1.5-1.75S10.966 6.5 10 6.5s-1.5.784-1.5 1.75S9.034 10 10 10Zm-3 2.562A1.61 1.61 0 0 1 9 11a1.202 1.202 0 0 0 2 0 1.61 1.61 0 0 1 2 1.562v.448c0 .27-.22.49-.49.49H7.49a.49.49 0 0 1-.49-.49v-.448Z"
      clipRule="evenodd"
    />
  </svg>
);

export const favoriteView = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#858699"
    className="sc-cLxlbw TEoTb"
  >
    <title>Icon</title>
    <path
      fill="#4C4F6B"
      d="M10.52 4.99 9.46 2.017a1.56 1.56 0 0 0-2.344-.743c-.26.18-.46.434-.572.73L5.482 4.99H2.555a1.56 1.56 0 0 0-1.46 1.017 1.541 1.541 0 0 0 .465 1.72l2.525 2.077-1.061 3.156a1.542 1.542 0 0 0 .56 1.744 1.559 1.559 0 0 0 1.83-.002l2.587-1.88 2.584 1.88a1.559 1.559 0 0 0 2.398-.776c.102-.315.1-.653-.006-.966l-1.061-3.158 2.528-2.078a1.54 1.54 0 0 0 .506-1.574l-.048-.152a1.552 1.552 0 0 0-1.454-1.008h-2.929Zm2.979 1.558a.047.047 0 0 1-.016.024l-2.778 2.284a1.016 1.016 0 0 0-.318 1.108l1.169 3.474a.042.042 0 0 1 0 .027.049.049 0 0 1-.018.024.06.06 0 0 1-.035.011.059.059 0 0 1-.035-.011L8.6 11.404a1.02 1.02 0 0 0-1.199 0l-2.868 2.085a.059.059 0 0 1-.035.01.059.059 0 0 1-.035-.01.049.049 0 0 1-.018-.024.041.041 0 0 1 0-.026l1.169-3.474a1.014 1.014 0 0 0-.318-1.107L2.516 6.57a.045.045 0 0 1-.015-.022.041.041 0 0 1 .002-.026.049.049 0 0 1 .018-.023.06.06 0 0 1 .034-.01h3.267a1.02 1.02 0 0 0 .96-.677L7.96 2.498c-.004.011-.005.016-.004.017.02-.011.032-.015.044-.015a.06.06 0 0 1 .034.01.049.049 0 0 1 .018.023l1.167 3.28a1.015 1.015 0 0 0 .96.677h3.266a.06.06 0 0 1 .033.01l.011.011.008.013a.041.041 0 0 1 0 .024Z"
    />
  </svg>
);

export const copyShareLink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#DCD8FE93">
    <title>Icon</title>
    <path
      fill="#DCD8FE"
      fillOpacity={0.576}
      d="M9.306 10.206a.745.745 0 0 1 .066.977l-.066.076-2.458 2.458a3.228 3.228 0 0 1-4.691-4.431l.126-.133L4.74 6.694a.745.745 0 0 1 1.12.978l-.067.076-2.458 2.458a1.738 1.738 0 0 0 2.353 2.555l.105-.097 2.458-2.458a.745.745 0 0 1 1.054 0ZM9.83 6.17c.29.291.29.763 0 1.054l-2.48 2.48a.745.745 0 1 1-1.054-1.053l2.48-2.48a.745.745 0 0 1 1.054 0Zm3.887-3.887a3.228 3.228 0 0 1 .126 4.431l-.126.133-2.458 2.459a.745.745 0 0 1-1.12-.978l.067-.076 2.458-2.458a1.738 1.738 0 0 0-2.353-2.555l-.105.097-2.458 2.458a.745.745 0 0 1-1.12-.977l.066-.076 2.459-2.458a3.228 3.228 0 0 1 4.564 0Z"
    />
  </svg>
);

export const TrashCan = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#DCD8FE93"
  >
    <title>Icon</title>
    <path
      fillRule="evenodd"
      d="M12.369 6.5a.5.5 0 0 1 .486.615l-1.492 6.343A2 2 0 0 1 9.416 15H6.584a2 2 0 0 1-1.947-1.542L3.145 7.115A.5.5 0 0 1 3.63 6.5h8.738ZM8.5 1A2.5 2.5 0 0 1 11 3.5h2a1 1 0 0 1 1 1V5a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 2 5v-.5a1 1 0 0 1 1-1h2A2.5 2.5 0 0 1 7.5 1h1Zm0 1.5h-1a1 1 0 0 0-1 1h3a1 1 0 0 0-1-1Z"
      clipRule="evenodd"
    />
  </svg>
);

export const Pencil = ({ className }: { className: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="#DCD8FE93">
    <title>Icon</title>
    <path d="M10.1805 3.34195L4.14166 9.416C5.32948 9.77021 6.29238 10.6629 6.74008 11.8184L12.6877 5.8425C11.6642 5.22123 10.8043 4.36352 10.1805 3.34195Z" />
    <path d="M13.7391 4.71631C14.1575 4.02948 14.0727 3.11738 13.4846 2.5219C12.8908 1.92072 11.9784 1.83892 11.298 2.27649C11.8547 3.31132 12.7037 4.15999 13.7391 4.71631Z" />
    <path d="M3.03104 10.7502C4.30296 10.7658 5.36645 11.7423 5.49783 13.0114C4.83268 13.426 3.40197 13.7922 2.53114 13.9886C2.2001 14.0632 1.92026 13.7602 2.02075 13.4373C2.25326 12.6902 2.64592 11.5136 3.03104 10.7502Z" />
  </svg>
);

export const DropdownTriangle = ({ className }: { className: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="#858699"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Icon</title>
      <path d="M7.00194 10.6239C6.66861 10.8183 6.25 10.5779 6.25 10.192V5.80802C6.25 5.42212 6.66861 5.18169 7.00194 5.37613L10.7596 7.56811C11.0904 7.76105 11.0904 8.23895 10.7596 8.43189L7.00194 10.6239Z" />
    </svg>
  );
};

export const ProjectSquaresMain = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" stroke="none" className="fill-violet-400">
      <title>Icon</title>
      <path d="M5.948 2H2.623A.623.623 0 0 0 2 2.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.279.623-.623V2.623A.623.623 0 0 0 5.948 2ZM13.377 2h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.279.623-.623V2.623A.623.623 0 0 0 13.377 2ZM5.948 9.429H2.623a.623.623 0 0 0-.623.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623ZM13.377 9.429h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623Z" />
    </svg>
  );
};

export const ProjectSquaresSub = ({ className }: { className: string }) => {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="#858699"
      stroke="none"
    >
      <title>Icon</title>
      <path d="M5.948 2H2.623A.623.623 0 0 0 2 2.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.279.623-.623V2.623A.623.623 0 0 0 5.948 2ZM13.377 2h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.279.623-.623V2.623A.623.623 0 0 0 13.377 2ZM5.948 9.429H2.623a.623.623 0 0 0-.623.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623ZM13.377 9.429h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623Z" />
    </svg>
  );
};

export const IssuesIcon = ({ fill }: { fill: string }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <path
        d="M11.3135 8.16602V11.166C11.3135 13.666 10.3135 14.666 7.81348 14.666H4.81348C2.31348 14.666 1.31348 13.666 1.31348 11.166V8.16602C1.31348 5.66602 2.31348 4.66602 4.81348 4.66602H7.81348C10.3135 4.66602 11.3135 5.66602 11.3135 8.16602Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={fill}
      />
      <path
        d="M14.6468 3.90065V6.10065C14.6468 7.93398 13.9135 8.66732 12.0801 8.66732H11.3135V8.16732C11.3135 5.66732 10.3135 4.66732 7.81348 4.66732H7.31348V3.90065C7.31348 2.06732 8.04681 1.33398 9.88014 1.33398H12.0801C13.9135 1.33398 14.6468 2.06732 14.6468 3.90065Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={fill}
      />
    </svg>
  );
};

export const ViewsStackIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#858699"
  >
    <title>Icon</title>
    <path
      fillRule="evenodd"
      d="m12.654 10.795 2.1.826a.4.4 0 0 1 .073.707l-.072.038-6.399 2.526a1 1 0 0 1-.615.039l-.12-.04-6.368-2.526a.4.4 0 0 1-.072-.706l.072-.038 2.09-.825 3.726 1.48c.59.233 1.246.234 1.836 0l3.75-1.48Zm0-4.018 2.1.826a.4.4 0 0 1 .073.707l-.072.037L10.6 9.988l-.981.387-1.263.5-.039.011-.081.027a.986.986 0 0 1-.372.023l-.123-.023-.12-.04-1.23-.488-1.002-.397-4.136-1.641a.4.4 0 0 1-.072-.707l.072-.037 2.09-.825L7.07 8.257c.59.234 1.246.234 1.836.001l3.75-1.481ZM7.622 1.07a1 1 0 0 1 .733 0l6.4 2.515a.4.4 0 0 1 0 .744L10.6 5.969l-2.244.887-.081.028a1.008 1.008 0 0 1-.411.034l-.123-.024-.12-.039L1.252 4.33a.4.4 0 0 1 0-.744L7.622 1.07Z"
      clipRule="evenodd"
    />
  </svg>
);

export const teams = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#858699">
    <title>Icon</title>
    <path d="M1 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v.5H6A2.5 2.5 0 0 0 3.5 6v5H3a2 2 0 0 1-2-2V3Z" />
    <path
      fillRule="evenodd"
      d="M7 5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm3 5c.966 0 1.5-.784 1.5-1.75S10.966 6.5 10 6.5s-1.5.784-1.5 1.75S9.034 10 10 10Zm-3 2.562A1.61 1.61 0 0 1 9 11a1.202 1.202 0 0 0 2 0 1.61 1.61 0 0 1 2 1.562v.448c0 .27-.22.49-.49.49H7.49a.49.49 0 0 1-.49-.49v-.448Z"
      clipRule="evenodd"
    />
  </svg>
);

export const filterIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="#858699"
      className="sc-FINNM sc-iNTzRa hJWjMC hMxCmX"
    >
      <title>Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.25 3a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5h12.5ZM4 8a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 4 8Zm2.75 3.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
      />
    </svg>
  );
};

export const TeamIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#858699"
    className="sc-jOiSOi icTEOr color-override"
  >
    <title>Icon</title>
    <path
      fill="#9577FF"
      d="M5.948 2H2.623A.623.623 0 0 0 2 2.623v3.325c0 .344.28.623.623.623h3.325a.623.623 0 0 0 .623-.623V2.623A.623.623 0 0 0 5.948 2Zm7.429 0h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325A.623.623 0 0 0 14 5.948V2.623A.623.623 0 0 0 13.377 2ZM5.948 9.429H2.623a.623.623 0 0 0-.623.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623Zm7.429 0h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623Z"
    />
  </svg>
);

export const SqLogo = () => (
  <svg width="20" height="20" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>Icon</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.2665 17.0207C17.7999 17.836 17.5667 18.9517 17.5667 20.3678V21.3333H32.5V30.4C32.5 31.2837 31.7837 32 30.9 32H2.1C1.21634 32 0.5 31.2837 0.5 30.4V1.6C0.5 0.716345 1.21634 7.75419e-08 2.1 7.75419e-08L21.1712 0C21.1031 0.0402407 21.0361 0.08162 20.9702 0.124138C19.7403 0.896552 18.8708 1.85134 18.3619 2.98851C17.8529 4.10421 17.5985 5.24138 17.5985 6.4C17.5985 6.63602 17.6091 6.83985 17.6303 7.01149H21.9881C21.9669 6.81839 21.9563 6.52874 21.9563 6.14253C21.9563 5.75632 22.0836 5.30575 22.338 4.79081C22.5925 4.27586 22.9848 3.83601 23.515 3.47127C24.0663 3.08506 24.7555 2.89195 25.5826 2.89195C26.6005 2.89195 27.3639 3.19234 27.8728 3.7931C28.3818 4.37241 28.6362 5.059 28.6362 5.85287C28.6362 6.56092 28.4772 7.24751 28.1591 7.91264C27.8622 8.55632 27.3109 9.18927 26.505 9.81149L20.3023 14.7356C19.4328 15.4222 18.7542 16.1839 18.2665 17.0207ZM31.5058 0.88166C31.5252 0.900356 31.5444 0.919158 31.5635 0.938064C31.5445 0.919023 31.5253 0.900218 31.5058 0.88166ZM32.5 9.63422C32.014 10.4369 31.2881 11.247 30.3221 12.0644C28.9862 13.2015 27.3745 14.4889 25.4871 15.9264C25.2751 16.0981 25.01 16.3341 24.6919 16.6345C24.3738 16.9349 24.2148 17.128 24.2148 17.2138H32.5V9.63422Z"
      fill="#D8D8D8"
    />
  </svg>
);

export const showPasswordIcon = () => {
  return (
    <svg
      fill="#D8D8D8"
      height="20px"
      width="20px"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
    >
      <title>Icon</title>
      <g>
        <path d="m494.8,241.4l-50.6-49.4c-50.1-48.9-116.9-75.8-188.2-75.8s-138.1,26.9-188.2,75.8l-50.6,49.4c-11.3,12.3-4.3,25.4 0,29.2l50.6,49.4c50.1,48.9 116.9,75.8 188.2,75.8s138.1-26.9 188.2-75.8l50.6-49.4c4-3.8 11.7-16.4 0-29.2zm-238.8,84.4c-38.5,0-69.8-31.3-69.8-69.8 0-38.5 31.3-69.8 69.8-69.8 38.5,0 69.8,31.3 69.8,69.8 0,38.5-31.3,69.8-69.8,69.8zm-195.3-69.8l35.7-34.8c27-26.4 59.8-45.2 95.7-55.4-28.2,20.1-46.6,53-46.6,90.1 0,37.1 18.4,70.1 46.6,90.1-35.9-10.2-68.7-29-95.7-55.3l-35.7-34.7zm355,34.8c-27,26.3-59.8,45.1-95.7,55.3 28.2-20.1 46.6-53 46.6-90.1 0-37.2-18.4-70.1-46.6-90.1 35.9,10.2 68.7,29 95.7,55.4l35.6,34.8-35.6,34.7z" />
      </g>
    </svg>
  );
};

export const hidePasswordIcon = () => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <path
        d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const googleLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="20"
      height="20"
      viewBox="0 0 48 48"
    >
      <title>Icon</title>
      <path
        fill="#fbc02d"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#e53935"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4caf50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1565c0"
        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
};

export const githubLogo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px">
      <title>Icon</title>{' '}
      <path
        fill="white"
        d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"
      />
    </svg>
  );
};

export const workSpaceLogo = () => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="#6B6F76"
    >
      <title>Icon</title>
      <path d="M277.333333,1.42108547e-14 L298.666667,21.3333333 L298.666,64 L426.666667,64 L426.666667,362.666667 L3.55271368e-14,362.666667 L3.55271368e-14,64 L128,64 L128,21.3333333 L149.333333,1.42108547e-14 L277.333333,1.42108547e-14 Z M42.6664912,220.935181 L42.6666667,320 L384,320 L384.000468,220.935097 C341.375319,233.130501 298.701692,240.759085 256.000479,243.809455 L256,277.333333 L170.666667,277.333333 L170.666323,243.809465 C127.965163,240.759108 85.2915887,233.130549 42.6664912,220.935181 Z M384,106.666667 L42.6666667,106.666667 L42.6668606,176.433085 C99.6386775,193.933257 156.507113,202.666667 213.333333,202.666667 C270.159803,202.666667 327.028489,193.933181 384.000558,176.432854 L384,106.666667 Z M256,42.6666667 L170.666667,42.6666667 L170.666667,64 L256,64 L256,42.6666667 Z" />
    </svg>
  );
};

export const smallDeleteIcon = () => {
  return (
    <svg
      width="20px"
      height="20px"
      xmlns="http://www.w3.org/2000/svg"
      fill="#999"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
    >
      <title>Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};

export const threeDotOption = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#858699">
      <title>Icon</title>
      <path d="M3 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
    </svg>
  );
};

export const refreshIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#858699">
      <title>Icon</title>
      <path d="M11.9746 13.9429C10.5728 14.8076 8.93899 15.1566 7.32926 14.9351C5.71953 14.7137 4.22485 13.9342 3.07946 12.719C2.14332 11.7258 1.48375 10.4874 1.16333 9.1391C1.04844 8.65566 1.43724 8.22003 1.93437 8.22003C2.34387 8.22003 2.68633 8.52067 2.79369 8.91566C3.05809 9.88836 3.55163 10.7802 4.23422 11.5044C5.1251 12.4496 6.28767 13.0558 7.53972 13.2281C8.79177 13.4004 10.0625 13.1289 11.1529 12.4563C11.3402 12.3408 11.5204 12.2145 11.6927 12.0783L10.4444 10.7522C10.094 10.3799 10.358 9.76914 10.8694 9.76914L14.4164 9.76914C14.7387 9.76914 15 10.0303 15 10.3525V14.0248C15 14.5424 14.3757 14.8036 14.0068 14.4404L12.8542 13.3054C12.5774 13.5391 12.2835 13.7523 11.9746 13.9429Z" />
      <path d="M4.02678 2.09145C5.42926 1.19864 7.06381 0.838337 8.67428 1.067C10.2848 1.29567 11.7801 2.10038 12.926 3.35502C13.8697 4.38819 14.5324 5.67838 14.8503 7.08261C14.9597 7.56632 14.5712 8 14.0751 8C13.6639 8 13.3202 7.6973 13.2166 7.29958C12.9532 6.28841 12.4577 5.36118 11.7708 4.60907C10.8795 3.63321 9.71635 3.0073 8.46372 2.82944C7.21109 2.65158 5.93973 2.93183 4.84889 3.62626C4.66149 3.74556 4.48124 3.87592 4.30881 4.01649L5.5577 5.38566C5.90831 5.77003 5.64411 6.40062 5.13246 6.40062L1.58387 6.40062C1.26141 6.40062 1 6.13098 1 5.79836L1 2.00685C1 1.47246 1.62458 1.20278 1.99364 1.57782L3.14675 2.74964C3.42376 2.50837 3.71771 2.2882 4.02678 2.09145Z" />
    </svg>
  );
};
export const copyLink = (theme: string) => {
  const fillColor = () => (theme === 'dark' ? '#FFFFFF' : '#174eff');
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={fillColor()}>
      <title>Icon</title>
      <path
        fillRule="evenodd"
        d="M11.75 15A3.25 3.25 0 0 0 15 11.75v-4.5A3.25 3.25 0 0 0 11.75 4h-3.5A3.25 3.25 0 0 0 5 7.25v4.5A3.25 3.25 0 0 0 8.25 15h3.5Zm1.75-3.25a1.75 1.75 0 0 1-1.75 1.75h-3.5a1.75 1.75 0 0 1-1.75-1.75v-4.5c0-.966.784-1.75 1.75-1.75h3.5c.966 0 1.75.784 1.75 1.75v4.5Z"
        clipRule="evenodd"
      />
      <path d="M10.957 1.864c.487.451.062 1.136-.602 1.136-.244 0-.472-.105-.678-.235A1.742 1.742 0 0 0 8.75 2.5h-3.5c-.477 0-.909.19-1.225.5H4v.025c-.31.316-.5.748-.5 1.225v4.5c0 .34.097.658.265.927.13.206.235.434.235.678 0 .664-.685 1.09-1.136.602A3.238 3.238 0 0 1 2 8.75v-4.5A3.25 3.25 0 0 1 5.25 1h3.5c.852 0 1.627.328 2.207.864Z" />
    </svg>
  );
};
export const paperclipIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <title>Icon</title>
      <path
        d="M11.9697 12V15.5C11.9697 17.43 13.5397 19 15.4697 19C17.3997 19 18.9697 17.43 18.9697 15.5V10C18.9697 6.13 15.8397 3 11.9697 3C8.09973 3 4.96973 6.13 4.96973 10V16C4.96973 19.31 7.65973 22 10.9697 22"
        stroke="#858699"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const WorkspaceNotFoundSVG = () => {
  return (
    <svg
      width="66"
      height="72.5"
      viewBox="0 0 53 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <path
        d="M29.3346 26.332H13.3346M18.668 36.9987H13.3346M34.668 15.6654H13.3346M45.3346 24.9987V15.132C45.3346 10.6516 45.3346 8.4114 44.4627 6.70011C43.6957 5.19481 42.4719 3.97097 40.9666 3.20398C39.2553 2.33203 37.0151 2.33203 32.5346 2.33203H15.468C10.9875 2.33203 8.74734 2.33203 7.03604 3.20398C5.53075 3.97097 4.3069 5.19481 3.53992 6.70011C2.66797 8.4114 2.66797 10.6516 2.66797 15.132V42.8654C2.66797 47.3458 2.66797 49.586 3.53992 51.2973C4.3069 52.8026 5.53075 54.0264 7.03604 54.7934C8.74734 55.6654 10.9875 55.6654 15.468 55.6654H22.668M50.668 55.6654L46.668 51.6654M49.3346 44.9987C49.3346 50.1534 45.156 54.332 40.0013 54.332C34.8466 54.332 30.668 50.1534 30.668 44.9987C30.668 39.844 34.8466 35.6654 40.0013 35.6654C45.156 35.6654 49.3346 39.844 49.3346 44.9987Z"
        stroke="#717171"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BellIcon = (theme: string) => {
  return (
    <svg
      fill={theme !== 'light' ? '#EEEFFC' : '#3C4149'}
      height="16"
      width="16"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 611.999 611.999"
    >
      <title>Icon</title>
      <g>
        <g>
          <g>
            <path d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203     C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578     c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626     h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856     c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626     C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32     c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082     c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z      M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826     c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485     c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z" />
            <path d="M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258     c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258     C323.259,126.96,315.532,119.235,306.001,119.235z" />
          </g>
        </g>
      </g>
    </svg>
  );
};
export const UnassignedSVG = () => {
  return (
    <svg
      className={styles.assigneeButton}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <path
        d="M8.00033 7.9987C9.84127 7.9987 11.3337 6.50631 11.3337 4.66536C11.3337 2.82442 9.84127 1.33203 8.00033 1.33203C6.15938 1.33203 4.66699 2.82442 4.66699 4.66536C4.66699 6.50631 6.15938 7.9987 8.00033 7.9987Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.27344 14.6667C2.27344 12.0867 4.8401 10 8.0001 10C8.48511 10 8.95864 10.0498 9.41197 10.1435"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12C15 12.24 14.97 12.4725 14.91 12.6975C14.8425 12.9975 14.7225 13.29 14.565 13.545C14.0475 14.415 13.095 15 12 15C11.2275 15 10.53 14.7075 10.005 14.2275C9.78 14.0325 9.58499 13.8 9.43499 13.545C9.15749 13.095 9 12.5625 9 12C9 11.19 9.3225 10.4475 9.8475 9.90752C10.395 9.34502 11.16 9 12 9C12.885 9 13.6875 9.38251 14.2275 9.99751C14.7075 10.53 15 11.235 15 12Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.9734 11L10.9854 12.9881"
        stroke="#9597AD"
        strokeWidth="1.2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.0039 11.0195L13.0014 13.0076"
        stroke="#9597AD"
        strokeWidth="1.2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UnassignedSVGInDropdown = () => {
  return (
    <svg
      className={styles.unassignButtonInDropdown}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <path
        d="M8.00033 7.9987C9.84127 7.9987 11.3337 6.50631 11.3337 4.66536C11.3337 2.82442 9.84127 1.33203 8.00033 1.33203C6.15938 1.33203 4.66699 2.82442 4.66699 4.66536C4.66699 6.50631 6.15938 7.9987 8.00033 7.9987Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.27344 14.6667C2.27344 12.0867 4.8401 10 8.0001 10C8.48511 10 8.95864 10.0498 9.41197 10.1435"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12C15 12.24 14.97 12.4725 14.91 12.6975C14.8425 12.9975 14.7225 13.29 14.565 13.545C14.0475 14.415 13.095 15 12 15C11.2275 15 10.53 14.7075 10.005 14.2275C9.78 14.0325 9.58499 13.8 9.43499 13.545C9.15749 13.095 9 12.5625 9 12C9 11.19 9.3225 10.4475 9.8475 9.90752C10.395 9.34502 11.16 9 12 9C12.885 9 13.6875 9.38251 14.2275 9.99751C14.7075 10.53 15 11.235 15 12Z"
        stroke="#9597AD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.9734 11L10.9854 12.9881"
        stroke="#9597AD"
        strokeWidth="1.2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.0039 11.0195L13.0014 13.0076"
        stroke="#9597AD"
        strokeWidth="1.2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const githubSettingsLogo = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.0132 0C7.15833 0 0 7.3333 0 16.4056C0 23.6576 4.58659 29.7962 10.9494 31.9689C11.7449 32.1322 12.0363 31.6159 12.0363 31.1815C12.0363 30.8012 12.0101 29.4975 12.0101 28.1392C7.5556 29.1172 6.62799 26.1836 6.62799 26.1836C5.91212 24.2822 4.85143 23.7936 4.85143 23.7936C3.39348 22.7886 4.95763 22.7886 4.95763 22.7886C6.57489 22.8972 7.4235 24.4726 7.4235 24.4726C8.85491 26.9712 11.1615 26.2652 12.0894 25.8306C12.2218 24.7712 12.6463 24.0379 13.097 23.6306C9.54422 23.2502 5.80625 21.8379 5.80625 15.5363C5.80625 13.7436 6.44214 12.2769 7.44973 11.1363C7.29075 10.729 6.73386 9.04463 7.60903 6.79031C7.60903 6.79031 8.96111 6.35564 12.0098 8.4743C13.315 8.11519 14.6611 7.9325 16.0132 7.93097C17.3653 7.93097 18.7436 8.1213 20.0164 8.4743C23.0654 6.35564 24.4175 6.79031 24.4175 6.79031C25.2926 9.04463 24.7354 10.729 24.5764 11.1363C25.6106 12.2769 26.2202 13.7436 26.2202 15.5363C26.2202 21.8379 22.4823 23.2229 18.9029 23.6306C19.4864 24.1466 19.9898 25.1242 19.9898 26.6726C19.9898 28.8725 19.9636 30.6382 19.9636 31.1812C19.9636 31.6159 20.2553 32.1322 21.0505 31.9692C27.4133 29.7959 31.9999 23.6576 31.9999 16.4056C32.0261 7.3333 24.8416 0 16.0132 0Z"
        fill="black"
      />
    </svg>
  );
};
export const ProjectDataLabel = () => {
  return (
    <svg
      className="fill-[#6c64a0] hover:bg-popover rounded-sm p-1 w-6 h-6 transiton-200"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      stroke="none"
      fill="#858699"
    >
      <title>Icon</title>
      <path d="M5.948 2H2.623A.623.623 0 0 0 2 2.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.279.623-.623V2.623A.623.623 0 0 0 5.948 2ZM13.377 2h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.279.623-.623V2.623A.623.623 0 0 0 13.377 2ZM5.948 9.429H2.623a.623.623 0 0 0-.623.623v3.325c0 .344.28.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623ZM13.377 9.429h-3.325a.623.623 0 0 0-.623.623v3.325c0 .344.279.623.623.623h3.325c.344 0 .623-.28.623-.623v-3.325a.623.623 0 0 0-.623-.623Z" />
    </svg>
  );
};

export const NotFavorited = () => {
  return (
    <svg
      className="fill-[#e5c66c] hover:bg-popover rounded-sm p-1 w-6 h-6 transiton-200"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="#858699"
    >
      <title>Icon</title>
      <path d="M10.5193 4.98997L9.46118 2.01693C9.34483 1.70806 9.1452 1.45362 8.88451 1.27433C8.62466 1.09562 8.31641 1 8.00081 1C7.68521 1 7.37696 1.09562 7.11712 1.27433C6.85642 1.45362 6.65679 1.70806 6.54528 2.00374L5.48248 4.98997L2.55536 4.98997C2.23765 4.98973 1.92683 5.08675 1.66556 5.26809C1.40342 5.45004 1.20379 5.70812 1.09414 6.00737C0.984248 6.30728 0.970192 6.63372 1.05394 6.94194C1.13753 7.2496 1.31442 7.52386 1.56019 7.7275L4.08545 9.80411L3.02371 12.9604C2.91854 13.2733 2.91647 13.6112 3.01776 13.9252C3.11884 14.2385 3.3175 14.5113 3.58464 14.7044C3.85102 14.8969 4.17178 15.0003 4.50071 14.9996C4.82872 14.9993 5.14907 14.8951 5.41483 14.702L8.00053 12.8223L10.5851 14.7014C10.8496 14.8944 11.17 14.9991 11.4991 15C11.8281 15.0009 12.1491 14.8978 12.4157 14.7054C12.6831 14.5124 12.882 14.2394 12.9833 13.926C13.0848 13.6113 13.0827 13.2731 12.9773 12.9602L11.9156 9.80207L14.444 7.72408C14.695 7.51166 14.8686 7.23684 14.9493 6.92968C15.0168 6.67352 15.0167 6.40505 14.9504 6.15011L14.9022 5.99753C14.791 5.70157 14.5918 5.44667 14.3314 5.26673C14.0718 5.08736 13.7637 4.9909 13.4479 4.98998L10.5193 4.98997ZM13.4986 6.54821C13.4962 6.55733 13.491 6.56562 13.4832 6.57224L10.7049 8.85551C10.546 8.98629 10.4307 9.16168 10.3739 9.35896C10.3168 9.55714 10.3214 9.76807 10.3875 9.96371L11.5556 13.4385C11.5586 13.4474 11.5587 13.4565 11.5559 13.4652C11.553 13.4741 11.5467 13.4827 11.5378 13.4891C11.5281 13.4961 11.5159 13.5 11.503 13.5C11.4902 13.5 11.4779 13.496 11.4683 13.4889L8.60012 11.4036C8.42554 11.2769 8.21577 11.2088 8.00055 11.2088C7.78531 11.2088 7.5755 11.2769 7.40134 11.4034L4.53289 13.4886C4.52321 13.4957 4.511 13.4996 4.49835 13.4996C4.48523 13.4997 4.47312 13.4958 4.46329 13.4887C4.45442 13.4822 4.44826 13.4738 4.4453 13.4646C4.44255 13.4561 4.4426 13.4471 4.44547 13.4386L5.61393 9.96499C5.67961 9.76981 5.68428 9.5592 5.62728 9.3612C5.57043 9.16375 5.45499 8.98835 5.29643 8.85789L2.51507 6.57069C2.50925 6.56586 2.50387 6.55753 2.50146 6.54865C2.49919 6.54032 2.49957 6.53163 2.50257 6.52343C2.50583 6.51453 2.5121 6.50643 2.52085 6.50035C2.53046 6.49368 2.54238 6.48996 2.55479 6.48997H5.8221C6.03248 6.4897 6.23685 6.42501 6.40824 6.30453C6.58053 6.18341 6.71109 6.01179 6.78158 5.81318L7.9609 2.49821C7.95727 2.50944 7.95646 2.51419 7.9574 2.5155C7.97668 2.50367 7.98851 2.5 8.00081 2.5C8.01311 2.5 8.02494 2.50367 8.03451 2.51025C8.04324 2.51625 8.04952 2.52427 8.05284 2.53307L9.22029 5.81379C9.29053 6.01192 9.42137 6.18383 9.59407 6.30503C9.76589 6.4256 9.97082 6.49011 10.1806 6.48997H13.4457C13.4563 6.49001 13.4686 6.49385 13.4786 6.50077L13.4902 6.5114L13.4977 6.52418C13.5004 6.53198 13.5007 6.54022 13.4986 6.54821Z" />
    </svg>
  );
};

export const ellipsis = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
};
export const filterFunnel = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
      />
    </svg>
  );
};

export const bugIcon = () => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 36 36"
      aria-hidden="true"
      role="img"
      className="iconify iconify--twemoji"
      preserveAspectRatio="xMidYMid meet"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <circle fill="#DD2E44" cx="18" cy="18" r="18" />
      </g>
    </svg>
  );
};

export const featureIcon = () => {
  return (
    <svg
      width="px"
      height="20px"
      viewBox="0 0 36 36"
      aria-hidden="true"
      role="img"
      className="iconify iconify--twemoji"
      preserveAspectRatio="xMidYMid meet"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <circle fill="#AA8ED6" cx="18" cy="18" r="18" />
      </g>
    </svg>
  );
};

export const improvementIcon = () => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 36 36"
      aria-hidden="true"
      role="img"
      className="iconify iconify--twemoji"
      preserveAspectRatio="xMidYMid meet"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <circle fill="#55ACEE" cx="18" cy="18" r="18" />
      </g>
    </svg>
  );
};

export const redIcon = () => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 36 36"
      aria-hidden="true"
      role="img"
      className="iconify iconify--twemoji"
      preserveAspectRatio="xMidYMid meet"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <circle fill="#F4900C" cx="18" cy="18" r="18" />
      </g>
    </svg>
  );
};

export const testIcon = () => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 36 36"
      aria-hidden="true"
      role="img"
      className="iconify iconify--twemoji"
      preserveAspectRatio="xMidYMid meet"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <circle fill="#808080" cx="18" cy="18" r="18" />
      </g>
    </svg>
  );
};

export const adjustmentSymbol = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
      />
    </svg>
  );
};
export const inboxSymbol = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="0.5"
      stroke="currentColor"
      className="w-40 h-40"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
      />
    </svg>
  );
};

export const inboxSymbol2 = (className: string) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <title>Icon</title>
      <path
        d="M23.9987 58.6663H39.9987C53.332 58.6663 58.6654 53.333 58.6654 39.9997V23.9997C58.6654 10.6663 53.332 5.33301 39.9987 5.33301H23.9987C10.6654 5.33301 5.33203 10.6663 5.33203 23.9997V39.9997C5.33203 53.333 10.6654 58.6663 23.9987 58.6663Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33203 34.6663H15.3587C17.3854 34.6663 19.2254 35.813 20.132 37.6263L22.5054 42.3996C23.9987 45.333 26.6654 45.333 27.3054 45.333H36.7187C38.7454 45.333 40.5854 44.1863 41.492 42.373L43.8654 37.5996C44.772 35.7863 46.612 34.6396 48.6387 34.6396H58.612"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const checkBadge = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-3 h-3"
    >
      <title>Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    </svg>
  );
};
export const leftBracket = () => {
  return (
    <svg
      width="12px"
      height="12px"
      viewBox="0 0 1024 1024"
      className="icon"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <path
        d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"
        fill="#6b6f76"
      />
    </svg>
  );
};

export const Favorited = () => {
  return (
    <svg
      className="fill-[#e5c66c] hover:bg-popover rounded-sm p-1 w-6 h-6 transiton-200"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="#858699"
    >
      <title>Icon</title>
      <path d="M14.9441 6.05256C14.8798 5.88159 14.7646 5.73411 14.6136 5.6298C14.4626 5.52549 14.2832 5.46931 14.0992 5.46877H10.4417C10.3795 5.46881 10.3187 5.44969 10.2679 5.41405C10.2171 5.37841 10.1787 5.32801 10.1581 5.2698L8.84514 1.58061C8.78083 1.4101 8.66552 1.26313 8.51465 1.15936C8.36377 1.0556 8.18453 1 8.00091 1C7.81728 1 7.63804 1.0556 7.48717 1.15936C7.33629 1.26313 7.22098 1.4101 7.15667 1.58061L7.15367 1.59014L5.84375 5.2698C5.82313 5.32791 5.78483 5.37825 5.73415 5.41388C5.68346 5.44951 5.62288 5.46869 5.56075 5.46877H1.902C1.71682 5.46863 1.53608 5.52504 1.38439 5.63033C1.23269 5.73562 1.11739 5.88468 1.05416 6.05724C0.990937 6.22979 0.982856 6.41746 1.03102 6.59473C1.07919 6.772 1.18126 6.93025 1.32335 7.04798L4.4383 9.6095C4.4849 9.64784 4.51872 9.69923 4.53534 9.75695C4.55196 9.81467 4.5506 9.87603 4.53143 9.93297L3.22272 13.8235C3.16224 14.0034 3.16105 14.1977 3.21932 14.3783C3.27758 14.5589 3.39229 14.7164 3.54684 14.8281C3.70139 14.9398 3.88777 15 4.07903 14.9996C4.27029 14.9994 4.45652 14.9388 4.61076 14.8267L7.82305 12.4915C7.87456 12.4541 7.93675 12.4339 8.00061 12.4339C8.06446 12.4339 8.12665 12.4541 8.17817 12.4915L11.3893 14.8261C11.5434 14.9386 11.7297 14.9995 11.9212 15C12.1126 15.0005 12.2992 14.9406 12.454 14.8289C12.6087 14.7172 12.7236 14.5595 12.782 14.3788C12.8403 14.198 12.8391 14.0035 12.7785 13.8235L11.4698 9.93059C11.4506 9.87364 11.4493 9.81229 11.4659 9.75457C11.4825 9.69685 11.5163 9.64545 11.5629 9.60712L14.6839 7.04202C14.8242 6.9233 14.9243 6.76477 14.9708 6.58783C15.0174 6.41089 15.0081 6.22406 14.9441 6.05256Z" />
    </svg>
  );
};

export const ClosedHeroIcon = () => {
  return (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 5.25C1 3.45508 2.45508 2 4.25 2H11.75C13.5449 2 15 3.45508 15 5.25V10.7499C15 12.5449 13.5449 13.9999 11.75 13.9999H4.25C2.45508 13.9999 1 12.5449 1 10.7499V5.25ZM4.5 12.4999C3.39543 12.4999 2.5 11.6045 2.5 10.4999V5.5C2.5 4.39543 3.39543 3.5 4.5 3.5H9V12.4999H4.5Z"
      />
      <rect x="9" y="3" width="1.5" height="10" />
    </>
  );
};

export const OpenedHeroIcon = () => {
  return (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 2C2.45508 2 1 3.45508 1 5.25V10.7499C1 12.5449 2.45508 13.9999 4.25 13.9999H11.75C13.5449 13.9999 15 12.5449 15 10.7499V5.25C15 3.45508 13.5449 2 11.75 2H4.25ZM2.5 10.4999C2.5 11.6045 3.39543 12.4999 4.5 12.4999H11.75C12.7165 12.4999 13.5 11.7164 13.5 10.7499V5.25C13.5 4.28351 12.7165 3.5 11.75 3.5H4.5C3.39543 3.5 2.5 4.39543 2.5 5.5V10.4999Z"
      />
      <rect x="9" y="3" width="1.5" height="10" />
    </>
  );
};

export const rightBracket = () => {
  return (
    <svg
      width="12px"
      height="12px"
      viewBox="0 0 1024 1024"
      className="icon"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <path
        d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z"
        fill="#6b6f76"
      />
    </svg>
  );
};

export const helpCircle = () => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 9C11.7015 9 11.4344 9.12956 11.2497 9.33882C10.8843 9.75289 10.2523 9.79229 9.83827 9.42683C9.4242 9.06136 9.3848 8.42942 9.75026 8.01535C10.2985 7.3942 11.1038 7 12 7C13.6569 7 15 8.34315 15 10C15 11.3072 14.1647 12.4171 13 12.829V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V12.5C11 11.6284 11.6873 11.112 12.2482 10.9692C12.681 10.859 13 10.4655 13 10C13 9.44772 12.5523 9 12 9ZM12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17H12.01C12.5623 17 13.01 16.5523 13.01 16C13.01 15.4477 12.5623 15 12.01 15H12Z"
        fill="#808080"
      />
    </svg>
  );
};
