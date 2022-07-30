import React, { FC, useCallback, useState, useRef } from 'react'
import { Button, InputGroup, Form, Row, Col } from 'react-bootstrap';
import { EngineEvent } from '@sdk';
import Message from '../../components/Message'
import './index.less';

interface IProps {
    rcvEngine: EngineEvent
}

const StartView: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null)

    const startMeetingHandler = useCallback(async () => {
        setLoading(true)
        try {
            await rcvEngine.startInstantMeeting();
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }, [rcvEngine])

    const joinMeetingHandler = useCallback(async () => {
        console.log('input value:::', inputRef.current.value)
        if (!inputRef.current.value.trim()) {
            setError('Meeting id can not be empty!')
        }
    }, [rcvEngine])

    return (
        <>
            <div className='start-view row'>
                <Row>
                    <Col sm={4} >
                        <Button
                            className='start-btn'
                            variant="success"
                            disabled={isLoading}
                            onClick={!isLoading ? startMeetingHandler : null}>
                            <i className="bi bi-camera-reels" />&nbsp;
                            {isLoading ? 'Starting…' : 'Start meeting'}
                        </Button>
                    </Col>
                    <Col sm={8} >
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="please input meeting id"
                                aria-label="meeting id"
                                aria-describedby="meeting id"
                                ref={inputRef}
                            />
                            <Button
                                className='start-btn'
                                variant="primary"
                                onClick={joinMeetingHandler}>
                                <i className="bi bi-box-arrow-in-right" />&nbsp;
                                {isLoading ? 'Joining…' : 'Join meeting'}
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </div>
            <Message type='warning' msg={error} onClose={() => setError('')} />
        </>)
}

export default StartView