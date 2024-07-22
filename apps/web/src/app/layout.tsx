'use client';
import './globals.css';
import { Providers } from '@/store/provider';
import { useSelector } from 'react-redux';
import CommandPalette from '@/components/CommandPalette';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CurrentNavbar from '@/components/CurrentNavbar';
import type { RootState } from '@/store';

const styles = {
  currentNavBar: 'h-full flex flex-row overflow-hidden',
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
          <ThemedComponent>
            <div className={styles.currentNavBar}>
              <CurrentNavbar />
              {children}
            </div>
          </ThemedComponent>
          <ToastContainerWrapper />
        </Providers>
      </body>
    </html>
  );
}

function ThemedComponent({ children }: { children: React.ReactNode }) {
  const theme = useSelector((state: RootState) => state.userSettings.theme);
  return <div className={theme}>{children}</div>;
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
