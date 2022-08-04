import React, { FC, useCallback, useState, useRef } from 'react'
import { Button, InputGroup, Form, Row, Col, Spinner } from 'react-bootstrap';
import { EngineEvent } from '@sdk';
interface IProps {
    rcvEngine: EngineEvent
}

const Sharing: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const [isStartLoading, setStartLoading] = useState(false);

    const startMeetingHandler = useCallback(async () => {
        setStartLoading(true)
        rcvEngine
            .startInstantMeeting()
            .catch(e => {
                alert(`Error occurs due to :${e.message}`)
            })
            .finally(() => setStartLoading(false));

    }, [rcvEngine])


    return (
        <>
        <Row className='start-view'>
            <Col sm={4} >
                <Button
                    className='start-btn'
                    variant="success"
                        disabled={isStartLoading}
                    onClick={!isStartLoading ? startMeetingHandler : null}>
                    Start meeting {isStartLoading ? <Spinner animation="border" role="status" size="sm" /> : null}
                </Button>
                </Col>
        </Row>
            <Row>

            </Row>
        </>
    )
}

export default Sharing