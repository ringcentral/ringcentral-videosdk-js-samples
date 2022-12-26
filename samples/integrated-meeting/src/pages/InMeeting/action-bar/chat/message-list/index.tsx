import type { IParticipant, Message } from '@sdk';
import React from 'react';

export function MessageComp({ data, participant }: { data: Message; participant: IParticipant }) {
    const time = new Date(data.timestamp);
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');
    return (
        <div>
            <div>
                <div>{participant.displayName}</div>
                <div>
                    {hour}:{minute}
                </div>
            </div>
            <div>{data.message}</div>
        </div>
    );
}

interface IProps {
    participants: IParticipant[];
    messages: Message[];
}

function MessageList({ messages, participants }: IProps) {
    const participantMap = participants.reduce(
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
                    data={item}
                    key={item.timestamp}
                    participant={participantMap[item.from]}
                />
            ))}
        </div>
    );
}

export default React.memo(MessageList);
