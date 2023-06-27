import React, { useState, useEffect } from 'react';
import { StreamProvider } from './StreamProvider';
import { StreamContainer } from './stream-container';
import {
    AudioEvent,
    UserEvent,
    VideoEvent,
    IParticipant,
    StreamType,
} from '@ringcentral/video-sdk';
import './index.css';

const CustomLayout = ({ rcvEngine }) => {
    const [localParticipant, setLocalParticipant] = useState(null);
    const [remoteParticipantList, setRemoteParticipantList] = useState<IParticipant[]>([])
    const [localStreams, setLocalStreams] = useState([]);
    const [remoteStreams, setRemoteStreams] = useState([])

    const meetingController = rcvEngine?.getMeetingController();

    useEffect(() => {
        const userController = meetingController?.getUserController();
        const audioController = meetingController.getAudioController();
        const videoController = meetingController.getVideoController();
        
        getParticipants(userController);
        // listen for audio unmute/mute events
        audioController?.on(AudioEvent.LOCAL_AUDIO_MUTE_CHANGED, mute => {
            getParticipants(userController);
        });
        audioController?.on(AudioEvent.REMOTE_AUDIO_MUTE_CHANGED, () => {
            getParticipants(userController);
        });
        // listen for video unmute/mute events
        videoController?.on(VideoEvent.LOCAL_VIDEO_MUTE_CHANGED, mute => {
            getParticipants(userController);
        });
        videoController?.on(VideoEvent.REMOTE_VIDEO_MUTE_CHANGED, () => {
            getParticipants(userController);
        });
        userController?.on(UserEvent.USER_ROLE_CHANGED, () => {
            getParticipants(userController);
        });
        userController?.on(UserEvent.USER_UPDATED, () => {
            getParticipants(userController);
        });

    }, [])

    const getParticipants = (userController) => {
        const users: IParticipant[] = Object.values(userController.getMeetingUsers()) || [];
        const localParticipant = users.find(participant => participant.isMe);
        const activeRemoteParticipants = users.filter(
            participant => !participant.isDeleted && !participant.isMe
        );
        setRemoteParticipantList([...activeRemoteParticipants])
        setLocalParticipant(localParticipant);
        setTimeout(() => {
            getStreams();
        });
    };

    const getStreams = () => {
        const streamManager = meetingController?.getStreamManager();
        const localStreams = streamManager?.getLocalStreams() || [];
        const remoteStreams = streamManager?.getRemoteStreams() || [];

        const localAvailableStreamList = localStreams.filter((s) => {
            return s.isSessionInactive === false && s.type === StreamType.VIDEO_MAIN;
        });
        setLocalStreams(localAvailableStreamList || []);

        const remoteAvailableStreamList = Object.values(remoteStreams).filter((s: any) => {
            if (localParticipant && localParticipant.uid === s.participantId) {
                return false;
            }
            return (!s.isSessionInactive && s.type !== StreamType.VIDEO_SCREENSHARING);
        });
        setRemoteStreams(remoteAvailableStreamList || []);
    };

    return (
        <StreamProvider rcvEngine={rcvEngine}>
            <div className='layout-custom-wrapper'>
                {localStreams.map((stream) => {
                    const participantId = stream.participantId;
                    if (participantId) {
                        const participant = meetingController?.getUserController()?.getMeetingUserById(participantId);
                        if (participant) {
                            return (
                                <StreamContainer
                                    key={stream.id}
                                    stream={stream}
                                    remoteParticipantList={remoteParticipantList}
                                    localParticipant={localParticipant}
                                />
                            );
                        }
                    }
                    return null;
                })}
                {remoteStreams.map(stream => {
                    const participantId = stream.participantId;
                    if (participantId) {
                        const participant = meetingController?.getUserController()?.getMeetingUserById(participantId);
                        if (participant) {
                            return (
                                <StreamContainer
                                    key={stream.id}
                                    stream={stream}
                                    remoteParticipantList={remoteParticipantList}
                                    localParticipant={localParticipant}
                                />
                            );
                        }
                    }
                    return null;
                })}
            </div>
        </StreamProvider>
    )
}

export default CustomLayout;