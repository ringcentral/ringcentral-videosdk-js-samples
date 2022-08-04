import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RcvEngine } from '@sdk';
import Sharing from './Sharing';
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
            setRcvEngine(engine)
        }
        initSDK()
    }, [])

    return (
        <>
            <div className='header'>Demo: screen sharing</div>
            <Sharing rcvEngine={rcvEngine} />
        </>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);