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
                    const msg = `Login fails: ${e.message}. Please check app.config.js to verify your configuration!`
                    alert(msg)
                });
        }

        const initSDK = async () => {
            const rcsdk = initRingCentralSdk();
            await login(rcsdk);
            const engine = new RcvEngine(
                {
                    httpClient: {
                        send: options => rcsdk.platform().send(options),
                    },
                }
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