import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { AttendeeStatus } from '@ringcentral/video-sdk';

const ATTENDEE_STATUS_DESC = {
    [AttendeeStatus.IDLE]: 'Not started',
    [AttendeeStatus.DISCONNECTED]: 'Disconnected',
    [AttendeeStatus.NO_ANSWER]: 'No Answer',
    [AttendeeStatus.REJECTED]: 'Rejected',
    [AttendeeStatus.CANCELED]: 'Canceled',
    [AttendeeStatus.RINGING]: 'Ringing',
    [AttendeeStatus.ACTIVE]: 'Active',
    [AttendeeStatus.IN_WAITING_ROOM]: 'In waiting room',
    [AttendeeStatus.WAITING_ROOM_JOINING]: 'Waiting room join',
    [AttendeeStatus.INVISIBLE]: 'Invisible',
};

const ParticipantTable = ({ participantList }) => {

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Uid</TableCell>
                    <TableCell>DisplayName</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Host</TableCell>
                    <TableCell>Moderator</TableCell>
                    <TableCell>isSpeaking</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {participantList.map(participant => {
                    return (
                        <TableRow key={participant.uid}>
                            <TableCell> {participant.uid}</TableCell>
                            <TableCell> {participant.displayName}{participant.isMe ? '(Me)' : ''}</TableCell>
                            <TableCell> {ATTENDEE_STATUS_DESC[participant.status] || ''}</TableCell>
                            <TableCell> {participant.isHost ? 'YES' : 'NO'}</TableCell>
                            <TableCell> {participant.isModerator ? 'YES' : 'NO'}</TableCell>
                            <TableCell> {participant.isSpeaking ? 'YES' : 'NO'}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default ParticipantTable;