'use client';

import { NextAuthProvider } from '@/app/Providers';
import SocketProvider from '@/app/SocketProvider';
import AuthProvider from '@/components/AuthProvider';
import { store, persistor } from '@/store/index';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextAuthProvider>
          <AuthProvider>
            <SocketProvider>{children}</SocketProvider>
          </AuthProvider>
        </NextAuthProvider>
      </PersistGate>
    </Provider>
  );
}
