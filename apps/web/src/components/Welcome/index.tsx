import React from "react";
import type { WelcomeProps } from "./Welcome.interfaces";
import { Button } from "../ui/button";

const Welcome = ({ handleNextPage }: WelcomeProps) => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-card">
      <div className="w-11/12 flex flex-col items-center justify-center text-center">
        <h1 className="text-foreground text-6xl xs:text-4xl font-bold mb-4">
          Welcome to Squared
        </h1>
        <p className="text-muted-foreground font-medium mb-8 xs:text-sm">
          Squared optimizes software development, iterations, and bug fixes.
        </p>
        <Button type="button" onClick={handleNextPage}>
          Get started
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
