import React, { FC, useEffect, useState, useRef, useMemo } from 'react';
import { StreamEvent } from '@sdk';

import { sinkStreamElement, unSinkStreamElement, TrackType } from '@src/utils/dom';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import useNodeBoundingRect from '@src/hooks/useNodeBoundingRect';
import { calculateFinalGridRule, FinalGridRule } from '@src/utils/gallery-layout';
import GalleryItem from '../gallery-item';
import GalleryOnlySelf from '../gallery-only-self';
import { GALLERY_ITEM_ASPECT_RATIO, MAX_GALLERY_ITEM_COUNT_PER_PAGE } from '@src/consts/layout';

const getGridRule = calculateFinalGridRule(MAX_GALLERY_ITEM_COUNT_PER_PAGE);

const GalleryWrapper: FC = () => {
    const { rcvEngine, isMeetingJoined } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();
    const { rect: galleryWrapRect, ref: setGalleryWrapRef, cleanObserver } = useNodeBoundingRect();
    const [gridRule, setGridRule] = useState<FinalGridRule | null>(null);

    console.log(23, meetingState);
    const videoRef = useRef({} as HTMLDivElement);

    const className = ['gallery-wrapper', gridRule && !gridRule.isWidthLimited && 'heightLimited']
        .filter(Boolean)
        .join(' ');

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
        }
    }, [isMeetingJoined]);

    useEffect(() => {
        if (galleryWrapRect?.width && galleryWrapRect?.height) {
            const aspecRatio = galleryWrapRect.width / galleryWrapRect.height;
            let gridRule = getGridRule(
                meetingState.participantList.length,
                aspecRatio,
                GALLERY_ITEM_ASPECT_RATIO
            );
            setGridRule(gridRule);
        }
    }, [galleryWrapRect, meetingState.participantList.length]);

    useEffect(() => {
        return () => cleanObserver();
    }, []);

    const galleryWrapperStyle = useMemo(
        () =>
            gridRule
                ? ({
                      '--cols': gridRule.cols,
                      '--rows': gridRule.rows,
                      '--aspect-ratio': GALLERY_ITEM_ASPECT_RATIO,
                  } as React.CSSProperties)
                : {},
        [gridRule]
    );

    const localStreams = meetingState.localStreams || [];
    const localParticipant = meetingState.localParticipant;
    const remoteStreams = meetingState.remoteStreams || {};
    const localNqiState = meetingState.localNqiState;
    const remoteNqiStateMap = meetingState.remoteNqiStateMap || {};
    const localAvailableStreamList = localStreams.filter((s) => {
        return s.isSessionInactive === false && s.type === 'video/main';
    });
    const remoteAvailableStreamList = Object.values(remoteStreams).filter((s) => {
        if(localParticipant && localParticipant.uid === s.participantId){
            return false;
        }
        return s.isSessionInactive === false && s.type === 'video/main';
    });
    const participantMap = meetingState.participantMap;
    const isOnlyMeJoinedMeeting = (localAvailableStreamList.length == 1) && (remoteAvailableStreamList.length == 0);
    return (
        <>
            {isOnlyMeJoinedMeeting ? (
                <GalleryOnlySelf
                    participant={meetingState.participantList[0]}
                    setVideoRef={video =>
                        (videoRef.current[meetingState.participantList[0].uid] = video)
                    }></GalleryOnlySelf>
            ) : (
                <div
                    className={className}
                    ref={node => setGalleryWrapRef(node)}
                    style={galleryWrapperStyle}>
                    {localAvailableStreamList.map((stream) => {
                        const participant = participantMap[stream.participantId];
                        if(participant){
                            return (
                              <GalleryItem
                                isMe={true}
                                nqi={localNqiState}
                                key={stream.id}
                                stream={stream}
                                participant={participant}
                                setVideoRef={video =>
                                  (videoRef.current[participant.uid] = video)
                                }
                              />
                            );
                        }
                    })}
                    {remoteAvailableStreamList.map(stream => {
                        const participant = participantMap[stream.participantId];
                        const nqi = remoteNqiStateMap[stream.id];
                        if(participant){
                            return (
                              <GalleryItem
                                isMe={false}
                                key={stream.id}
                                nqi={nqi}
                                stream={stream}
                                participant={participant}
                                setVideoRef={video =>
                                  (videoRef.current[participant.uid] = video)
                                }
                              />
                            );
                        }
                    })}
                </div>
            )}
        </>
    );
};

export default GalleryWrapper;
