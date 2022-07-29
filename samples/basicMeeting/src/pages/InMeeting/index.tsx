import React, { FC, useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { EngineEvent, StreamEvent } from '@sdk';
import { sinkStreamElement, unSinkStreamElement } from '../../utils/streamHandler';
import { TrackType } from '../../utils/constants'


interface IProps {
    rcvEngine: EngineEvent
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props

    const remoteVideoWrapper = useRef<HTMLDivElement>({} as HTMLDivElement);
    const localVideoWrapper = useRef<HTMLDivElement>({} as HTMLDivElement);
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
                sinkStreamElement(stream, TrackType.VIDEO, remoteVideoWrapper.current);
            });
            streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_REMOVED, stream => {
                unSinkStreamElement(stream, remoteVideoWrapper.current);
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, stream => {
                sinkStreamElement(stream, TrackType.VIDEO, localVideoWrapper.current);
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
                unSinkStreamElement(stream, localVideoWrapper.current);
            });
        }

    }, [meetingController])

    return (
        <div>
            <h4>Meeting Id: <b></b></h4>
            <div
                data-lable='localVideoWrapper'
                ref={localVideoWrapper}
            />
            <div
                data-lable='remoteVideoWrapper'
                ref={remoteVideoWrapper}
            />
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