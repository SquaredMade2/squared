"use client";
import "./globals.css";
import { Providers } from "@/store/provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import CommandPalette from "@/components/CommandPalette";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CurrentNavbar from "@/components/CurrentNavbar";

const styles = {
  currentNavBar: "h-full flex flex-row overflow-hidden",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <CommandPalette />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className={styles.currentNavBar}>
              <CurrentNavbar />
              {children}
            </div>
          </ThemeProvider>
          <ToastContainerWrapper />
        </Providers>
      </body>
    </html>
  );
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

function ToastContainerWrapper() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Slide}
      theme="colored"
    />
  );
}
