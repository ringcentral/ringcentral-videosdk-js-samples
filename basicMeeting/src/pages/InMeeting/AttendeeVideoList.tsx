import React, { FC, useEffect, useRef, useState } from 'react';
import { IParticipant, StreamEvent, UserEvent } from '@ringcentral/video-sdk';
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import { sinkStreamElement, unSinkStreamElement, TrackType } from '../../utils/dom'
import { useGlobalContext } from '../../context';
interface IAttendeeListProps {
    meetingController: any;
    participantList: IParticipant[];
}

const AttendeeVideoList: FC<IAttendeeListProps> = ({
    meetingController,
    participantList
}) => {
    const audioRef = useRef({} as HTMLDivElement);
    const videoRef = useRef({} as HTMLDivElement);
    const { isMeetingJoined } = useGlobalContext();
    const [activeVideoUser, setActiveVideoUser] = useState<IParticipant>(null)

    useEffect(() => {
        if (isMeetingJoined) {
            // listen for stream events
            const streamManager = meetingController?.getStreamManager();
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, stream => {
                sinkStreamElement(stream, TrackType.VIDEO, videoRef.current[stream.participantId]);
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
                unSinkStreamElement(stream, videoRef.current[stream.participantId]);
            });
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_ADDED, stream => {
                sinkStreamElement(stream, TrackType.VIDEO, videoRef.current[stream.participantId]);
            });
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_REMOVED, stream => {
                unSinkStreamElement(stream, videoRef.current[stream.participantId]);
            });
            // listen for active use event
            const userController = meetingController?.getUserController()
            userController.on(UserEvent.ACTIVE_VIDEO_USER_CHANGED, (participant: IParticipant) => {
                setActiveVideoUser(participant)
            });
        }
    }, [isMeetingJoined])

    return (
        <>
            <p style={{ textAlign: 'center' }}>
                Active Video User: {activeVideoUser ? activeVideoUser.displayName + '(' + activeVideoUser.uid + ')' : '-'}
            </p>
            <div className='video-card-wrapper'>
                {participantList.map(participant => {
                    return (
                        <div key={participant.uid} className='video-card'>
                            <div>
                                <h4>{participant.displayName} {participant.isMe ? '(Me)' : ''}</h4>
                                <div className='video-card-status-bar'>
                                    {participant.isAudioMuted ?<MicOff /> : <Mic />}
                                    {participant.isVideoMuted ?<VideocamOff /> : <Videocam />}
                                    <br />
                                </div>
                                <div
                                    style={{
                                        visibility: participant.isVideoMuted
                                            ? 'hidden'
                                            : 'visible',
                                    }}
                                    ref={video =>
                                        (videoRef.current[participant.uid] = video)
                                    }
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AttendeeVideoList