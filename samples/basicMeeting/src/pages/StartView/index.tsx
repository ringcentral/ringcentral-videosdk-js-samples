import React, { FC, useCallback, useState, useRef } from 'react'
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';
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

    return (
        <Row className='start-view'>
            <Col sm={3}>
                <Form.Group>
                    Meeting Id:
                    <Form.Control ref={inputMeetingIdRef} type="text" placeholder="please input meeting id" />
                </Form.Group>
            </Col>
            <Col sm={3}>
                <Form.Group>
                    Password:
                    <Form.Control ref={inputPwdRef} type="text" placeholder="please input password" />
                </Form.Group>
            </Col>
            <Col sm={5}>
                <Button
                    className='start-btn'
                    variant="primary"
                    disabled={isJoinLoading || isStartLoading}
                    onClick={!isJoinLoading ? joinMeetingHandler : null}>
                    Join meeting {isJoinLoading ? <Spinner animation="border" role="status" size="sm" /> : null}
                </Button>
                <Button
                    className='start-btn'
                    variant="success"
                    disabled={isJoinLoading || isStartLoading}
                    onClick={!isStartLoading ? startMeetingHandler : null}>
                    Start meeting {isStartLoading ? <Spinner animation="border" role="status" size="sm" /> : null}
                </Button>
            </Col>
        </Row>
    )
}

export default StartView