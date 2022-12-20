import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { RcvEngine, EngineEvent, ErrorCodeType, GrantType } from '@sdk';
import { RcThemeProvider } from '@ringcentral/juno';
import StartView from './pages/StartView';
import InMeeting from './pages/InMeeting';
import GlobalContext from './store/global/context';
import { MeetingContextProvider } from './store/meeting';
import './index.less';
declare global {
    interface Window {
        initConfig: Record<string, string>;
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null);
    const [isMeetingJoined, setMeetingJoined] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const initSDK = async () => {
            const { clientId, clientSecret, jwt, userName, password } = config;

            const engine = RcvEngine.create({
                clientId,
                clientSecret,
                enableDiscovery: false,
            });

            // await engine?.setAuthToken(
            //     JSON.stringify({
            //         access_token:
            //             'U0pDMDFQMDlQQVMwMHxBQUR3bU9kbEpXc2JYLTJ5bF9fVEFOQTlpWVJ1bmtSSXpfOVNsTWptbzNaV1pXT2VFNDVLMmFqeFg1NEhIc1BzUzRLckpYVXdwTXZsZmFCYWtXM21iU1dVdGxVX2Ixd2l4eUZkckZlbG1nSTAxNDc2Tm91Y1Z4X1hZc2VMd2J6eFR2a0NOdmhGcVI1ellUeTY3dElpYXlnSjhBTmE2Z29fZmZNZnc4aVdzSkpCQUQ2Skt3NEs3N2hrZ3ktalI0eHo5N1VjWWYyZnFKNHxoYjlvSXd8WnRPV0ZvQ3hVSmxRTENVdDFXMjlOd3xBUXxBQXxBQUFBQU9sZlp0QQ',
            //         token_type: 'bearer',
            //         expires_in: 3600,
            //         refresh_token:
            //             'U0pDMDFQMDlQQVMwMHxBQUJid2JQdGJmeFQyRVdKT0NWRHNYOWpZcG1nS0tHa1lQSVNkMEZkenZMYmtqOFdFWXdYVC1odE5NYnpiNVRpUEFDcG9ITDZMZWxhTm0xZTIzaXdaRHZpR0wyMlhvenVJcEkzcFJqVTFGd3FUUEM4U0FuSFFSbXlkaXlDZ3V6QmQtaHBpbWtWMXMtaWF2N0Q2VG0xTVo0aGhjbUd2N2FZRENpQWFJSkJHdzFLYzdHTjItNHFsVWMxcmoteFdiTXJpc2Y3WlBQRkMxSXxoYjlvSXd8aEdncUZ3ZXNSTVhDdzhJaV9OOEhyZ3xBUXxBQXxBQUFBQUpWbko5SQ',
            //         refresh_token_expires_in: 604800,
            //         scope: 'ReadAccounts ControlWebinars Meetings AI EditWebinars TeamMessaging ReadClientInfo Glip SendNotifications SendUsageInfo WebSocket',
            //         owner_id: '2239761021',
            //         endpoint_id: 'FU3OohzzT7eG8w3rIRhq8g',
            //     })
            // );

            await engine.authorize({
                grantType: jwt ? GrantType.JWT : GrantType.PASSWORD,
                jwt,
                username: userName,
                password,
            });

            engine.on(EngineEvent.MEETING_JOINED, (meetingId, errorCode) => {
                if (errorCode === ErrorCodeType.ERR_OK) {
                    setMeetingJoined(true);
                    if (!window.location.pathname.includes('/meeting/')) {
                        navigate(`/meeting/${meetingId}`);
                    }
                }
            });
            engine.on(EngineEvent.MEETING_LEFT, () => {
                navigate('/', { replace: true });
            });
            setRcvEngine(engine);
        };

        initSDK();
    }, []);

    return (
        <GlobalContext.Provider value={{ rcvEngine, isMeetingJoined }}>
            <RcThemeProvider>
                <Routes>
                    <Route path='meeting'>
                        <Route
                            path=':meetingId'
                            element={
                                <MeetingContextProvider>
                                    <InMeeting />
                                </MeetingContextProvider>
                            }
                        />
                    </Route>
                    <Route path='/' element={<StartView rcvEngine={rcvEngine} />} />
                </Routes>
            </RcThemeProvider>
        </GlobalContext.Provider>
    );
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App
            config={{
                ...window.initConfig,
            }}
        />
    </BrowserRouter>
);
