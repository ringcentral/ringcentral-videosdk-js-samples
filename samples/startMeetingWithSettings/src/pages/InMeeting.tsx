import React, { FC, useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom';
import { RcvEngine, IMeetingInfo } from '@sdk';
import { Button, ButtonGroup } from 'react-bootstrap';

interface IProps {
    rcvEngine: RcvEngine
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();

    const meetingController = useMemo(
        () => rcvEngine?.getMeetingController(),
        [rcvEngine, rcvEngine?.getMeetingController()]
    );

    useEffect(() => {
        const initController = async () => {
            let meetingCtl;

            if (rcvEngine?.getMeetingController()) {
                meetingCtl = rcvEngine?.getMeetingController();
            }
            // when do refreshing
            else {
                meetingCtl = await rcvEngine
                    .joinMeeting(meetingId);
            }
        }

        rcvEngine && initController();
    }, [meetingId, rcvEngine])

    const handleEndMeeting = () => {
        meetingController?.endMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });
    }

    return (
        <div className='meeting-wrapper'>
            <ButtonGroup>
                <Button variant="danger" onClick={handleEndMeeting}>End meeting</Button>
            </ButtonGroup>
        </div>
    )
}

export default InMeeting