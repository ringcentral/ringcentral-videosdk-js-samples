import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tab, Tabs } from 'react-bootstrap';
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

    useEffect(() => {
        const { clientId, clientSecret } = config
        if (!clientId || !clientSecret) {
            const msg = `It needs clientId and clientSecret. Please check app.config.js!`
            alert(msg)
            return;
        }
        const engine = new RcvEngine({ clientId, clientSecret });
        setRcvEngine(engine)
    }, [])

    return (
        <>
            <div className='header'>Demo: audio/video device test</div>
            <div className='start-view'>
                <Tabs defaultActiveKey="audio-test">
                    <Tab eventKey="audio-test" title="Audio Test">
                        <TabAudioTest rcvEngine={rcvEngine} />
                    </Tab>
                    <Tab eventKey="video-test" title="Video Test">
                        <TabVideoTest rcvEngine={rcvEngine} />
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);