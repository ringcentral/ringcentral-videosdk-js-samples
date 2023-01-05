import React, { FC, useCallback, useState, useRef } from 'react'
import { Button, Alert, TextField } from '@mui/material';
import { VideoCameraFrontRounded, QueuePlayNextRounded } from '@mui/icons-material';
import { RcvEngine } from '@sdk';
interface IProps {
    rcvEngine: RcvEngine
}

const StartView: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const [isStartLoading, setStartLoading] = useState(false);
    const [isJoinLoading, setJoinLoading] = useState(false);
    const inputMeetingIdRef = useRef(null)
    const inputPwdRef = useRef(null)

    const startMeetingHandler = useCallback(async () => {
        if (rcvEngine) {
            setStartLoading(true)
            rcvEngine
                .startInstantMeeting()
                .catch(e => {
                    alert(`Error occurs due to :${e.message}`)
                })
                .finally(() => setStartLoading(false));
        }
    }, [rcvEngine])

    const joinMeetingHandler = useCallback(async () => {
        if (rcvEngine) {
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
    }, [rcvEngine])

    const getAlertText = ()=>{
        if (isStartLoading){
            return <span>Starting a meeting<span className="dotting"></span></span>
        }
        else if (isJoinLoading){
            return <span>Joining a meeting<span className="dotting"></span></span>
        }
        return "Please start or join a meeting."
    }

    return (
        <>
            <Alert severity="info"> {getAlertText()}</Alert>
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
                    startIcon={<QueuePlayNextRounded />}
                    disabled={isJoinLoading || isStartLoading}
                    onClick={!isStartLoading ? startMeetingHandler : null}>
                    Start meeting
                </Button>
                <Button
                    className='item'
                    variant="contained"
                    color="success"
                    startIcon={<VideoCameraFrontRounded />}
                    disabled={isJoinLoading || isStartLoading}
                    onClick={!isJoinLoading ? joinMeetingHandler : null}>
                    Join meeting
                </Button>
            </div>
        </>
    )
}

export default StartView