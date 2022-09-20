import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import BtnHttpClient from './BtnHttpClient'
import BtnAccessToken from './BtnAccessToken'
import { RcThemeProvider, RcAppBar } from '@ringcentral/juno';
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)

    return (
        <RcThemeProvider>
            <RcAppBar className='header'>
                Demo: init SDK
            </RcAppBar>
            <div className='start-view'>
                {!rcvEngine &&
                    <>
                    <BtnHttpClient config={config} setRcvEngine={setRcvEngine} />
                    <BtnAccessToken config={config} setRcvEngine={setRcvEngine} />
                    </>
                }
                {rcvEngine && <h4>RcvEngine initialization is successful!</h4>}
            </div>
        </RcThemeProvider>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);