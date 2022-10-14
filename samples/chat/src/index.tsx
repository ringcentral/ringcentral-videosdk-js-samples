import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { RcThemeProvider, RcAppBar } from '@ringcentral/juno';
import { RcvEngine, EngineEvent, ErrorCodeType, GrantType } from '@sdk';
import StartView from './pages/StartView';
import InMeeting from './pages/InMeeting';
import GlobalContext from './context';
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)
    const [isMeetingJoined, setMeetingJoined] = useState(false)
    const navigate = useNavigate();

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
            engine.on(EngineEvent.MEETING_JOINED, (meetingId, errorCode) => {
                if (errorCode === ErrorCodeType.ERR_OK) {
                    setMeetingJoined(true);
                    if (!window.location.pathname.includes('/meeting/')) {
                        navigate(`/meeting/${meetingId}`);
                    }
                }
            });
            engine.on(EngineEvent.MEETING_LEFT, () => {
                navigate('/', { replace: true });
            });
            setRcvEngine(engine)
        }

        initSDK()
    }, [])

    return (
        <GlobalContext.Provider value={{ isMeetingJoined }}>
            <RcThemeProvider>
                <RcAppBar className='header'>Demo: chat in the meeting</RcAppBar>
                <Routes>
                    <Route path='meeting'>
                        <Route
                            path=':meetingId'
                            element={<InMeeting rcvEngine={rcvEngine} />
                            }
                        />
                    </Route>
                    <Route path='/' element={<StartView rcvEngine={rcvEngine} />} />
                </Routes>
            </RcThemeProvider>
        </GlobalContext.Provider>
    )
}

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App config={{
            ...window.initConfig,
        }} />
    </BrowserRouter>
);