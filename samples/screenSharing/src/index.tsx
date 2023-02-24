import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RcvEngine, GrantType } from '@ringcentral/video-sdk';
import Sharing from './Sharing';
import GlobalContext from './context';
import { AppBar } from '@mui/material';
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)
    const [isMeetingJoined, setMeetingJoined] = useState(false)

    useEffect(() => {

        const initSDK = async () => {
            const { clientId, clientSecret, jwt, userName, password } = config;
            // You could open 'enableDiscovery' and set 'discoveryServer' if neccessary
            const engine = RcvEngine.create({ clientId, clientSecret, enableDiscovery: false });
            // if config jwt, initialize SDK with jwt
            // else initialize SDK with password
            await engine.authorize({
                grantType: jwt ? GrantType.JWT : GrantType.PASSWORD,
                jwt,
                username: userName,
                password,
            });
            setRcvEngine(engine)
        }
        initSDK()
    }, [])

    return (
        <GlobalContext.Provider value={{ isMeetingJoined, setMeetingJoined: value => setMeetingJoined(value) }} >
            <AppBar className='header' position='static'>
                Demo: screen sharing
            </AppBar>
            <Sharing rcvEngine={rcvEngine} />
        </GlobalContext.Provider>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);