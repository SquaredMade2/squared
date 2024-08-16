// app/team/[identifier]/[all]/layout.tsx
"use client";
import Navbar from "@/components/NavBar";
import React from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showNavBar } = useAppSelector((state) => state.userSettings);
  return (
    <div className="flex w-full overflow-hidden">
      {showNavBar && (
        <div className={`w-64`}>
          <Navbar />
        </div>
      )}
      <main className="flex flex-grow overflow-hidden">{children}</main>
    </div>
  );
}
