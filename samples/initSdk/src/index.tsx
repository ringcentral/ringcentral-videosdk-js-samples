import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import BtnHttpClient from './BtnHttpClient'
import BtnAccessToken from './BtnAccessToken'
import BtnJWT from './BtnJWT'
import BtnPwd from './BtnPwd'
import { RcThemeProvider, RcAppBar } from '@ringcentral/juno';
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)

    const renderContent = () => {
        if (rcvEngine === 'error') {
            return <h4>RcvEngine initialization fails!</h4>
        }
        else if (rcvEngine) {
            return <h4>RcvEngine initialization is successful!</h4>
        }
        else {
            return <>
                <BtnHttpClient config={config} setRcvEngine={setRcvEngine} />
                <BtnAccessToken config={config} setRcvEngine={setRcvEngine} />
                <BtnJWT config={config} setRcvEngine={setRcvEngine} />
                <BtnPwd config={config} setRcvEngine={setRcvEngine} />
            </>
        }
    }

    return (
        <RcThemeProvider>
            <RcAppBar className='header'>
                Demo: init SDK
            </RcAppBar>
            <div className='start-view'>
                {renderContent()}
            </div>
        </RcThemeProvider>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);