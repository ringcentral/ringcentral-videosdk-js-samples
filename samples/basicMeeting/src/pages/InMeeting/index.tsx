import React, { FC, useEffect, useState, useMemo } from 'react'
import { EngineEvent, AudioEvent, VideoEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup } from 'react-bootstrap';
import AttendeeVideoList from './AttendeeVideoList'
interface IProps {
    rcvEngine: EngineEvent
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();

    const [loading, setLoading] = useState(false);
    const [audioMuted, setAudioMuted] = useState(true);
    const [videoMute, setVideoMute] = useState(true);

    const meetingController = useMemo(
        () => rcvEngine?.getMeetingController(),
        [rcvEngine, rcvEngine?.getMeetingController()]
    );

    useEffect(() => {

        const initController = async () => {
            let meetingCtl;

            if (rcvEngine?.getMeetingController()) {
                meetingCtl = rcvEngine?.getMeetingController();
            }
            // when do refreshing
            else {
                setLoading(true);
                meetingCtl = await rcvEngine
                    .joinMeeting(meetingId, {});
                setLoading(false)
            }
            initListener(meetingCtl)
        }

        rcvEngine && initController();
    }, [meetingId, rcvEngine])

    const initListener = (meetingController) => {
        const audioController = meetingController?.getAudioController()
        const videoController = meetingController?.getVideoController()

        // enable video firstly
        audioController.enableAudio(true);
        // listen for audio unmute/mute events
        const audioMuteListener = audioController?.on(
            AudioEvent.LOCAL_AUDIO_MUTE_CHANGED,
            setAudioMuted
        );
        // listen for video unmute/mute events
        const videoLocalMuteListener = videoController?.on(
            VideoEvent.LOCAL_VIDEO_MUTE_CHANGED,
            setVideoMute
        );

        return () => {
            audioMuteListener?.();
            videoLocalMuteListener?.();
        };
    }

    // ---------------------------- start: button click handler ----------------------------
    const toggleMuteAudio = () => {
        meetingController?.getAudioController()?.muteLocalAudioStream(!audioMuted)
            .catch((e) => {
                alert(`Error occurs due to :${e.message}`)
            });
    }

    const toggleMuteVideo = () => {
        meetingController?.getVideoController()?.muteLocalVideoStream(!videoMute)
            .catch((e) => {
                alert(`Error occurs due to :${e.message}`)
            });
    }

    const handleLeaveMeeting = () =>
        meetingController?.leaveMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });


    const handleEndMeeting = () => {
        meetingController?.endMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });
    }
    // ---------------------------- end: button click handler ----------------------------

    return (
        <div className='meeting-wrapper'>
            <div>Meeting Id: {meetingId}</div>
            <AttendeeVideoList meetingController={meetingController} loading={loading} />
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