import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import { RcvEngine } from '@sdk';
import VideoMeeting from './meeting';
import { getHttpClient, initRingcentralSDKByPasword } from './utils/initAuth';
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
            const rcvEngine = new RcvEngine(
                getHttpClient(rcsdk, config.origin),
                authData
            );
            setRcvEngine(rcvEngine)
        }
        initSDK()

    }, [])

    return (
        <VideoMeeting rcvEngine={rcvEngine} />
    )
}

ReactDOM.render(
    <React.StrictMode>
        <App config={{
            ...window.initConfig,
        }} />
    </React.StrictMode>,
    document.getElementById("root")
)