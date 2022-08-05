import React, { FC, useCallback, useState, useEffect, useMemo } from 'react'
import { Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { EngineEvent } from '@sdk';
import InMeeting from './InMeeting'

interface IProps {
    rcvEngine: EngineEvent
}

const Sharing: FC<IProps> = (props) => {
    const { rcvEngine } = props
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
                        className='start-btn'
                        variant="success"
                        disabled={isStartLoading}
                        onClick={!isStartLoading ? startMeetingHandler : null}>
                        Start meeting {isStartLoading ? <Spinner animation="border" role="status" size="sm" /> : null}
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