import React from 'react';
import { IParticipant } from '@sdk';
import { RcSelect, RcMenuItem } from '@ringcentral/juno';

interface IParticipantsProps {
    uid: string;
    participants: IParticipant[];
    changeParticipants: (participantId) => void;
}
const Participants = ({ participants, uid, changeParticipants }: IParticipantsProps) => {
    return (
        <RcSelect
            label="Select Participant"
            placeholder='chat with'
            style={{ width: 300, marginBottom: 20 }}
            value={uid}
            onChange={e => changeParticipants(e.target.value)}>
            {participants
                .filter(participant => !participant.isMe)
                .map(participant => (
                    <RcMenuItem key={participant.uid} value={participant.uid}>
                        {participant.displayName}
                    </RcMenuItem>
                ))}
        </RcSelect>
    );
};

export default Participants;
