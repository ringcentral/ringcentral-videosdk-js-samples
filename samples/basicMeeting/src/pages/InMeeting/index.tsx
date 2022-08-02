import React, { FC, useEffect, useCallback, useState, useRef } from 'react'
import { EngineEvent, AudioEvent, VideoEvent, IParticipant, UserEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { Badge, Button, ButtonGroup, Modal, Spinner } from 'react-bootstrap';
import AttendeeVideoList from './AttendeeVideoList'

import './index.less';
interface IProps {
    rcvEngine: EngineEvent
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();

    const [loading, setLoading] = useState(false);
    const [activeParticipantList, updateParticipantList] = useState<IParticipant[]>([]);
    const [audioMuted, setAudioMuted] = useState(true);
    const [videoMute, setVideoMute] = useState(true);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [isHostOrModerator, setIsHostOrModerator] = useState(false)

    const meetingControllerRef = useRef(null)

    useEffect(() => {

        const initControllers = async () => {
            let meetingCtl;
            if (!rcvEngine?.getMeetingController()) {
                setLoading(true);
                meetingCtl = await rcvEngine
                    .joinMeeting(meetingId, {});
                setLoading(false)
            }
            else {
                meetingCtl = rcvEngine?.getMeetingController();
            }
            meetingControllerRef.current = meetingCtl;
            init(meetingCtl)
        }

        rcvEngine && initControllers();
    }, [meetingId, rcvEngine])

    const getAttendeeList = (users) => {
        const meetingUsers =
            users ||
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

    const init = (meetingController) => {
        const audioController = meetingController?.getAudioController()
        const userController = meetingController?.getUserController()
        const videoController = meetingController?.getVideoController()

        const myself = userController?.getMyself();
        setIsHostOrModerator(myself?.isHost || myself?.isModerator || false)
        userController.on(UserEvent.USER_JOINED, () => {
            getAttendeeList(userController?.getMeetingUsers());
        });
        userController.on(UserEvent.USER_LEFT, () => {
            getAttendeeList(userController?.getMeetingUsers());
        });
        userController.on(UserEvent.USER_UPDATED, () => {
            getAttendeeList(userController?.getMeetingUsers());
        });

        audioController.enableAudio(true);
        const audioMuteListener = audioController?.on(
            AudioEvent.LOCAL_AUDIO_MUTE_CHANGED,
            setAudioMuted
        );

        const videoLocalMuteListener = videoController?.on(
            VideoEvent.LOCAL_VIDEO_MUTE_CHANGED,
            setVideoMute
        );
        const videoRemoteMuteListener = videoController?.on(
            VideoEvent.REMOTE_VIDEO_MUTE_CHANGED,
        );

        return () => {
            audioMuteListener?.();
            videoRemoteMuteListener?.();
            videoLocalMuteListener?.();
        };
    }

    const toggleMuteAudio = useCallback(async () => {
        await meetingControllerRef.current?.getAudioController().muteLocalAudioStream(!audioMuted);
        console.log('Toggle mute/unmute Audio successfully!')
    }, [audioMuted]);

    const toggleMuteVideo = useCallback(async () => {
        await meetingControllerRef.current?.getVideoController().muteLocalVideoStream(!videoMute);
        console.log('Toggle mute/unmute Video successfully!')
    }, [, videoMute]);

    const handleLeaveMeeting = useCallback(() => {
        console.log('Call leave meeting');
        meetingControllerRef.current.leaveMeeting();

    }, []);

    const handleEndMeeting = useCallback(() => {
        console.log('Call end meeting');
        meetingControllerRef.current.endMeeting();
    }, []);

    const onLeaveClick = useCallback(() => {
        if (isHostOrModerator) {
            setShowLeaveModal(true)
        }
        else {
            handleLeaveMeeting()
        }
    }, [isHostOrModerator])

    return (
        <div className='meeting-wrapper'>
            <p>Meeting Id: <Badge bg="info">{meetingId}</Badge>
                {!meetingControllerRef.current &&
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden" />
                    </Spinner>}
            </p>
            {meetingControllerRef.current && <>
                <AttendeeVideoList
                    meetingController={meetingControllerRef.current}
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
            </>}
            <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>I want to</Modal.Title>
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
        </div>
    )
}

export default InMeeting