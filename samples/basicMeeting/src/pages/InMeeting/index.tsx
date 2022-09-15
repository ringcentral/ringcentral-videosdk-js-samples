import React, { FC, useEffect, useState } from 'react'
import { RcvEngine, AudioEvent, VideoEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { RcButtonGroup, RcButton, RcIcon } from '@ringcentral/juno';
import { Phone, PhoneOff, Videocam, VideocamOff } from '@ringcentral/juno-icon';
import AttendeeVideoList from './AttendeeVideoList'
import { useGlobalContext } from '../../context';
interface IProps {
    rcvEngine: RcvEngine
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();
    const { isMeetingJoined } = useGlobalContext();

    const [loading, setLoading] = useState(false);
    const [audioMuted, setAudioMuted] = useState(true);
    const [videoMute, setVideoMute] = useState(true);

    const meetingController = rcvEngine?.getMeetingController();

    useEffect(() => {

        const initController = async () => {
            // when do refreshing
            if (!isMeetingJoined) {
                setLoading(true);
                await rcvEngine.joinMeeting(meetingId, {});
                setLoading(false)
            }
            initListener()
        }
        rcvEngine && initController();
    }, [meetingId, rcvEngine])

    const initListener = () => {
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
            <RcButtonGroup>
                <RcButton
                    onClick={toggleMuteAudio}
                    startIcon={<RcIcon symbol={audioMuted ? PhoneOff : Phone} />}>
                    Audio
                </RcButton>
                <RcButton
                    color="success.b03"
                    onClick={toggleMuteVideo}
                    startIcon={<RcIcon symbol={videoMute ? VideocamOff : Videocam} />}>
                    Video
                </RcButton>
                <RcButton color="highlight.b03" onClick={handleLeaveMeeting}>Leave</RcButton>
                <RcButton color="danger.b03" onClick={handleEndMeeting}>End</RcButton>
            </RcButtonGroup>
        </div>
    )
}

export default InMeeting