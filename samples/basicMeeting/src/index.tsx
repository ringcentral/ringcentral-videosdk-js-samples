import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { RcvEngine, EngineEvent } from '@sdk';
import StartView from './pages/StartView';
import InMeeting from './pages/InMeeting';
import { getHttpClient, initRingcentralSDKByPasword } from './utils/initAuth';
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const initSDK = async () => {
            const { rcsdk, authData } = await initRingcentralSDKByPasword(config);
            const engine = new RcvEngine(
                getHttpClient(rcsdk, config.origin),
                authData
            );
            if (engine) {
                window['librct'] = engine
                engine.on(EngineEvent.MEETING_JOINED, (meetingId, errorCode) => {
                    navigate(`/meeting/${meetingId}`);
                });
                engine.on(EngineEvent.MEETING_LEFT, () => {
                    navigate('/', { replace: true });
                });
                engine.on(
                    EngineEvent.MEETING_STATE_CHANGED,
                    () => {

                    }
                );
            }
            setRcvEngine(engine)
        }
        !rcvEngine && initSDK()
    }, [])

    return (
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

    )
}

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App config={{
                ...window.initConfig,
            }} />
        </BrowserRouter>
    </React.StrictMode>
);