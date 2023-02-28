import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { RcvEngine, GrantType, EngineEvent } from '@ringcentral/video-sdk';
import { AppBar, Button, TextField } from '@mui/material';
import { VideoCameraFrontRounded } from '@mui/icons-material';
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)
    const [isJoinLoading, setJoinLoading] = useState(false);
    const [meetingId, setMeetingId] = useState('')
    const inputMeetingIdRef = useRef(null)
    const inputPwdRef = useRef(null)

    useEffect(() => {
        const initSDK = async () => {
            const { clientId, clientSecret, jwt, userName, password } = config;
            // You could open 'enableDiscovery' and set 'discoveryServer' if neccessary
            const engine = RcvEngine.create({
                clientId, clientSecret,
                enableDiscovery: false,
            });
            // if config jwt, initialize SDK with jwt
            // else initialize SDK with password
            await engine.authorize({
                grantType: jwt ? GrantType.JWT : GrantType.PASSWORD,
                jwt,
                username: userName,
                password,
            });

            engine.on(EngineEvent.MEETING_JOINED, (meetingId, errorCode) => {
                setMeetingId(meetingId);
            });
            engine.on(EngineEvent.MEETING_LEFT, () => {
                setMeetingId('');
            });
            setRcvEngine(engine);
        };

        initSDK();
    }, []);

    const joinMeetingHandler = () => {
        if (!inputMeetingIdRef.current.value.trim()) {
            alert('Meeting id can not be empty!')
            return;
        }
        setJoinLoading(true)
        rcvEngine
            .joinMeeting(inputMeetingIdRef.current.value, { password: inputPwdRef.current.value })
            .catch(e => {
                alert(`Error occurs due to :${e.message}`)
            })
            .finally(() => setJoinLoading(false));
    }

    return (
        <>
            <AppBar className='header' position='static'>
                Demo: the guest join a meeting
            </AppBar>
            {
                !meetingId &&
                <div className='start-view'>
                    <TextField
                        className='item'
                        label="Meeting Id"
                        variant="standard"
                        inputRef={inputMeetingIdRef}
                    />
                    <TextField
                        className='item'
                        label="Password"
                        variant="standard"
                        inputRef={inputPwdRef}
                    />
                    <Button
                        className='item'
                        variant="contained"
                        color="success"
                        startIcon={<VideoCameraFrontRounded />}
                        disabled={isJoinLoading}
                        onClick={joinMeetingHandler}>
                        Join meeting
                    </Button>
                </div>
            }
            {
                meetingId &&
                <div className='meeting-wrapper'>
                    <div>Join meeting successfully! Meeting Id: {meetingId}</div>
                </div>
            }
        </>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);