import React, { FC, useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { EngineEvent, StreamEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { Badge, Button, ButtonGroup } from 'react-bootstrap';
import Message, { IAlert } from '../../components/Message'

import './index.less';
interface IProps {
    rcvEngine: EngineEvent
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();
    const [alert, setAlert] = useState<IAlert>({ type: 'info', msg: '' });
    const [audioMuted, setAudioMuted] = useState(true);
    const [videoMute, setVideoMute] = useState(true);
    const remoteVideoRef = useRef<HTMLVideoElement>({} as HTMLVideoElement);
    const localVideoRef = useRef<HTMLVideoElement>({} as HTMLVideoElement);
    const meetingController = useMemo(
        () => rcvEngine?.getMeetingController(),
        [rcvEngine, rcvEngine?.getMeetingController()]
    );
    const userController = useMemo(
        () => meetingController?.getUserController(),
        [meetingController]
    );
    const audioController = useMemo(
        () => meetingController?.getAudioController(),
        [meetingController]
    );
    const videoController = useMemo(
        () => meetingController?.getVideoController(),
        [meetingController]
    );
    const streamManager = meetingController?.getStreamManager();

    useEffect(() => {
        if (meetingController) {
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_ADDED, stream => {
                remoteVideoRef.current.srcObject = stream.stream
            });
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_REMOVED, stream => {
                remoteVideoRef.current.srcObject = null
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, stream => {
                localVideoRef.current.srcObject = stream.stream
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
                localVideoRef.current.srcObject = null
            });
        }
        else {
            rcvEngine
                ?.joinMeeting(meetingId as string)
                .catch(e => {

                });
        }

    }, [meetingController, meetingId])

    return (
        <div className='meeting-wrapper'>
            <p>Meeting Id: <Badge bg="info">{meetingId}</Badge></p>
            <div className='video-wrapper'>
                <video
                    className='video-elt'
                    autoPlay={true}
                    muted={true}
                    ref={localVideoRef}
            />
                <video
                    className='video-elt'
                    autoPlay={true}
                    muted={true}
                    ref={remoteVideoRef}
            />
            </div>
            <ButtonGroup>
                <Button variant="primary">
                    <i className={audioMuted ? 'bi bi-mic-mute-fill' : 'bi bi-mic-fill'} />&nbsp;Audio
                </Button>
                <Button variant="success">
                    <i className={videoMute ? 'bi bi-camera-video-off-fill' : 'bi bi-camera-video-fill'} />&nbsp;Video
                </Button>
                <Button variant="danger">Leave</Button>
            </ButtonGroup>
            {<Message
                type='warning'
                msg={alert.msg}
                type={alert?.type}
                onClose={() => setAlert({ type: 'info', msg: '' })} />}
        </div>
    )
}

export default InMeeting