import type { IParticipant } from '@ringcentral/video-sdk';
import React, { FC } from 'react';
import { useMeetingContext } from '@src/store/meeting';
import Avatar from '@src/pages/InMeeting/avatar';
import './index.less';
import { PrivateChatItem } from '../type';

export function PrivateChatComp({
    data,
    participant,
    onSelect,
}: {
    data: PrivateChatItem;
    participant: IParticipant;
    onSelect: (uId: string) => void;
}) {
    const time = new Date(data.lastMessageTime);
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');
    return (
        <div className='private-chat-item' onClick={() => onSelect(participant.uid)}>
            <div className='private-chat-user-info'>
                <Avatar participant={participant} displaySize={20} imgSize={20} />
                <p className='private-chat-user'>{participant.displayName}</p>
                <p className='private-chat-time'>
                    {hour}:{minute}
                </p>
            </div>
            <p className='private-chat-content'>{data.lastMessageContent}</p>
        </div>
    );
}

const PrivateChatList: FC<{
    privateChatList: PrivateChatItem[];
    onSelect: (uId: string) => void;
}> = props => {
    const { state: meetingState } = useMeetingContext();
    const { privateChatList, onSelect } = props;

    const participantMap = meetingState.participantList.reduce(
        (res, participant) => ({
            ...res,
            [participant.uid]: participant,
        }),
        {}
    );

    return (
        <div>
            {privateChatList.map((item: PrivateChatItem) => (
                <PrivateChatComp
                    key={item.lastMessageTime}
                    participant={participantMap[item.chatUid]}
                    onSelect={onSelect}
                    data={item}></PrivateChatComp>
            ))}
        </div>
    );
};

export default React.memo(PrivateChatList);
