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

    return (
        <>
            {meetingState.participantList.length === 1 ? (
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
                    {meetingState.participantList.map(participant => {
                        return (
                            <GalleryItem
                                key={participant.uid}
                                participant={participant}
                                setVideoRef={video =>
                                    (videoRef.current[participant.uid] = video)
                                }></GalleryItem>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default GalleryWrapper;
