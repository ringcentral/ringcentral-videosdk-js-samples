import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppBar, Tab, Tabs, Box } from '@mui/material';
import { RcvEngine } from '@ringcentral/video-sdk'
import TabAudioTest from './TabAudioTest'
import TabVideoTest from './TabVideoTest'
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

interface TabPanelProps {
    children?: React.ReactNode;
    tab: string;
    value: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, tab } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== tab}
            id={`simple-tabpanel-${tab}`}
            aria-labelledby={`simple-tab-${tab}`}
        >
            {value === tab && <div>{children}</div>}
        </div>
    );
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
        <div>
            <AppBar className='header' position='static'>
                Demo: audio/video device test
            </AppBar>
            <div className='start-view'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={(event: React.ChangeEvent<{}>, value: any) => setTab(value)}>
                        <Tab value="audio" label="Audio Test" />
                        <Tab value="video" label="Video Test" />
                    </Tabs>
                </Box>
                <TabPanel value="audio" tab={tab}>
                    <TabAudioTest rcvEngine={rcvEngine} />
                </TabPanel>
                <TabPanel value="video" tab={tab}>
                    <TabVideoTest rcvEngine={rcvEngine} />
                </TabPanel>
            </div>
        </div>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);