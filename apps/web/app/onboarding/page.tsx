'use client';
import React, { useState } from 'react';
import Welcome from '@/components/Welcome';
import ThemeModeText from '@/components/ThemeModeText';
// import CommandMenu from '@/components/CommandMenu'; commented out until feature is added
import FinalSlide from '@/components/FinalSlide';
import CreateWorkspace from '@/components/CreateWorkspace';

const styles = {
  container: 'absolute z-20 h-screen w-full',
  elipseContainer: 'w-full h-8 absolute bottom-4',
  elipseWrapper: 'flex items-center justify-center',
  elipse: 'h-2 w-2 bg-accent m-2 rounded',
  elipseSelected: 'h-2 w-2 bg-purpleButton m-2 rounded transition ease-in-out duration-700',
};

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const titles = ['Welcome', 'Select Theme', 'Workspace', 'Command Menu', 'Final Slide'];

  const handleElipse = (value: number) => {
    if (page > value) {
      setPage(value);
    }
  };

  const handleNextPage = () => {
    if (page < titles.length - 1) {
      setPage((page) => page + 1);
    }
  };

  const pageDisplay = () => {
    switch (page) {
      case 0:
        return <Welcome handleNextPage={handleNextPage} />;
      case 1:
        return <ThemeModeText handleNextPage={handleNextPage} />;
      case 2:
        return <CreateWorkspace onboarding={true} handleNextPage={handleNextPage} />;
      // case 3:
      // 	return <CommandMenu handleNextPage={handleNextPage} />; commented out until feature implemented
      case 3:
        return <FinalSlide />;
      default:
        return <Welcome handleNextPage={handleNextPage} />;
    }
  };
  return (
    <div className={styles.container}>
      <div>{pageDisplay()}</div>
      {/* Leave in commented out code for now. Will remove when development is
      finished.
      <button
        className="px-2 border border-gray-700 absolute top-[45%] left-[50px]"
        onClick={handlePreviousPage}
      >
        prev
      </button>
      <button
        className="px-2 border border-gray-700 absolute top-[45%] right-[50px] "
        onClick={handleNextPage}
      >
        next
      </button> */}
      <div className={styles.elipseContainer}>
        <div className={styles.elipseWrapper}>
          <div
            className={page === 0 ? styles.elipseSelected : styles.elipse}
            onClick={() => handleElipse(0)}
          />
          <div
            className={page === 1 ? styles.elipseSelected : styles.elipse}
            onClick={() => handleElipse(1)}
          />
          <div
            className={page === 2 ? styles.elipseSelected : styles.elipse}
            onClick={() => handleElipse(2)}
          />
          {/* <div
						className={page === 3 ? styles.elipseSelected : styles.elipse} commented out until feature is added.
						onClick={() => handleElipse(3)}
					>
						<button></button>
					</div> */}
          <div
            className={page === 3 ? styles.elipseSelected : styles.elipse}
            onClick={() => handleElipse(4)}
          />
        </div>
      </div>
    </div>
  );
}
