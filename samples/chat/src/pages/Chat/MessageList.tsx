import React from 'react';
import { Message, IParticipant } from '@sdk';
import './index.less';

export function MessageComp({ data, participant }: { data: Message; participant: IParticipant }) {
    const time = new Date(data.timestamp);
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');
    return (
        <div className="messageWrap">
            <div className="messageWrapHead">
                <div className="messageParticipantName">{participant.displayName}</div>
                <div className="messageTime">
                    {hour}:{minute}
                </div>
            </div>
            <div className="messageText">{data.message}</div>
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
        <div className="messageList">
            <div className="messageListWrap">
                {messages.map((item: Message) => (
                    <MessageComp
                        key={item.timestamp}
                        data={item}
                        participant={participantMap[item.from]}
                    />
                ))}
            </div>
        </div>
    );
}

export default React.memo(MessageList);
