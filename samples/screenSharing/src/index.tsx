import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RcvEngine, GrantType } from '@sdk';
import Sharing from './Sharing';
import GlobalContext from './context';
import { RcThemeProvider, RcAppBar } from '@ringcentral/juno';
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
            const engine = RcvEngine.create({ clientId, clientSecret });
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
            <RcThemeProvider>
                <RcAppBar className='header'>
                    Demo: screen sharing
                </RcAppBar>
                <Sharing rcvEngine={rcvEngine} />
            </RcThemeProvider>
        </GlobalContext.Provider>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);