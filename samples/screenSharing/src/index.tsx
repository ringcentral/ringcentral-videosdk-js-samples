import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RcvEngine, EngineEvent } from '@sdk';
import Sharing from './pages/Sharing';
import { getHttpClient, initRingcentralSDKByPasword } from './utils/initAuth';
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)

    useEffect(() => {
        const initSDK = async () => {
            const { rcsdk, authData } = await initRingcentralSDKByPasword(config);
            const engine = new RcvEngine(
                getHttpClient(rcsdk, config.origin),
                authData
            );
            // listen for meeing_joined/meeting_left events
            engine.on(EngineEvent.MEETING_JOINED, (meetingId, errorCode) => {
            });
            engine.on(EngineEvent.MEETING_LEFT, () => {
            });
            setRcvEngine(engine)
        }
        initSDK()
    }, [])

    return (
        <>
            <div className='header'>Demo: basic meeting with mute/unmute audio/video</div>
            <Sharing rcvEngine={rcvEngine} />
        </>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);