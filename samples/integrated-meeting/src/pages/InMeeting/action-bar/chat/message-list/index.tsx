import type { IParticipant, Message } from '@sdk';
import React, { FC } from 'react';
import { useMeetingContext } from '@src/store/meeting';
import Avatar from '@src/pages/InMeeting/avatar';
import './index.less';

export function MessageComp({ data, participant }: { data: Message; participant: IParticipant }) {
    const time = new Date(data.timestamp);
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');
    return (
        <div className='message-item'>
            <div className='message-user-info'>
                <Avatar participant={participant} displaySize={20} imgSize={20} />
                <p className='message-user'>{participant.displayName}</p>
                <p className='message-time'>
                    {hour}:{minute}
                </p>
            </div>
            <p className='message-content'>{data.message}</p>
        </div>
    );
}

const MessageList: FC<{ messages: Message[] }> = props => {
    const { state: meetingState } = useMeetingContext();
    const { messages } = props;

    const participantMap = meetingState.participantList.reduce(
        (res, participant) => ({
            ...res,
            [participant.uid]: participant,
        }),
        {}
    );

    return (
        <div>
            {messages.map((item: Message) => (
                <MessageComp
                    key={item.timestamp}
                    participant={participantMap[item.from]}
                    data={item}></MessageComp>
            ))}
        </div>
    );
};

export default React.memo(MessageList);
