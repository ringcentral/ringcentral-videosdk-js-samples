import React, { FC, useEffect } from 'react';
import { IParticipant } from '@sdk';
import Avatar from '@src/components/avatar';
import VideoInfo from './video-info';
import './index.less';

interface IGalleryItem {
    meetingController: any;
    participant: IParticipant;
    setVideoRef: (ref: HTMLDivElement) => void;
}
const GalleryItem: FC<IGalleryItem> = ({ participant, setVideoRef }) => {
    useEffect(() => {
        console.log(participant.nqiStatus);
    }, [participant.nqiStatus]);
    return (
        <div className='gallery-item'>
            <div className='gallery-item-inner'>
                <div className='avatar-wrapper'>
                    <Avatar displaySize='100%' imgSize={300} participant={participant}></Avatar>
                </div>
                <div className='video-info-wrapper'>
                    <VideoInfo participant={participant}></VideoInfo>
                </div>
                <div
                    className='video-container'
                    style={{
                        visibility: participant.isVideoMuted ? 'hidden' : 'visible',
                    }}
                    ref={video => setVideoRef(video)}
                />
            </div>
        </div>
    );
};

export default GalleryItem;
