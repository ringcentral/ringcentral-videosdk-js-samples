import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppBar, Button } from '@mui/material';
import { RcvEngine, EngineEvent, ErrorCodeType, GrantType } from '@ringcentral/video-sdk';
import {
    RcvEngineProvider,
    ActionBar,
    AudioAction,
    ChatAction,
    LeaveAction,
    LogoIcon,
    MeetingInfoAction,
    ParticipantAction,
    RecordAction,
    VideoAction,
    GalleryLayout,
    GalleryLayoutType
} from '@ringcentral/video-sdk-react';

import '@ringcentral/video-sdk-react/dist/index.css';

import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)
    const [isMeetingJoined, setMeetingJoined] = useState(false)
    const [isStartLoading, setStartLoading] = useState(false);

    useEffect(() => {

        const initSDK = async () => {
            const { clientId, clientSecret, jwt, userName, password } = config;
            // You could open 'enableDiscovery' and set 'discoveryServer' if neccessary
            const engine = RcvEngine.create({ clientId, clientSecret, enableDiscovery: false });
            // if config jwt, initialize SDK with jwt
            // else initialize SDK with password
            await engine.authorize({
                grantType: jwt ? GrantType.JWT : GrantType.PASSWORD,
                jwt,
                username: userName,
                password,
            });
            engine.on(EngineEvent.MEETING_JOINED, (meetingId, errorCode) => {
                if (errorCode === ErrorCodeType.ERR_OK) {
                    setMeetingJoined(true);
                }
            });
            engine.on(EngineEvent.MEETING_LEFT, () => {
                setMeetingJoined(false);
            });
            setRcvEngine(engine)
        }

        initSDK()
    }, [])

    const startMeetingHandler = async () => {
        setStartLoading(true)
        rcvEngine
            .startInstantMeeting()
            .catch(e => {
                alert(`Error occurs due to :${e.message}`)
            })
            .finally(() => setStartLoading(false));
    }

    return (
        <>
            <AppBar className='header' position='static'>Demo: integrated-meeting-uikit</AppBar>
            <br />
            {!isMeetingJoined &&
                <div>
                    <Button
                        variant="contained"
                        className='start-btn'
                        disabled={isStartLoading}
                        onClick={startMeetingHandler}>
                        Start meeting{isStartLoading ? '...' : ''}
                    </Button>
                </div>}
            <RcvEngineProvider rcvEngine={rcvEngine}>
                <GalleryLayout
                    layout={GalleryLayoutType.gallery}
                    style={{
                        flex: 1,
                    }}
                />
                <ActionBar
                    leftActions={[<MeetingInfoAction key={'meeting-info-action'} />]}
                    centerActions={[
                        <AudioAction key={'audio-action'} />,
                        <VideoAction key={'video-action'} />,
                        <ParticipantAction key={'participant-action'} />,
                        <ChatAction key={'chat-action'} />,
                        <RecordAction key={'record-action'} />,
                        <LeaveAction key={'leave-action'} />,
                    ]}
                    rightActions={[<LogoIcon key={'logo-icon'} />]}
                />

            </RcvEngineProvider>
        </>

    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);