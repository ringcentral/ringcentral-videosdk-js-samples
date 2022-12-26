import React, { FC } from 'react';
import { IParticipant } from '@sdk';
import Avatar from '../avatar';
import VideoInfo from './gallery-video-info';
import './index.less';

interface IGalleryItem {
    participant: IParticipant;
    setVideoRef: (ref: HTMLDivElement) => void;
}
const GalleryItem: FC<IGalleryItem> = ({ participant, setVideoRef }) => {
    return (
        <div className='gallery-item'>
            <div className='gallery-item-inner'>
                <div
                    className='avatar-wrapper'
                    style={{
                        visibility: participant.isVideoMuted ? 'visible' : 'hidden',
                    }}>
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
