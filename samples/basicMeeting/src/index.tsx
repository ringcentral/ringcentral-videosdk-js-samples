import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
            const rcvEngine = new RcvEngine(
                getHttpClient(rcsdk, config.origin),
                authData
            );
            if (rcvEngine) {
                rcvEngine.on(EngineEvent.MEETING_JOINED, (meetingId, errorCode) => {
                    navigate(`/meeting/${meetingId}`);
                });
                rcvEngine.on(EngineEvent.MEETING_LEFT, () => {
                    navigate('/', { replace: true });
                });
                rcvEngine.on(
                    EngineEvent.MEETING_STATE_CHANGED,
                    () => {

                    }
                );
            }
            setRcvEngine(rcvEngine)
        }
        initSDK()

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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
        <App config={{
            ...window.initConfig,
        }} />
        </BrowserRouter>
    </React.StrictMode>
);