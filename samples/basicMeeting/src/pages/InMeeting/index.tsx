import React, { FC, useEffect, useState } from 'react'
import { RcvEngine, AudioEvent, VideoEvent, IParticipant, UserEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { RcButtonGroup, RcButton, RcIcon, RcLoading } from '@ringcentral/juno';
import { Phone, PhoneOff, Videocam, VideocamOff } from '@ringcentral/juno-icon';
import AttendeeVideoList from './AttendeeVideoList';
import ParticipantTable from './ParticipantTable';
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
    const [participantList, setParticipantList] = useState<IParticipant[]>([]);

    const meetingController = rcvEngine?.getMeetingController();

    useEffect(() => {

        const initController = async () => {
            // when do refreshing
            if (!isMeetingJoined) {
                setLoading(true);
                await rcvEngine.joinMeeting(meetingId);
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
        const audioLocalMuteListener = audioController?.on(
            AudioEvent.LOCAL_AUDIO_MUTE_CHANGED,
            (mute) => {
                setAudioMuted(mute);
                updateParticipants();
            }
        );
        const audioRemoteMuteListener = audioController?.on(
            AudioEvent.REMOTE_AUDIO_MUTE_CHANGED,
            (uid: string, mute: boolean) => {
                updateParticipants();
            }
        );
        // listen for video unmute/mute events
        const videoLocalMuteListener = videoController?.on(
            VideoEvent.LOCAL_VIDEO_MUTE_CHANGED,
            (mute) => {
                setVideoMute(mute);
                updateParticipants();
            }
        );
        const videoRemoteMuteListener = videoController?.on(
            VideoEvent.REMOTE_VIDEO_MUTE_CHANGED,
            (uid: string, mute: boolean) => {
                updateParticipants();
            }
        );
        const userController = meetingController?.getUserController()
        const userJoinedListener = userController.on(UserEvent.USER_JOINED, () => {
            updateParticipants();
        });
        const userLeftListener = userController.on(UserEvent.USER_LEFT, () => {
            updateParticipants();
        });
        const userUpdateListener = userController.on(UserEvent.USER_UPDATED, () => {
            updateParticipants();
        });

        return () => {
            audioLocalMuteListener?.();
            audioRemoteMuteListener?.();
            videoLocalMuteListener?.();
            videoRemoteMuteListener?.();
            userJoinedListener?.();
            userLeftListener?.();
            userUpdateListener?.();
        };
    }

    const updateParticipants = () => {
        const users = meetingController.getUserController()?.getMeetingUsers();
        const localParticipant = Object.values(users).filter(participant => participant.isMe);
        const activeRemoteParticipants = Object.values(users).filter(
            participant => !participant.isDeleted && !participant.isMe
        );
        setParticipantList([...localParticipant, ...activeRemoteParticipants]);
    }

    // ---------------------------- start: button click handler ----------------------------
    const toggleMuteAudio = () => {
        if (audioMuted) {
            meetingController?.getAudioController()?.unmuteLocalAudioStream()
            .catch((e) => {
                alert(`Error occurs due to :${e.message}`)
            });
        }
        else {
            meetingController?.getAudioController()?.muteLocalAudioStream()
                .catch((e) => {
                    alert(`Error occurs due to :${e.message}`)
                });
        }
    }

    const toggleMuteVideo = () => {
        if (videoMute) {
            meetingController?.getVideoController()?.unmuteLocalVideoStream()
            .catch((e) => {
                alert(`Error occurs due to :${e.message}`)
            });
        }
        else {
            meetingController?.getVideoController()?.muteLocalVideoStream()
                .catch((e) => {
                    alert(`Error occurs due to :${e.message}`)
                });
        }
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
            <RcLoading loading={loading}>
                <div>Meeting Id: {meetingId}</div>
                <AttendeeVideoList meetingController={meetingController} participantList={participantList} />
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
                <br />
                <ParticipantTable
                    participantList={participantList} />
            </RcLoading>
        </div>
    )
}

export default InMeeting