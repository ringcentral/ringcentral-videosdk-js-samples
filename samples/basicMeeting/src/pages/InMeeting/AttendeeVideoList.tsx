import React, { FC, useEffect, useRef, useState } from 'react';
import { IParticipant, StreamEvent, UserEvent } from '@sdk';
import { Card, Spinner, Badge } from 'react-bootstrap';
import { sinkStreamElement, unSinkStreamElement, TrackType } from '../../utils/dom'

interface IAttendeeListProps {
    meetingController: any;
    loading: boolean;
}

const AttendeeVideoList: FC<IAttendeeListProps> = ({
    meetingController,
    loading
}) => {

    const videoRef = useRef({} as HTMLDivElement);
    const [participantList, updateParticipantList] = useState<IParticipant[]>([]);

    useEffect(() => {
        if (meetingController) {
            // listen for stream events
            const streamManager = meetingController?.getStreamManager();
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, stream => {
                console.log(stream, 'LOCAL_VIDEO_TRACK_ADDED');
                sinkStreamElement(stream, TrackType.VIDEO, videoRef.current[stream.participantId]);
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
                console.log(stream, 'LOCAL_VIDEO_TRACK_REMOVED');
                unSinkStreamElement(stream, videoRef.current[stream.participantId]);
            });
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_ADDED, stream => {
                console.log(stream, 'REMOTE_VIDEO_TRACK_ADDED');
                sinkStreamElement(stream, TrackType.VIDEO, videoRef.current[stream.participantId]);
            });
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_REMOVED, stream => {
                console.log(stream, 'REMOTE_VIDEO_TRACK_REMOVED');
                unSinkStreamElement(stream, videoRef.current[stream.participantId]);
            });

            // listen for user events
            const userController = meetingController?.getUserController()
            userController.on(UserEvent.USER_JOINED, () => {
                getAttendeeList(userController?.getMeetingUsers());
            });
            userController.on(UserEvent.USER_LEFT, () => {
                getAttendeeList(userController?.getMeetingUsers());
            });
            userController.on(UserEvent.USER_UPDATED, () => {
                getAttendeeList(userController?.getMeetingUsers());
            });
        }
    }, [meetingController])


    const getAttendeeList = (users: Record<string, IParticipant>) => {
        const localParticipant = Object.values(users).filter(participant => participant.isMe);
        const activeRemoteParticipants = Object.values(users).filter(
            participant => !participant.isDeleted && !participant.isMe
        );
        updateParticipantList([...localParticipant, ...activeRemoteParticipants]);
    };

    return (
        <div className='video-card-wrapper'>
            {loading &&
                <div className='video-card' style={{ display: 'flex', justifyContent: 'center' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>}
            {!loading && participantList.map(participant => {
                return (
                    <Card key={participant.uid} className='video-card'>
                        <Card.Body>
                            <Card.Title>{participant.displayName} {participant.isMe ? '(You)' : ''}</Card.Title>
                            <div>
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
                        </Card.Body>
                    </Card>
                )
            })}
        </div>
    )
}

export default AttendeeVideoList