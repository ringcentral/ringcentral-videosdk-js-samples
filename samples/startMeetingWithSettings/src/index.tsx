import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RcvEngine, EngineEvent, ErrorCodeType } from '@sdk';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { RcThemeProvider, RcAppBar } from '@ringcentral/juno';
import StartView from './pages/StartView'
import InMeeting from './pages/InMeeting'
import './index.less'
import GlobalContext from './context';
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
        const initRingCentralSdk = () => {
            const { clientId, clientSecret } = config
            const RingCentralSdk = (window as any).RingCentral.SDK;
            return new RingCentralSdk({
                server: RingCentralSdk.server.production,
                clientId,
                clientSecret,
            });
        }

        const login = async (rcsdk) => {
            const { userName: username, password } = config
            await rcsdk
                .login({
                    username,
                    extension: '',
                    password
                })
                .then((response) => {
                    return response.json()
                })
                .catch((e) => {
                    const msg = `Login fails: ${e.message}.`
                    alert(msg)
                });
        }

        const initSDK = async () => {
            const { token, clientId, clientSecret } = config;
            let engine;
            // if config token, initialize SDK with token
            if (token) {
                engine = RcvEngine.create({ clientId, clientSecret });
                await engine.setAuthToken(JSON.stringify(token));
            }
            // else initialize SDK with username and password
            else {
                const rcsdk = initRingCentralSdk();
                await login(rcsdk);
                engine = RcvEngine.create({ httpClient: { send: options => rcsdk.platform().send(options) } });
            }

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
                <RcAppBar className='header'>
                    Demo: start a meeting with settings
                </RcAppBar>
                <Routes>
                    <Route path='meeting'>
                        <Route
                            path=':meetingId'
                            element={<InMeeting rcvEngine={rcvEngine} />
                            }
                        />
                    </Route>
                    <Route path='/' element={<StartView />} />
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