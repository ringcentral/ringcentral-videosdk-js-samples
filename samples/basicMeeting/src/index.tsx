import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { RcvEngine, EngineEvent, ErrorCodeType } from '@sdk';
import { RcThemeProvider, RcAppBar } from '@ringcentral/juno';
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

        const initRcvEngine = (rcsdk) => {
            const engine = RcvEngine.create(
                {
                    httpClient: {
                        send: options => rcsdk.platform().send(options),
                    },
                }
            );
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

        const initSDK = async () => {
            const rcsdk = initRingCentralSdk();
            await login(rcsdk);
            initRcvEngine(rcsdk)
        }

        initSDK()
    }, [])

    return (
        <GlobalContext.Provider value={{ isMeetingJoined }}>
            <RcThemeProvider>
                <RcAppBar style={{ lineHeight: '56px', padding: '0 20px' }}>
                    Demo: basic meeting with mute/unmute audio/video
                </RcAppBar>
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