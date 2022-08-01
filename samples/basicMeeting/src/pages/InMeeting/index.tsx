import React, { FC, useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { EngineEvent, StreamEvent, AudioEvent, VideoEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { Badge, Button, ButtonGroup, Modal } from 'react-bootstrap';
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
    const [showLeaveModal, setShowLeaveModal] = useState(false);
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
    const isMySelfHostOrModerator: boolean = useMemo(() => {
        const myself = userController?.getMyself();
        return myself?.isHost || myself?.isModerator || false;
    }, [userController]);
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

    }, [meetingController, meetingId, rcvEngine])

    // audio handler
    useEffect(() => {
        const { isAudioMuted } = userController?.getMyself() || {};
        setAudioMuted(isAudioMuted || false);

        const audioMuteListener = audioController?.on(
            AudioEvent.LOCAL_AUDIO_MUTE_CHANGED,
            setAudioMuted
        );
        return () => {
            audioMuteListener?.();
        };
    }, [audioController]);

    // video handler
    useEffect(() => {
        const videoLocalMuteListener = videoController?.on(
            VideoEvent.LOCAL_VIDEO_MUTE_CHANGED,
            setVideoMute
        );
        const videoRemoteMuteListener = videoController?.on(
            VideoEvent.REMOTE_VIDEO_MUTE_CHANGED,
        );
        return () => {
            videoRemoteMuteListener?.();
            videoLocalMuteListener?.();
        };
    }, [videoController]);

    const toggleMuteAudio = useCallback(async () => {
        await audioController?.muteLocalAudioStream(!audioMuted);
    }, [audioController, audioMuted]);

    const toggleMuteVideo = useCallback(async () => {
        await videoController?.muteLocalVideoStream(!videoMute);
        console.log('...toggleMuteVideo')
    }, [videoController, videoMute]);

    const handleLeaveMeeting = useCallback(() => {
        console.log('Call leave meeting');
        if (meetingController) {
            meetingController
                .leaveMeeting()
                .catch(e => {
                })
                .finally(() => {
                });
        }
    }, [meetingController]);

    const handleEndMeeting = useCallback(async () => {
        console.log('Call end meeting');
        if (meetingController) {
            meetingController
                .endMeeting()
                .then(result => {
                })
                .catch(e => {
                });
        }
    }, [meetingController]);

    const onLeaveClick = useCallback(() => {
        if (isMySelfHostOrModerator) {
            setShowLeaveModal(true)
        }
        else {
            handleLeaveMeeting()
        }
    }, [isMySelfHostOrModerator])

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
                <Button variant="primary" onClick={toggleMuteAudio}>
                    <i className={audioMuted ? 'bi bi-mic-mute-fill' : 'bi bi-mic-fill'} />&nbsp;Audio
                </Button>
                <Button variant="success" onClick={toggleMuteVideo}>
                    <i className={videoMute ? 'bi bi-camera-video-off-fill' : 'bi bi-camera-video-fill'} />&nbsp;Video
                </Button>
                <Button variant="danger" onClick={onLeaveClick}>Leave</Button>
            </ButtonGroup>
            {/* only host or moderator could end meeting */}
            {isMySelfHostOrModerator &&
                <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='modal-wrapper'>
                        <p>
                            <Button variant="secondary" onClick={handleLeaveMeeting}>
                                Leave Meeting
                            </Button>
                        </p>
                        <p>
                            <Button variant="primary" onClick={handleEndMeeting}>
                                End Meeting
                            </Button>
                        </p>
                    </Modal.Body>
                </Modal>
            }
            <Message
                type='warning'
                msg={alert.msg}
                type={alert?.type}
                onClose={() => setAlert({ type: 'info', msg: '' })} />
        </div>
    )
}

export default InMeeting