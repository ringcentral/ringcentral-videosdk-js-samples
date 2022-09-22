import React, { useContext } from 'react';
interface IGlobalContext {
    isMeetingJoined: boolean;
}
const GlobalContext = React.createContext<IGlobalContext>({ isMeetingJoined: false } as any);
const useGlobalContext = () => useContext<IGlobalContext>(GlobalContext);
export { useGlobalContext };
export default GlobalContext;
