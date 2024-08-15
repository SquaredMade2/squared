// app/team/[identifier]/[all]/layout.tsx

import Navbar from "@/components/NavBar";
import React from "react";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full overflow-hidden">
      <div className="w-64">
        <Navbar />
      </div>
      <main className="flex flex-grow overflow-hidden">{children}</main>
    </div>
  );
}
