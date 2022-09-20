import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RcvEngine } from '@sdk';
import Sharing from './Sharing';
import GlobalContext from './context';
import { RcThemeProvider, RcAppBar } from '@ringcentral/juno';
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)
    const [isMeetingJoined, setMeetingJoined] = useState(false)

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
            const rcsdk = initRingCentralSdk();
            await login(rcsdk);
            const engine = RcvEngine.create(
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
        <GlobalContext.Provider value={{ isMeetingJoined, setMeetingJoined: value => setMeetingJoined(value) }} >
            <RcThemeProvider>
                <RcAppBar className='header'>
                    Demo: screen sharing
                </RcAppBar>
                <Sharing rcvEngine={rcvEngine} />
            </RcThemeProvider>
        </GlobalContext.Provider>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);