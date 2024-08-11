"use client";
import React, { useState } from "react";
import Welcome from "@/components/Welcome";
import ThemeModeText from "@/components/ThemeModeText";
import FinalSlide from "@/components/FinalSlide";
import CreateWorkspace from "@/components/CreateWorkspace";

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const titles = [
    "Welcome",
    "Select Theme",
    "Workspace",
    "Command Menu",
    "Final Slide",
  ];

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
        return (
          <CreateWorkspace onboarding={true} handleNextPage={handleNextPage} />
        );
      case 3:
        return <FinalSlide />;
      default:
        return <Welcome handleNextPage={handleNextPage} />;
    }
  };

  return (
    <div className="absolute z-20 h-screen w-full">
      <div>{pageDisplay()}</div>
      {/* Uncomment and use these buttons when development is complete
			<button
				className="px-2 border border-gray-700 absolute top-[45%] left-[50px]"
				onClick={handlePreviousPage}
			>
				prev
			</button>
			<button
				className="px-2 border border-gray-700 absolute top-[45%] right-[50px]"
				onClick={handleNextPage}
			>
				next
			</button>
			*/}
      <div className="w-full h-8 absolute bottom-4">
        <div className="flex items-center justify-center">
          <div
            className={`h-2 w-2 ${page === 0 ? "bg-purpleButton" : "bg-accent"} m-2 rounded transition ease-in-out duration-700`}
            onClick={() => handleElipse(0)}
          />
          <div
            className={`h-2 w-2 ${page === 1 ? "bg-purpleButton" : "bg-accent"} m-2 rounded transition ease-in-out duration-700`}
            onClick={() => handleElipse(1)}
          />
          <div
            className={`h-2 w-2 ${page === 2 ? "bg-purpleButton" : "bg-accent"} m-2 rounded transition ease-in-out duration-700`}
            onClick={() => handleElipse(2)}
          />
          {/* <div
						className={`h-2 w-2 ${page === 3 ? 'bg-purpleButton' : 'bg-accent'} m-2 rounded transition ease-in-out duration-700`}
						onClick={() => handleElipse(3)}
					/> */}
          <div
            className={`h-2 w-2 ${page === 4 ? "bg-purpleButton" : "bg-accent"} m-2 rounded transition ease-in-out duration-700`}
            onClick={() => handleElipse(4)}
          />
        </div>
      </div>
    </div>
  );
}
