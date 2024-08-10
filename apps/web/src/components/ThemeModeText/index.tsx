import React from "react";
import { useDispatch } from "react-redux";
import { lightMode, darkMode } from "@/components/Svg";
import type { ThemeModeTextProps } from "./ThemeModeText.interfaces";
import { useTheme } from "next-themes";

const ThemeModeText = ({ handleNextPage }: ThemeModeTextProps) => {
  const { theme, setTheme } = useTheme();

  const selected =
    "border-solid border-2 border-onboardingTheme rounded";

  return (
    <div className="bg-card h-screen w-full flex flex-col items-center justify-center text-center">
      <span className="text-foreground text-2xl font-medium mb-3">
        Choose your style
      </span>
      <span className="text-muted-foreground text-base mb-8">
        You can change the UI style at any time through the command
        menu or in the settings.
      </span>
      <div className="flex w-[600px] xs:w-11/12 h-48 border border-border text-foreground rounded-lg font-medium">
        {theme === "light" && (
          <>
            <div
              className="w-1/2 box-border border-border border-r flex items-center justify-center flex-col bg-taskHeader"
              onClick={() => setTheme("light")}
            >
              <div className="w-3/5 h-auto my-3 flex items-center justify-center">
                {lightMode(selected)}
              </div>
              <p>Light</p>
            </div>
            <div
              className="w-1/2 rounded-r-lg flex flex-col items-center justify-center"
              onClick={() => setTheme("dark")}
            >
              <div className="w-3/5 h-auto my-3 flex items-center justify-center">
                {darkMode("")}
              </div>
              <p>Dark</p>
            </div>
          </>
        )}
        {theme === "dark" && (
          <>
            <div
              className="w-1/2 box-border border-border border-r flex items-center justify-center flex-col"
              onClick={() => setTheme("light")}
            >
              <div className="w-3/5 h-auto my-3 flex items-center justify-center">
                {lightMode("")}
              </div>
              <p>Light</p>
            </div>
            <div
              className="w-1/2 rounded-r-lg flex flex-col items-center justify-center bg-taskHeader"
              onClick={() => setTheme("dark")}
            >
              <div className="w-3/5 h-auto my-3 flex items-center justify-center">
                {darkMode(selected)}
              </div>
              <p>Dark</p>
            </div>
          </>
        )}
      </div>
      <button
        type="button"
        className={`w-11/12 max-w-xs h-12 ${
          theme === "light"
            ? "bg-purpleButtonHover hover:bg-purpleButton"
            : "bg-purpleButton hover:bg-purpleButtonHover"
        } rounded text-foreground font-medium mt-12 transition ease-out duration-100 box-content`}
        onClick={handleNextPage}
      >
        Continue
      </button>
    </div>
  );
};

export default ThemeModeText;
