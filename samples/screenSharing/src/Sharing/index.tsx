import React, { FC, useCallback, useState, useEffect, useMemo } from 'react'
import { Button } from '@mui/material';
import { RcvEngine, EngineEvent } from '@sdk';
import InMeeting from './InMeeting'
import { useGlobalContext } from '../context';
interface IProps {
    rcvEngine: RcvEngine
}

const Sharing: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { setMeetingJoined } = useGlobalContext();
    const [isStartLoading, setStartLoading] = useState(false);
    const [meetingId, setMeetingId] = useState('')

    const meetingController = useMemo(
        () => rcvEngine?.getMeetingController(),
        [rcvEngine, rcvEngine?.getMeetingController()]
    );

    useEffect(() => {
        if (rcvEngine) {
            // listen for meeing_joined/meeting_left events
            rcvEngine.on(EngineEvent.MEETING_JOINED, (meetingId, errorCode) => {
                setMeetingJoined(true)
                setMeetingId(meetingId)
            });
            rcvEngine.on(EngineEvent.MEETING_LEFT, () => {
                setMeetingId('')
            });
        }
    }, [rcvEngine])

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

    return (
        <>
            {
                !meetingId &&
                <div className='start-view'>
                    <Button
                        variant="contained"
                        className='start-btn'
                        disabled={isStartLoading}
                        onClick={!isStartLoading ? startMeetingHandler : null}>
                        Start meeting{isStartLoading ? '...' : ''}
                    </Button>
                </div>
            }
            {
                meetingId &&
                <div className='meeting-wrapper'>
                    <div>Meeting Id: {meetingId}</div>
                    <InMeeting meetingController={meetingController} />
                </div>
            }
        </>
    )
}

export default Sharing