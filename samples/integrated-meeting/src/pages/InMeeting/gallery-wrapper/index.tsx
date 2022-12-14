import React, { FC, useEffect, useState, useRef, useMemo } from 'react';
import { IParticipant, StreamEvent } from '@sdk';

import { sinkStreamElement, unSinkStreamElement, TrackType } from '@src/utils/dom';
import { useGlobalContext } from '@src/context';
import useNodeBoundingRect from '@src/hooks/useNodeBoundingRect';
import { calculateFinalGridRule, FinalGridRule } from '@src/utils/gallery-layout';
import GalleryItem from '../gallery-item';
import GalleryOnlySelf from '../gallery-only-self';
import './index.less';

const getGridRule = calculateFinalGridRule(32);
const GALLERY_ITEM_ASPECT_RATIO = 1.8;

interface IGalleryWrapper {
    meetingController: any;
    participantList: IParticipant[];
}

const GalleryWrapper: FC<IGalleryWrapper> = ({ meetingController, participantList }) => {
    const { isMeetingJoined } = useGlobalContext();
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
                participantList.length,
                aspecRatio,
                GALLERY_ITEM_ASPECT_RATIO
            );
            setGridRule(gridRule);
        }
    }, [galleryWrapRect, participantList.length]);

    useEffect(() => {
        return () => cleanObserver();
    }, []);

    useEffect(() => {
        console.log(participantList);
    }, [participantList]);

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
            {participantList.length === 1 ? (
                <GalleryOnlySelf
                    participant={participantList[0]}
                    setVideoRef={video =>
                        (videoRef.current[participantList[0].uid] = video)
                    }></GalleryOnlySelf>
            ) : (
                <div
                    className={className}
                    ref={node => setGalleryWrapRef(node)}
                    style={galleryWrapperStyle}>
                    {participantList.map(participant => {
                        return (
                            <GalleryItem
                                key={participant.uid}
                                meetingController={meetingController}
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
