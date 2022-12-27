import type { IParticipant } from '@sdk';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useAvatarContext } from '@src/store/avatar';
import { useSnackbar } from 'notistack';

interface IAvatarProps {
    participant: IParticipant;
    displaySize?: number | string;
    imgSize?: number;
}

const Avatar: FC<IAvatarProps> = ({
    participant,
    displaySize = 45,
    imgSize = 45,
}: IAvatarProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const { getAvatar: getAvatarFromStore, saveAvatar: saveAvatarToStore } = useAvatarContext();
    const [url, setUrl] = useState<string>('');

    /**
     * need cache avatars, otherwise, the backend will cause a 429 error if the avatar is requested frequently
     */
    const getAvatar = async () => {
        const url = getAvatarFromStore(participant.uid, imgSize);
        if (url) {
            setUrl(url);
        } else {
            try {
                const avatarUrl = await participant.getHeadshotUrlWithSize(imgSize);
                const avatarRes = await fetch(avatarUrl);
                const blobUrl = URL.createObjectURL(await avatarRes.blob());
                setUrl(blobUrl);
                saveAvatarToStore(participant.uid, imgSize, blobUrl);
            } catch (e) {
                enqueueSnackbar('Get avatar failed', {
                    variant: 'error',
                });
            }
        }
    };

    useEffect(() => {
        getAvatar();
    }, []);

    return url ? (
        <img src={url} style={{ borderRadius: '50%', width: displaySize, height: displaySize }} />
    ) : (
        <div style={{ borderRadius: '50%', width: displaySize, height: displaySize }}></div>
    );
};

export default Avatar;
