import { type FC, type ReactNode, createContext, useContext } from "react";

type Direction = "ltr" | "rtl";
const DirectionContext = createContext<Direction | undefined>(undefined);

/* -------------------------------------------------------------------------------------------------
 * Direction
 * -----------------------------------------------------------------------------------------------*/

interface DirectionProviderProps {
	children?: ReactNode;
	dir: Direction;
}
const DirectionProvider: FC<DirectionProviderProps> = (props) => {
	const { dir, children } = props;
	return (
		<DirectionContext.Provider value={dir}>
			{children}
		</DirectionContext.Provider>
	);
};

/* -----------------------------------------------------------------------------------------------*/

function useDirection(localDir?: Direction) {
	const globalDir = useContext(DirectionContext);
	return localDir || globalDir || "ltr";
}

const Provider = DirectionProvider;

export {
	useDirection,
	//
	Provider,
	//
	DirectionProvider,
};
