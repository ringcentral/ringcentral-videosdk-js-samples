import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RcThemeProvider, RcAppBar, RcTab, RcTabs, RcTabPanel, RcTabContext } from '@ringcentral/juno';
import { RcvEngine } from '@sdk'
import TabAudioTest from './TabAudioTest'
import TabVideoTest from './TabVideoTest'
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)
    const [tab, setTab] = React.useState('audio');

    useEffect(() => {
        const { clientId, clientSecret } = config
        if (!clientId || !clientSecret) {
            const msg = `It needs clientId and clientSecret. Please check app.config.js!`
            alert(msg)
            return;
        }
        // You could open 'enableDiscovery' and set 'discoveryServer' if neccessary
        const engine = RcvEngine.create({ clientId, clientSecret, enableDiscovery: false });
        setRcvEngine(engine)
    }, [])

    return (
        <RcThemeProvider>
            <RcAppBar className='header'>
                Demo: audio/video device test
            </RcAppBar>
            <div className='start-view'>
                <RcTabContext value={tab}>
                    <RcTabs value={tab} onChange={(event: React.ChangeEvent<{}>, value: any) => setTab(value)}>
                        <RcTab value="audio" label="Audio Test" />
                        <RcTab value="video" label="Video Test" />
                    </RcTabs>
                    <RcTabPanel value="audio">
                        <TabAudioTest rcvEngine={rcvEngine} />
                    </RcTabPanel>
                    <RcTabPanel value="video">
                        <TabVideoTest rcvEngine={rcvEngine} />
                    </RcTabPanel>
                </RcTabContext>
            </div>
        </RcThemeProvider>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);