import React, { FC, useEffect, useRef, useState } from 'react';
import { IParticipant, StreamEvent } from '@sdk';
import { Card, Spinner } from 'react-bootstrap';
import { sinkStreamElement, unSinkStreamElement, TrackType } from '../../utils/dom'

interface IAttendeeListProps {
    participants: IParticipant[];
    meetingController: any;
    loading: boolean;
}

const AttendeeVideoList: FC<IAttendeeListProps> = ({
    participants,
    meetingController,
    loading
}) => {

    const videoRef = useRef({} as HTMLDivElement);
    const audioWrapper = useRef<HTMLDivElement>({} as HTMLDivElement);

    useEffect(() => {
        if (meetingController) {
            const streamManager = meetingController?.getStreamManager();
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, stream => {
                console.log(stream, 'LOCAL_VIDEO_TRACK_ADDED');
                sinkStreamElement(stream, TrackType.VIDEO, videoRef.current[stream.participantId]);
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
                console.log(stream, 'LOCAL_VIDEO_TRACK_REMOVED');
                unSinkStreamElement(stream, videoRef.current[stream.participantId]);
            });
            streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_REMOVED, stream => {
                console.log(stream, 'REMOTE_AUDIO_TRACK_REMOVED');
                unSinkStreamElement(stream, audioWrapper.current);
            });
            streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_ADDED, stream => {
                console.log(stream, 'REMOTE_AUDIO_TRACK_ADDED');
                sinkStreamElement(stream, TrackType.AUDIO, audioWrapper.current);
            });
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_ADDED, stream => {
                console.log(stream, 'REMOTE_VIDEO_TRACK_ADDED');
                sinkStreamElement(stream, TrackType.VIDEO, videoRef.current[stream.participantId]);
            });
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_REMOVED, stream => {
                console.log(stream, 'REMOTE_VIDEO_TRACK_REMOVED');
                unSinkStreamElement(stream, videoRef.current[stream.participantId]);
            });
        }

    }, [meetingController])

    return (
        <div>
            {loading && <div className='video-elt' style={{ display: 'flex', justifyContent: 'center' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>}
            {!loading && participants.map(participant => {
                return (
                    <Card key={participant.uid} className='video-elt'>
                        <Card.Body>
                            <Card.Title>{participant.displayName} {participant.isMe ? '(You)' : ''}</Card.Title>
                        </Card.Body>
                        <div
                            style={{
                                position: 'relative',
                            }}>
                            {participant.isVideoMuted ? <div>Video Muted</div> : null}
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
                    </Card>
                )
            })}
            <div ref={audioWrapper} />
        </div>
    )
}

export default AttendeeVideoList