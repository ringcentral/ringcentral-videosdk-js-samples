import React from 'react';
import { RcTable, RcTableHead, RcTableRow, RcTableCell, RcTableBody } from '@ringcentral/juno';
import { AttendeeStatus } from '@sdk';

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
        <RcTable>
            <RcTableHead>
                <RcTableRow>
                    <RcTableCell>Uid</RcTableCell>
                    <RcTableCell>DisplayName</RcTableCell>
                    <RcTableCell>Status</RcTableCell>
                    <RcTableCell>Me</RcTableCell>
                    <RcTableCell>Host</RcTableCell>
                    <RcTableCell>Moderator</RcTableCell>
                    <RcTableCell>VideoMuted</RcTableCell>
                    <RcTableCell>AudioMuted</RcTableCell>
                    <RcTableCell>isScreenSharing</RcTableCell>
                    <RcTableCell>isSpeaking</RcTableCell>
                </RcTableRow>
            </RcTableHead>
            <RcTableBody>
                {participantList.map(participant => {
                    return (
                        <RcTableRow key={participant.uid}>
                            <RcTableCell> {participant.uid}</RcTableCell>
                            <RcTableCell> {participant.displayName}</RcTableCell>
                            <RcTableCell> {ATTENDEE_STATUS_DESC[participant.status] || 'Not included in enum'}</RcTableCell>
                            <RcTableCell> {participant.isMe ? 'YES' : 'NO'}</RcTableCell>
                            <RcTableCell> {participant.isHost ? 'YES' : 'NO'}</RcTableCell>
                            <RcTableCell> {participant.isModerator ? 'YES' : 'NO'}</RcTableCell>
                            <RcTableCell> {participant.isVideoMuted ? 'MUTE' : 'UNMUTE'}</RcTableCell>
                            <RcTableCell> {participant.isAudioMuted ? 'YES' : 'NO'}</RcTableCell>
                            <RcTableCell> {participant.isScreenSharing ? 'YES' : 'NO'}</RcTableCell>
                            <RcTableCell> {participant.isSpeaking ? 'YES' : 'NO'}</RcTableCell>
                        </RcTableRow>
                    )
                })}
            </RcTableBody>
        </RcTable>
    )
}

export default ParticipantTable;