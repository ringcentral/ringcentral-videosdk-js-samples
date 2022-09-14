import React, { FC, useEffect, useRef, useState } from 'react';
import { Spinner, Badge } from 'react-bootstrap';
import { IParticipant, StreamEvent, UserEvent } from '@sdk';
import { sinkStreamElement, unSinkStreamElement, TrackType } from '../../utils/dom'
import { useGlobalContext } from '../../context';
interface IAttendeeListProps {
    meetingController: any;
    loading: boolean;
}

const AttendeeVideoList: FC<IAttendeeListProps> = ({
    meetingController,
    loading
}) => {
    const videoRef = useRef({} as HTMLDivElement);
    const { isMeetingJoined } = useGlobalContext();
    const [participantList, setParticipantList] = useState<IParticipant[]>([]);

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

            // listen for user events
            const userController = meetingController?.getUserController()
            userController.on(UserEvent.USER_JOINED, () => {
                updateParticipants(userController?.getMeetingUsers());
            });
            userController.on(UserEvent.USER_LEFT, () => {
                updateParticipants(userController?.getMeetingUsers());
            });
            userController.on(UserEvent.USER_UPDATED, () => {
                console.log('UserEvent.USER_UPDATED')
                updateParticipants(userController?.getMeetingUsers());
            });
        }
    }, [isMeetingJoined])

    const updateParticipants = (users: Record<string, IParticipant>) => {
        const localParticipant = Object.values(users).filter(participant => participant.isMe);
        const activeRemoteParticipants = Object.values(users).filter(
            participant => !participant.isDeleted && !participant.isMe
        );
        setParticipantList([...localParticipant, ...activeRemoteParticipants]);
    }

    return (
        <div className='video-card-wrapper'>
            {loading &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>}
            {!loading && participantList.map(participant => {
                return (
                    <div key={participant.uid} className='video-card'>
                        <div>
                            <h4>{participant.displayName} {participant.isMe ? '(You)' : ''}</h4>
                            <div className='video-card-status-bar'>
                                <Badge bg="primary">Audio {participant.isAudioMuted ? 'Muted' : 'Unmuted'}</Badge>&nbsp;
                                <Badge bg="success">Video {participant.isVideoMuted ? 'Muted' : 'Unmuted'}</Badge>
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
    )
}

export default AttendeeVideoList