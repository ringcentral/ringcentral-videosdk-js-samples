import React, { FC, useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { EngineEvent, StreamEvent } from '@sdk';
import { useParams } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { sinkStreamElement, unSinkStreamElement } from '../../utils/streamHandler';
import { TrackType } from '../../utils/constants'
import './index.less';
interface IProps {
    rcvEngine: EngineEvent
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();
    const remoteVideoRef = useRef<HTMLVideoElement>({} as HTMLVideoElement);
    const localVideoRef = useRef<HTMLVideoElement>({} as HTMLVideoElement);
    const meetingController = useMemo(
        () => rcvEngine?.getMeetingController(),
        [rcvEngine, rcvEngine?.getMeetingController()]
    );
    const userController = useMemo(
        () => meetingController?.getUserController(),
        [meetingController]
    );
    const audioController = useMemo(
        () => meetingController?.getAudioController(),
        [meetingController]
    );
    const videoController = useMemo(
        () => meetingController?.getVideoController(),
        [meetingController]
    );
    const streamManager = meetingController?.getStreamManager();

    useEffect(() => {
        if (meetingController) {
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_ADDED, stream => {
                sinkStreamElement(stream, TrackType.VIDEO, remoteVideoRef.current);
            });
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_REMOVED, stream => {
                unSinkStreamElement(stream, remoteVideoRef.current);
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, stream => {
                sinkStreamElement(stream, TrackType.VIDEO, localVideoRef.current);
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
                unSinkStreamElement(stream, localVideoRef.current);
            });
        }
        else {
            rcvEngine
                ?.joinMeeting(meetingId as string)
                .catch(e => {

                });
        }

    }, [meetingController, meetingId])

    return (
        <div className='meeting-wrapper'>
            <p>Meeting Id: <Badge bg="info">{meetingId}</Badge></p>
            <div className='video-wrapper'>
                <video
                    className='video-elt'
                    ref={localVideoRef}
            />
                <video
                    className='video-elt'
                    ref={remoteVideoRef}
            />
            </div>
            <div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button type="button" className="btn btn-success">unmute Audio</button>
                    <button type="button" className="btn btn-primary">unmute Video</button>
                    <button type="button" className="btn btn-danger">Leave</button>
                </div>
            </div>
        </div>
    )
}

export default InMeeting