import React from 'react';
import { IParticipant } from '@ringcentral/video-sdk';
import { Select, MenuItem } from '@mui/material';

interface IParticipantsProps {
    uid: string;
    participants: IParticipant[];
    changeParticipants: (participantId) => void;
}
const Participants = ({ participants, uid, changeParticipants }: IParticipantsProps) => {
    return (
        <Select
            label="Select Participant"
            placeholder='chat with'
            style={{ width: 300, marginBottom: 20 }}
            value={uid}
            onChange={e => changeParticipants(e.target.value)}>
            {participants
                .filter(participant => !participant.isMe)
                .map(participant => (
                    <MenuItem key={participant.uid} value={participant.uid}>
                        {participant.displayName}
                    </MenuItem>
                ))}
        </Select>
    );
};

export default Participants;
