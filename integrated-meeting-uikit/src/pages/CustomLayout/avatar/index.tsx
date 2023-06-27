import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { IParticipant } from '@ringcentral/video-sdk';

interface IAvatarProps {
    participant: IParticipant;
    displaySize?: number | string;
    imgSize?: number;
    objectFit?:  'fill' | 'contain' | 'cover';
}

const Avatar: FC<IAvatarProps> = ({
    participant,
    displaySize = 45,
    imgSize = 45,
    objectFit='cover',
}: IAvatarProps) => {
    const [url, setUrl] = useState<string>('');
    const getAvatar = async () => {
        if(participant && participant.uid){
            try {
                const avatarUrl = await participant.getHeadshotUrlWithSize(imgSize);
                const avatarRes = await fetch(avatarUrl);
                const blobUrl = URL.createObjectURL(await avatarRes.blob());
                setUrl(blobUrl);
            } catch (e) {
                console.log('Get avatar failed!');
            }
        }
    };

    useEffect(() => {
        getAvatar().then();
    }, []);

    return url ? (
        <img alt={url} className='avatar' src={url} style={{ borderRadius: '50%', width: displaySize, height: displaySize, objectFit: objectFit }} />
    ) : (
        <div className='avatar' style={{ borderRadius: '50%', width: displaySize, height: displaySize }}></div>
    );
};

export default Avatar;
