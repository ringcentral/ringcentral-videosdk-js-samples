import React, { FC } from 'react';
import { IParticipant } from '@ringcentral/video-sdk';
import Avatar from '../avatar';
import './index.less';

interface IGalleryOnlySelf {
    participant: IParticipant;
    setVideoRef: (ref: HTMLDivElement) => void;
}
const GalleryOnlySelf: FC<IGalleryOnlySelf> = ({ participant, setVideoRef }) => {
    return (
        <div className='gallery-only-self'>
            <div className='you-are-alone'>You're the only person here.</div>
            <div className='avatar-wrapper'>
                <Avatar displaySize='100%' imgSize={300} participant={participant}></Avatar>
            </div>
            <div
                className='video-container'
                style={{
                    visibility: participant.isVideoMuted ? 'hidden' : 'visible',
                }}
                ref={video => setVideoRef(video)}
            />
        </div>
    );
};

export default GalleryOnlySelf;
