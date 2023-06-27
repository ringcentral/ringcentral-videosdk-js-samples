import React, { useContext, useEffect, useRef } from 'react';
import type { IStream, StreamManager } from '@ringcentral/video-sdk';
import { StreamEvent } from '@ringcentral/video-sdk';
import { sinkStreamElement, TrackType, unSinkStreamElement } from './dom';

export interface IVideoCanvas {
    dom: HTMLDivElement | null,
    objectFit: 'contain' | 'cover'
}

interface IStreamContext {
    setVideoRender: (streamId: string, dom: HTMLDivElement | null, objectFit: IVideoCanvas['objectFit']) => void;
}

const StreamContext = React.createContext<IStreamContext>({
    setVideoRender: () => undefined
});

const useStreamContext = () => useContext<IStreamContext>(StreamContext);

export const StreamProvider = ({ rcvEngine, children }) => {
    const streamMap = useRef<Record<string, IStream | null>>({});
    const audioRef = useRef<HTMLDivElement | null>(null);
    const videoCanvasByStreamIdRef = useRef<Record<string, IVideoCanvas>>({});

    useEffect(() => {
        const meetingController = rcvEngine?.getMeetingController();
        const streamManager = meetingController?.getStreamManager();
        if (streamManager) {
            initStreamMap(streamManager);
            addStreamManagerEventsHandler(streamManager);
        }
        return () => {
            streamMap.current = {};
            videoCanvasByStreamIdRef.current = {};
        };
    }, []);

    const initStreamMap = (streamManager: StreamManager) => {
        const localStreams = streamManager.getLocalStreams();
        const remoteStreams = streamManager.getRemoteStreams();
        const res: Record<string, IStream> = {};
        for (const localStream of localStreams) {
            res[localStream?.id || ''] = localStream as any;
        }
        for (const remoteStream of remoteStreams) {
            res[remoteStream?.id || ''] = remoteStream as any;
        }
        streamMap.current = {
            ...streamMap.current,
            ...res,
        };
    };

    const addStreamManagerEventsHandler = (streamManager: StreamManager) => {
        streamManager.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, (stream: IStream) => {
            const videoCanvas = videoCanvasByStreamIdRef.current[stream.id];
            if (videoCanvas && videoCanvas.dom) {
                sinkStreamElement(stream, TrackType.VIDEO, videoCanvas.dom, videoCanvas.objectFit);
            }
            streamMap.current[stream.id] = stream;
        });
        streamManager.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
            const videoCanvas = videoCanvasByStreamIdRef.current[stream.id];
            if (videoCanvas && videoCanvas.dom) {
                unSinkStreamElement(stream, videoCanvas.dom);
            }
            streamMap.current[stream.id] = null;
        });
        streamManager.on(StreamEvent.REMOTE_VIDEO_TRACK_ADDED, stream => {
            const videoCanvas = videoCanvasByStreamIdRef.current[stream.id];
            if (videoCanvas && videoCanvas.dom) {
                sinkStreamElement(stream, TrackType.VIDEO, videoCanvas.dom, videoCanvas.objectFit);
            }
            streamMap.current[stream.id] = stream;
        });
        streamManager.on(StreamEvent.REMOTE_VIDEO_TRACK_REMOVED, stream => {
            const videoCanvas = videoCanvasByStreamIdRef.current[stream.id];
            if (videoCanvas && videoCanvas.dom) {
                unSinkStreamElement(stream, videoCanvas.dom);
            }
            streamMap.current[stream.id] = null;
        });
        streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_REMOVED, stream => {
            if (audioRef.current) {
                unSinkStreamElement(stream, audioRef.current);
            }
        });
        streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_ADDED, stream => {
            if (audioRef.current) {
                sinkStreamElement(stream, TrackType.AUDIO, audioRef.current, null);
            }
        });
    };

    const setVideoRender = (streamId: string, dom: HTMLDivElement | null, objectFit: IVideoCanvas['objectFit']) => {
        videoCanvasByStreamIdRef.current[streamId] = {
            dom, objectFit
        };
        const stream = streamMap.current[streamId];
        if (stream && dom) {
            sinkStreamElement(stream, TrackType.VIDEO, dom, objectFit);
        }
    };

    return (
        <StreamContext.Provider value={{ setVideoRender }}>
            {children}
            <div ref={audioRef} style={{ display: 'none' }} />
        </StreamContext.Provider>
    );
};

export { useStreamContext };
