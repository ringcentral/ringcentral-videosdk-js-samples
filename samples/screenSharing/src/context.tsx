import React, { useContext } from 'react';
interface IGlobalContext {
    isMeetingJoined: boolean;
    setMeetingJoined: (value: boolean) => void;
}
const GlobalContext = React.createContext<IGlobalContext>({} as any);
const useGlobalContext = () => useContext<IGlobalContext>(GlobalContext);
export { useGlobalContext };
export default GlobalContext;
