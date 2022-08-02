import React, { FC, useEffect, useCallback, useState, useRef } from 'react'
import { EngineEvent, AudioEvent, VideoEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup } from 'react-bootstrap';
import AttendeeVideoList from './AttendeeVideoList'

import './index.less';
interface IProps {
    rcvEngine: EngineEvent
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();

    const [loading, setLoading] = useState(false);
    const [audioMuted, setAudioMuted] = useState(true);
    const [videoMute, setVideoMute] = useState(true);

    const meetingControllerRef = useRef(null)

    useEffect(() => {

        const initControllers = async () => {
            let meetingCtl;
            // when do refreshing
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



    const init = (meetingController) => {
        const audioController = meetingController?.getAudioController()
        const videoController = meetingController?.getVideoController()

        //
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

    const toggleMuteAudio = useCallback(() => {
        meetingControllerRef.current?.getAudioController()?.muteLocalAudioStream(!audioMuted)
            .catch((e) => {
                alert(`Error occurs due to :${e.message}`)
            });
    }, [audioMuted]);

    const toggleMuteVideo = useCallback(() => {
        meetingControllerRef.current?.getVideoController()?.muteLocalVideoStream(!videoMute)
            .catch((e) => {
                alert(`Error occurs due to :${e.message}`)
            });
    }, [, videoMute]);

    const handleLeaveMeeting = useCallback(() => {
        meetingControllerRef.current?.leaveMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });

    }, []);

    const handleEndMeeting = useCallback(() => {
        meetingControllerRef.current?.endMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });
    }, []);

    return (
        <div className='meeting-wrapper'>
            <div>Meeting Id: {meetingId}</div>
                <AttendeeVideoList
                meetingController={meetingControllerRef.current}
                    loading={loading}
                />
                <ButtonGroup>
                    <Button variant="primary" onClick={toggleMuteAudio}>
                        <i className={audioMuted ? 'bi bi-mic-mute-fill' : 'bi bi-mic-fill'} />&nbsp;Audio
                    </Button>
                    <Button variant="success" onClick={toggleMuteVideo}>
                        <i className={videoMute ? 'bi bi-camera-video-off-fill' : 'bi bi-camera-video-fill'} />&nbsp;Video
                    </Button>
                    <Button variant="warning" onClick={handleLeaveMeeting}>Leave</Button>
                    <Button variant="danger" onClick={handleEndMeeting}>End</Button>
            </ButtonGroup>
        </div>
    )
}

export default InMeeting