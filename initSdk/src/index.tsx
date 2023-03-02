import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import BtnHttpClient from './BtnHttpClient'
import BtnAccessToken from './BtnAccessToken'
import BtnJWT from './BtnJWT'
import BtnPwd from './BtnPwd'
import { AppBar } from '@mui/material';
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
                <div>
                    <BtnHttpClient config={config} setRcvEngine={setRcvEngine} />
                    <BtnAccessToken config={config} setRcvEngine={setRcvEngine} />
                </div>
                <br />
                <div>
                    <BtnJWT config={config} setRcvEngine={setRcvEngine} />
                    <BtnPwd config={config} setRcvEngine={setRcvEngine} />
                </div>
            </>
        }
    }

    return (
        <div>
            <AppBar className='header' position="static">
                Demo: init SDK
            </AppBar>
            <div className='start-view'>
                {renderContent()}
            </div>
        </div>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);