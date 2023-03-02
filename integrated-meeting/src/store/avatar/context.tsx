import React, { PropsWithChildren, useCallback, useContext, useState } from 'react';
import { deepmerge } from '@src/utils/tools';

interface IAvatarContext {
    getAvatar: (participantId: string, size: number) => string;
    saveAvatar: (participantId: string, size: number, avatar: string) => void;
}
const AvatarContext = React.createContext<IAvatarContext>({
    getAvatar: () => {},
    saveAvatar: () => {},
} as any);

const useAvatarContext = () => useContext<IAvatarContext>(AvatarContext);

export const AvatarContextProvider: React.FC<PropsWithChildren<{}>> = props => {
    const [avatars, setAvatars] = useState({});

    const saveAvatar = useCallback(
        (participantId: string, size: number, avatar: string) => {
            setAvatars(deepmerge(avatars, { [participantId]: { [size]: avatar } }));
        },
        [avatars]
    );

    const getAvatar = useCallback(
        (participantId: string, size: number) => {
            return avatars?.[participantId]?.[size];
        },
        [avatars]
    );

    return (
        <AvatarContext.Provider value={{ getAvatar, saveAvatar }}>
            {props.children}
        </AvatarContext.Provider>
    );
};

export { useAvatarContext };
