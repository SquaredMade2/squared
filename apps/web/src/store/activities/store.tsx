// "use client";

// import { createContext, useRef, useContext, type ReactNode } from "react";
// import { useStore } from "zustand";
// import { type ActivityStore, createActivityStore } from ".";

// type ActivityStoreApi = ReturnType<typeof createActivityStore>;

// const ActivityStoreContext = createContext<ActivityStoreApi | undefined>(
// 	undefined,
// );

// export const ActivityStoreProvider = ({
// 	children,
// }: { children: ReactNode }) => {
// 	const storeRef = useRef<ActivityStoreApi>();
// 	if (!storeRef.current) {
// 		storeRef.current = createActivityStore();
// 	}

// 	return (
// 		<ActivityStoreContext.Provider value={storeRef.current}>
// 			{children}
// 		</ActivityStoreContext.Provider>
// 	);
// };

// export const useActivityStore = <T,>(
// 	selector: (store: ActivityStore) => T,
// ): T => {
// 	const context = useContext(ActivityStoreContext);
// 	if (!context) {
// 		throw new Error(
// 			"useActivityStore must be used within ActivityStoreProvider",
// 		);
// 	}
// 	return useStore(context, selector);
// };
