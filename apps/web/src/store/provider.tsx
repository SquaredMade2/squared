"use client";

import SocketProvider from "@/app/SocketProvider";
import { store, persistor } from "@/store/index";
import { SquaredStoreProvider } from "@/storeZ/provider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<SquaredStoreProvider>
				<PersistGate loading={null} persistor={persistor}>
					<SocketProvider>{children}</SocketProvider>
				</PersistGate>
			</SquaredStoreProvider>
		</Provider>
	);
}
