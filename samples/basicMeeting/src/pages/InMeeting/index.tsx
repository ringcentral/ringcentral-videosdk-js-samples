import React, { FC, useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { EngineEvent, StreamEvent, AudioEvent, VideoEvent, IParticipant, UserEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { Badge, Button, ButtonGroup, Modal } from 'react-bootstrap';
import Message, { IMessage } from '../../components/Message'
import AttendeeVideoList from './AttendeeVideoList'

import './index.less';
interface IProps {
    rcvEngine: EngineEvent
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();
    const [msg, setMsg] = useState<IMessage>({ type: 'info', msg: '' });
    const [loading, setLoading] = useState(false);
    const [activeParticipantList, updateParticipantList] = useState<IParticipant[]>([]);
    const [audioMuted, setAudioMuted] = useState(true);
    const [videoMute, setVideoMute] = useState(true);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
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

    useEffect(() => {
        if (rcvEngine && !meetingController) {
            setLoading(true);
            rcvEngine
                .joinMeeting(meetingId as string)
                .then(() => setLoading(false))
                .catch(e => {

                });
        }
    }, [meetingController, meetingId, rcvEngine])

    // audio event handler
    useEffect(() => {
        if (audioController) {
            const { isAudioMuted } = userController?.getMyself() || {};
            audioController.enableAudio(true);
            setAudioMuted(isAudioMuted || false);

            const audioMuteListener = audioController?.on(
                AudioEvent.LOCAL_AUDIO_MUTE_CHANGED,
                setAudioMuted
            );
            return () => {
                audioMuteListener?.();
            };
        }
    }, [audioController]);

    // video event handler
    useEffect(() => {
        if (videoController) {
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
        }
    }, [videoController]);

    // user event handler
    useEffect(() => {
        const getAttendeeList = () => {
            const meetingUsers =
                userController?.getMeetingUsers() ||
                ({} as {
                    [k: string]: IParticipant;
                });
            const localParticipant = Object.values(meetingUsers).filter(
                participant => participant.isMe
            );
            const activeRemoteParticipants = Object.values(meetingUsers).filter(
                participant => !participant.isDeleted && !participant.isMe
            );
            updateParticipantList([...localParticipant, ...activeRemoteParticipants]);
        };

        if (userController) {
            userController.on(UserEvent.USER_JOINED, (participant: IParticipant) => {
                getAttendeeList();
            });
            userController.on(UserEvent.USER_LEFT, (participant: IParticipant) => {
                getAttendeeList();
            });
            userController.on(UserEvent.USER_UPDATED, (participant: IParticipant) => {
                getAttendeeList();
            });
            getAttendeeList();
        }
    }, [userController]);

    const toggleMuteAudio = useCallback(async () => {
        await audioController?.muteLocalAudioStream(!audioMuted);
    }, [audioController, audioMuted]);

    const toggleMuteVideo = useCallback(async () => {
        await videoController?.muteLocalVideoStream(!videoMute);
        console.log('...toggleMuteVideo')
    }, [videoController, videoMute]);

    const handleLeaveMeeting = useCallback(() => {
        console.log('Call leave meeting');
        meetingController?.leaveMeeting();
    }, [meetingController]);

    const handleEndMeeting = useCallback(async () => {
        console.log('Call end meeting');
        meetingController?.endMeeting();
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
            <AttendeeVideoList
                meetingController={meetingController}
                participants={activeParticipantList}
                loading={loading}
            />
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