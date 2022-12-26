import React, { FC, useEffect, useState, useRef } from 'react';
import { AudioEvent, VideoEvent, IParticipant, UserEvent, StreamEvent, MeetingEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { useMeetingContext } from '@src/store/meeting';
import { sinkStreamElement, unSinkStreamElement, TrackType } from '@src/utils/dom';
import GalleryWrapper from './gallery-wrapper';
import ActionBar from './action-bar';
import { useGlobalContext } from '@src/store/global';
import { MeetingReduceType } from '@src/store/meeting';
import { useElementContext } from '@src/store/element';
import { AvatarContextProvider } from '@src/store/avatar';
import './index.less';

const InMeeting: FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { rcvEngine, isMeetingJoined } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { meetingId } = useParams();
    const { state: meetingState, dispatch } = useMeetingContext();
    const { setSidePortal, setCcPortal } = useElementContext();

    const [loading, setLoading] = useState(false);
    const audioRef = useRef({} as HTMLDivElement);

    useEffect(() => {
        const initController = async () => {
            // when do refreshing
            if (!isMeetingJoined) {
                setLoading(true);
                try {
                    await rcvEngine.joinMeeting(meetingId);
                } catch (e) {
                    enqueueSnackbar('Join meeting failed', {
                        variant: 'error',
                    });
                } finally {
                    setLoading(false);
                }
            }
            getParticipants();
            initListener();
        };
        rcvEngine && initController();
    }, [meetingId, rcvEngine]);

    const initListener = () => {
        const audioController = meetingController?.getAudioController();
        const videoController = meetingController?.getVideoController();

        // listen for audio unmute/mute events
        const audioLocalMuteListener = audioController?.on(
            AudioEvent.LOCAL_AUDIO_MUTE_CHANGED,
            mute => {
                dispatch({
                    type: MeetingReduceType.AUDIO_MUTE_UPDATED,
                    payload: { isAudioMuted: mute },
                });
                getParticipants();
            }
        );
        const audioRemoteMuteListener = audioController?.on(
            AudioEvent.REMOTE_AUDIO_MUTE_CHANGED,
            () => {
                getParticipants();
            }
        );
        // listen for video unmute/mute events
        const videoLocalMuteListener = videoController?.on(
            VideoEvent.LOCAL_VIDEO_MUTE_CHANGED,
            mute => {
                dispatch({
                    type: MeetingReduceType.VIDEO_MUTE_UPDATED,
                    payload: { isVideoMuted: mute },
                });
                getParticipants();
            }
        );
        const videoRemoteMuteListener = videoController?.on(
            VideoEvent.REMOTE_VIDEO_MUTE_CHANGED,
            () => {
                getParticipants();
            }
        );
        const userController = meetingController?.getUserController();
        const userJoinedListener = userController.on(UserEvent.USER_JOINED, () => {
            getParticipants();
        });
        const userLeftListener = userController.on(UserEvent.USER_LEFT, () => {
            getParticipants();
        });
        const userUpdateListener = userController.on(UserEvent.USER_UPDATED, () => {
            getParticipants();
        });
        const userSpeakChangedListener = userController.on(
            UserEvent.ACTIVE_SPEAKER_USER_CHANGED,
            (participant: IParticipant) => {
                getParticipants();
            }
        );

        // audio
        const streamManager = meetingController?.getStreamManager();
        streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_REMOVED, stream => {
            unSinkStreamElement(stream, audioRef.current);
        });
        streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_ADDED, stream => {
            sinkStreamElement(stream, TrackType.AUDIO, audioRef.current);
        });

        const meetingLockStateListener = meetingController.on(
            MeetingEvent.MEETING_LOCK_STATE_CHANGED,
            state => {
                dispatch({
                    type: MeetingReduceType.MEETING_LOCK_STATE,
                    payload: { isMeetingLocked: state },
                });
            }
        );

        return () => {
            audioLocalMuteListener?.();
            audioRemoteMuteListener?.();
            videoLocalMuteListener?.();
            videoRemoteMuteListener?.();
            userJoinedListener?.();
            userLeftListener?.();
            userUpdateListener?.();
            userSpeakChangedListener();
            meetingLockStateListener();
        };
    };

    const getParticipants = () => {
        const users = meetingController.getUserController()?.getMeetingUsers();
        const localParticipant = Object.values(users).find(participant => participant.isMe);
        const activeRemoteParticipants = Object.values(users).filter(
            participant => !participant.isDeleted && !participant.isMe
        );
        dispatch({
            type: MeetingReduceType.PARTICIPANT_LIST,
            payload: {
                localParticipant: localParticipant,
                participantList: [localParticipant, ...activeRemoteParticipants],
            },
        });
    };

    return (
        <div className='meeting-wrapper'>
            <AvatarContextProvider>
                {isMeetingJoined ? (
                    <>
                        <div className='main-container'>
                            <div className='speakers-container'>
                                <GalleryWrapper></GalleryWrapper>
                                <div ref={setCcPortal}></div>
                            </div>
                            <div ref={setSidePortal}></div>
                        </div>
                        <div className='action-bar-container'>
                            <ActionBar></ActionBar>
                        </div>
                        <div ref={audioRef} />
                    </>
                ) : null}
            </AvatarContextProvider>
        </div>
    );
};

export default InMeeting;
