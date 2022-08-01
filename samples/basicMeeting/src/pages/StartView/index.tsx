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
    const [isStartLoading, setStartLoading] = useState(false);
    const [isJoinLoading, setJoinLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null)

    const startMeetingHandler = useCallback(async () => {
        setStartLoading(true)
        rcvEngine
            .startInstantMeeting()
            .catch(e => {
                setError(`Error occurs due to :${e.message}`)
            })
            .finally(() => setStartLoading(false));

    }, [rcvEngine])

    const joinMeetingHandler = useCallback(async () => {
        if (!inputRef.current.value.trim()) {
            setError('Meeting id can not be empty!')
            return;
        }
        setJoinLoading(true)
        rcvEngine
            .joinMeeting(inputRef.current.value, {})
            .catch(e => {
                setError(`Error occurs due to :${e.message}`)
            })
            .finally(() => setJoinLoading(false));
    }, [rcvEngine])

    return (
        <>
            <Row className='start-view'>
                <Col sm={4} >
                    <Button
                        className='start-btn'
                        variant="success"
                        disabled={isJoinLoading || isStartLoading}
                        onClick={!isStartLoading ? startMeetingHandler : null}>
                        <i className="bi bi-camera-reels" />&nbsp;
                        Start meeting{isStartLoading ? <span className='dotting'></span> : null}
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
                            disabled={isJoinLoading || isStartLoading}
                            onClick={!isJoinLoading ? joinMeetingHandler : null}>
                            <i className="bi bi-box-arrow-in-right" />&nbsp;
                            Join meeting{isJoinLoading ? <span className='dotting'></span> : null}
                        </Button>
                    </InputGroup>
                </Col>
            </Row>
            <Message type='warning' msg={error} onClose={() => setError('')} />
        </>)
}

export default StartView