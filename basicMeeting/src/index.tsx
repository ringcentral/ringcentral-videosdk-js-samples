import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import { RcvEngine } from '@sdk';
import VideoMeeting from './VideoMeeting';
import { getHttpClient, getInitConfig, initRcvEngine, initRingcentralSDKByPasword } from './utils/initAuth';
import './index.less'

export default function App() {
    const [rcvEngine, setRcvEngine] = useState(null)

    useEffect(() => {
        const initSDK = async () => {
            const { rcsdk, authData } = await initRingcentralSDKByPasword();
            const rcvEngine = new RcvEngine(
                getHttpClient(rcsdk),
                getInitConfig(authData)
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
        <App />
    </React.StrictMode>,
    document.getElementById("root")
)