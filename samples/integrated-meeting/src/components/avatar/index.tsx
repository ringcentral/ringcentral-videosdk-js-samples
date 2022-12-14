import type { IParticipant } from '@sdk';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import styles from './index.css';

interface IAvatarProps {
    participant: IParticipant;
    displaySize?: number | string;
    imgSize?: number;
    avatar?: string;
    getAvatarSucceed?: (url: string) => void;
}

const Avatar: FC<IAvatarProps> = ({
    participant,
    displaySize = 45,
    imgSize = 45,
    avatar,
    getAvatarSucceed,
}: IAvatarProps) => {
    const [url, setUrl] = useState<string>('');

    /**
     * need cache avatars, otherwise, the backend will cause a 429 error if the avatar is requested frequently
     */
    const getAvatar = async () => {
        if (avatar) {
            setUrl(avatar);
        } else {
            try {
                const avatarUrl = await participant.getHeadshotUrlWithSize(imgSize);
                const avatarRes = await fetch(avatarUrl);
                const blobUrl = URL.createObjectURL(await avatarRes.blob());
                setUrl(blobUrl);
                if (getAvatarSucceed) {
                    getAvatarSucceed(blobUrl);
                }
            } catch (e) {}
        }
    };

    useEffect(() => {
        getAvatar();
    }, []);

    if (!url) {
        return null;
    }
    return (
        <img
            className={styles.avatar}
            src={url}
            style={{ width: displaySize, height: displaySize }}
        />
    );
};

export default Avatar;
