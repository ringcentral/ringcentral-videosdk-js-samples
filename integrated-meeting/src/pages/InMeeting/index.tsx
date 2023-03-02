import React, { FC, useEffect, useRef } from 'react';
import {
    AudioEvent,
    VideoEvent,
    IParticipant,
    UserEvent,
    StreamEvent,
    MeetingEvent,
    ChatEvent,
    IStream,
    NQIState,
} from '@ringcentral/video-sdk';
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
    const streamManager = meetingController?.getStreamManager();

    const { meetingId } = useParams();
    const { dispatch } = useMeetingContext();
    const { setSidePortal, setCcPortal } = useElementContext();

    const audioRef = useRef({} as HTMLDivElement);

    useEffect(() => {
        if (isMeetingJoined) {
            initListener();
        }
    }, [isMeetingJoined]);

    useEffect(() => {
        if (rcvEngine) {
            initChatListener();
            initController();
        }
    }, [meetingId, rcvEngine]);

    const initChatListener = () => {
        const chatController = meetingController?.getChatController();
        chatController?.on(ChatEvent.CHAT_MESSAGE_RECEIVED, msgs => {
            dispatch({
                type: MeetingReduceType.CHAT_MESSAGES,
                payload: { chatMessages: msgs },
            });
        });
    };

    const initController = async () => {
        if (!isMeetingJoined) {
            try {
                await rcvEngine.joinMeeting(meetingId);
            } catch (e) {
                enqueueSnackbar('Join meeting failed', {
                    variant: 'error',
                });
            }
        }
        getParticipants();
        getStreams();
    };

    const initListener = () => {
        const audioController = meetingController?.getAudioController();
        const videoController = meetingController?.getVideoController();

        // listen for audio unmute/mute events
        audioController?.on(AudioEvent.LOCAL_AUDIO_MUTE_CHANGED, mute => {
            dispatch({
                type: MeetingReduceType.AUDIO_MUTE_UPDATED,
                payload: { isAudioMuted: mute },
            });
            getParticipants();
            getStreams();
        });
        audioController?.on(AudioEvent.REMOTE_AUDIO_MUTE_CHANGED, () => {
            getParticipants();
            getStreams();
        });
        // listen for video unmute/mute events
        videoController?.on(VideoEvent.LOCAL_VIDEO_MUTE_CHANGED, mute => {
            dispatch({
                type: MeetingReduceType.VIDEO_MUTE_UPDATED,
                payload: { isVideoMuted: mute },
            });
            getParticipants();
            getStreams();
        });
        videoController?.on(VideoEvent.REMOTE_VIDEO_MUTE_CHANGED, () => {
            getParticipants();
            getStreams();
        });
        const userController = meetingController?.getUserController();
        userController.on(UserEvent.USER_JOINED, () => {
            getParticipants();
            getStreams();
        });
        userController.on(UserEvent.USER_LEFT, () => {
            getParticipants();
            getStreams();
        });
        userController.on(UserEvent.USER_UPDATED, () => {
            getParticipants();
            getStreams();
        });
        userController.on(UserEvent.ACTIVE_SPEAKER_USER_CHANGED, (participant: IParticipant) => {
            getParticipants();
            getStreams();
        });

        // audio
        const streamManager = meetingController?.getStreamManager();
        streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_REMOVED, stream => {
            unSinkStreamElement(stream, audioRef.current);
        });
        streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_ADDED, stream => {
            sinkStreamElement(stream, TrackType.AUDIO, audioRef.current);
        });
        streamManager?.on(StreamEvent.LOCAL_NETWORK_QUALITY, nqi => {
            dispatch({
                type: MeetingReduceType.LOCAL_NQI,
                payload: {
                    localNqiState: nqi
                },
            });
        });
        streamManager?.on(StreamEvent.REMOTE_NETWORK_QUALITY, (stream: IStream, nqi: NQIState) => {
            dispatch({
                type: MeetingReduceType.REMOTE_NQI,
                payload: {
                    remoteNqiStateMap: {
                        [stream.id]: nqi
                    }
                },
            });
        });
        meetingController.on(MeetingEvent.MEETING_LOCK_STATE_CHANGED, state => {
            dispatch({
                type: MeetingReduceType.MEETING_LOCK_STATE,
                payload: { isMeetingLocked: state },
            });
        });
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
                participantMap: users,
            },
        });
    };

    const getStreams = () => {
        const localStreams: Omit<IStream, 'stream'>[] = streamManager._localStreams;
        const remoteStreams: {
            [key: string]: Omit<IStream, 'stream'> | null; // key tapId map stream
        } = streamManager._remoteStreams;
        dispatch({
            type: MeetingReduceType.STREAM_LIST,
            payload: {
                localStreams: localStreams,
                remoteStreams: remoteStreams,
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
