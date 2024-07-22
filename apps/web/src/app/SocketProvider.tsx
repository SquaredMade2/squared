import { createContext } from 'react';
import io from 'socket.io-client';
const socket = io(process.env.NEXT_PUBLIC_SERVER ?? '');

export const SocketContext = createContext(socket);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
