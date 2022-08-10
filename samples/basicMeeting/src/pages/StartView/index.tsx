import React, { FC, useCallback, useState, useRef } from 'react'
import { Button, InputGroup, Form, Row, Col, Spinner } from 'react-bootstrap';
import { RcvEngine } from '@sdk';
interface IProps {
    rcvEngine: RcvEngine
}

const StartView: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const [isStartLoading, setStartLoading] = useState(false);
    const [isJoinLoading, setJoinLoading] = useState(false);
    const inputRef = useRef(null)

    const startMeetingHandler = useCallback(async () => {
        if (rcvEngine) {
            setStartLoading(true)
            rcvEngine
                .startInstantMeeting()
                .catch(e => {
                    // alert(`Error occurs due to :${e.message}`)
                })
                .finally(() => setStartLoading(false));
        }
    }, [rcvEngine])

    const joinMeetingHandler = useCallback(async () => {
        if (rcvEngine) {
            if (!inputRef.current.value.trim()) {
                alert('Meeting id can not be empty!')
                return;
            }
            setJoinLoading(true)
            rcvEngine
                .joinMeeting(inputRef.current.value, {})
                .catch(e => {
                    alert(`Error occurs due to :${e.message}`)
                })
                .finally(() => setJoinLoading(false));
        }
    }, [rcvEngine])

    return (
        <Row className='start-view'>
            <Col sm={4} >
                <Button
                    className='start-btn'
                    variant="success"
                    disabled={isJoinLoading || isStartLoading}
                    onClick={!isStartLoading ? startMeetingHandler : null}>
                    Start meeting {isStartLoading ? <Spinner animation="border" role="status" size="sm" /> : null}
                </Button>
            </Col>
            <Col sm={8} >
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="please input meeting id"
                        ref={inputRef}
                    />
                    <Button
                        className='start-btn'
                        variant="primary"
                        disabled={isJoinLoading || isStartLoading}
                        onClick={!isJoinLoading ? joinMeetingHandler : null}>
                        Join meeting {isJoinLoading ? <Spinner animation="border" role="status" size="sm" /> : null}
                    </Button>
                </InputGroup>
            </Col>
        </Row>
    )
}

export default StartView