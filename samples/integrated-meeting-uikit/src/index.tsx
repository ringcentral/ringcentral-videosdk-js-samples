import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { AppBar } from '@mui/material';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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
import StartView from "./pages/StartView";

import '@ringcentral/video-sdk-react/dist/index.css';
import './index.less'

declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)
    const navigate = useNavigate();

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
                    if (!window.location.pathname.includes('/meeting/')) {
                        navigate(`/meeting/${meetingId}`);
                    }
                }
            });
            engine.on(EngineEvent.MEETING_LEFT, () => {
                navigate('/', { replace: true });
            });
            setRcvEngine(engine)
        }

        initSDK().then();
    }, []);

    return (
        <SnackbarProvider>
            <AppBar className='header' position='static'>Demo: integrated-meeting-uikit</AppBar>
            <Routes>
                <Route path='meeting'>
                    <Route
                      path=':meetingId'
                      element={
                          <div className={'meeting-container'}>
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
                          </div>
                      }
                    />
                </Route>
                <Route path='/' element={<StartView rcvEngine={rcvEngine} />} />
            </Routes>
        </SnackbarProvider>

    )
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App config={{
        ...window.initConfig,
    }} />
  </BrowserRouter>
);
