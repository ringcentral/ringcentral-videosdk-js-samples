import React, { FC, useCallback, useState, useRef } from 'react'
import { Button, TextField } from '@mui/material';
import { VideoCameraFrontRounded, QueuePlayNextRounded } from '@mui/icons-material';
import { RcvEngine } from '@ringcentral/video-sdk';
interface IProps {
    rcvEngine: RcvEngine
}

const StartView: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const [isStartLoading, setStartLoading] = useState(false);
    const [isJoinLoading, setJoinLoading] = useState(false);
    const inputMeetingIdRef = useRef(null)

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
                .joinMeeting(inputMeetingIdRef.current.value)
                .catch(e => {
                    alert(`Error occurs due to :${e.message}`)
                })
                .finally(() => setJoinLoading(false));
        }
    }, [rcvEngine])

    return (
        <div className='start-view'>
            <TextField
                variant="standard"
                label="Meeting Id"
                id="control"
                inputRef={inputMeetingIdRef}
            />
            <Button
                className='start-btn'
                variant="contained"
                color="success"
                startIcon={<QueuePlayNextRounded />}
                disabled={isJoinLoading || isStartLoading}
                onClick={!isStartLoading ? startMeetingHandler : null}>
                Start meeting{isStartLoading ? '...' : ''}
            </Button>
            <Button
                className='start-btn'
                variant="contained"
                startIcon={<VideoCameraFrontRounded />}
                onClick={!isJoinLoading ? joinMeetingHandler : null}>
                Join meeting{isJoinLoading ? '...' : ''}
            </Button>

        </div>
    )
}

export default StartView