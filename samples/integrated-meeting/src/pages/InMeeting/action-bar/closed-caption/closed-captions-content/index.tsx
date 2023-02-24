import Avatar from '@src/pages/InMeeting/avatar';
import type { ClosedCaptionsData } from '@ringcentral/video-sdk';
import React, { useEffect, useRef, useState } from 'react';
import { Portal } from '@mui/material';

import './index.less';
import { useElementContext } from '@src/store/element';

interface ClosedCaptionsContentProps {
    closedCaptionsData: ClosedCaptionsData[];
}

const ClosedCaptionsContent = ({ closedCaptionsData }: ClosedCaptionsContentProps) => {
    const { ccPortal } = useElementContext();

    const VisibleContainerRef = useRef<HTMLDivElement | null>(null);
    const ContainerRef = useRef<HTMLDivElement | null>(null);
    const [stickyAvatarIndex, setStickyAvatarIndex] = useState(-1);

    useEffect(() => {
        setStickyAvatarIndex(-1);
        if (ContainerRef?.current && VisibleContainerRef?.current) {
            const itemNodes = ContainerRef.current.children;
            const wrapHeight = VisibleContainerRef.current.getBoundingClientRect().height;
            let heightSum = 0;
            if (itemNodes.length) {
                for (let i = itemNodes.length - 1; i >= 0; i--) {
                    const tempHeightSum = heightSum + itemNodes[i].getBoundingClientRect().height;
                    if (tempHeightSum >= wrapHeight) {
                        setStickyAvatarIndex(i);
                        break;
                    } else {
                        heightSum = tempHeightSum;
                    }
                }
            }
        }
    }, [closedCaptionsData]);

    return (
        <Portal container={ccPortal.current}>
            <div className='closed-caption-content'>
                <div className='closed-caption-visible-container' ref={VisibleContainerRef}>
                    <div className='closed-caption-container' ref={ContainerRef}>
                        {closedCaptionsData.map((caption, index) => {
                            return (
                                <div
                                    className='closed-caption-item'
                                    key={caption.participant.uid + caption.timestamp}>
                                    <div
                                        className='closed-caption-avatar'
                                        style={{
                                            position:
                                                stickyAvatarIndex === index ? 'sticky' : 'static',
                                        }}>
                                        <Avatar
                                            participant={caption.participant}
                                            displaySize={20}
                                            imgSize={20}
                                        />
                                    </div>
                                    <div>
                                        <span className='participant-name'>
                                            {caption.participant.displayName + ':'}
                                        </span>
                                        {caption.transcript}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default ClosedCaptionsContent;
