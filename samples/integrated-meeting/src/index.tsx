import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { RcvEngine, EngineEvent, ErrorCodeType, GrantType } from '@sdk';
import StartView from './pages/StartView';
import InMeeting from './pages/InMeeting';
import GlobalContext from './store/global/context';
import { MeetingContextProvider } from './store/meeting';
import { ElementContextProvider } from './store/element';
import './styles/index.less';
declare global {
    interface Window {
        initConfig: Record<string, string>;
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null);
    const [isMeetingJoined, setMeetingJoined] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const initSDK = async () => {
            const { clientId, clientSecret, jwt, userName, password } = config;

            const engine = RcvEngine.create({
                clientId,
                clientSecret,
                enableDiscovery: false,
            });

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
            setRcvEngine(engine);
        };

        initSDK();
    }, []);

    return (
        <SnackbarProvider autoHideDuration={3000} preventDuplicate>
            <GlobalContext.Provider value={{ rcvEngine, isMeetingJoined }}>
                <ElementContextProvider>
                    <Routes>
                        <Route path='meeting'>
                            <Route
                                path=':meetingId'
                                element={
                                    <MeetingContextProvider>
                                        <InMeeting />
                                    </MeetingContextProvider>
                                }
                            />
                        </Route>
                        <Route path='/' element={<StartView rcvEngine={rcvEngine} />} />
                    </Routes>
                </ElementContextProvider>
            </GlobalContext.Provider>
        </SnackbarProvider>
    );
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App
            config={{
                ...window.initConfig,
            }}
        />
    </BrowserRouter>
);
