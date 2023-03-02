import { RcvEngine } from '@ringcentral/video-sdk';
import React, { useContext } from 'react';
interface IGlobalContext {
    rcvEngine: RcvEngine | null;
    isMeetingJoined: boolean;
}
const GlobalContext = React.createContext<IGlobalContext>({
    rcvEngine: null,
    isMeetingJoined: false,
} as any);

const useGlobalContext = () => useContext<IGlobalContext>(GlobalContext);
export { useGlobalContext };
export default GlobalContext;
