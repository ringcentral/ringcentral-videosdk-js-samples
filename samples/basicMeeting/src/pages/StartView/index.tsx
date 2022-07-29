import React, { FC, useCallback } from 'react'
import { Button, InputGroup, Form } from 'react-bootstrap';
import { EngineEvent } from '@sdk';
import './index.less';

interface IProps {
    rcvEngine: EngineEvent
}

const StartView: FC<IProps> = (props) => {
    const { rcvEngine } = props

    const startMeetingHandler = useCallback(async () => {
        rcvEngine.startInstantMeeting();
    }, [rcvEngine])

    const joinMeetingHandler = useCallback(async () => {
    }, [rcvEngine])

    return (
        <div className='start-view row'>
            <div className="col-4">
                <Button variant="success" onClick={startMeetingHandler}>start meeting</Button>
            </div>
            <div className="col-8">
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="please input meeting id"
                        aria-label="meeting id"
                        aria-describedby="meeting id"
                    />
                    <Button variant="primary" onClick={joinMeetingHandler}>
                        join meeting
                    </Button>
                </InputGroup>
            </div>
        </div>)
}

export default StartView