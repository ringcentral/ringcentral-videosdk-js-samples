import React, { FC } from 'react';
import { IParticipant, IStream, NQIState } from '@ringcentral/video-sdk';
import Avatar from '../avatar';
import VideoInfo from './gallery-video-info';
import './index.less';

interface IGalleryItem {
    isMe: boolean;
    nqi?: NQIState;
    stream: Omit<IStream, 'stream'>;
    participant: IParticipant;
    setVideoRef: (ref: HTMLDivElement) => void;
}
const GalleryItem: FC<IGalleryItem> = ({ stream, nqi, isMe, participant, setVideoRef }) => {
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
                    <VideoInfo stream={stream} nqi={nqi} participant={participant} isMe={isMe} />
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
