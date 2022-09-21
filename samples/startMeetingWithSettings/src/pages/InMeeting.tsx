import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { RcvEngine, UserEvent, IParticipant, AttendeeStatus } from '@sdk';
import { RcButton, RcButtonGroup, RcTable, RcTableHead, RcTableRow, RcTableCell, RcTableBody } from '@ringcentral/juno';
import { useGlobalContext } from '../context';

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
interface IProps {
    rcvEngine: RcvEngine
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();
    const { isMeetingJoined } = useGlobalContext();
    const [participantList, setParticipantList] = useState<IParticipant[]>([]);

    const meetingController = rcvEngine?.getMeetingController();

    useEffect(() => {
        const initController = async () => {
            // when do refreshing
            if (!isMeetingJoined) {
                await rcvEngine.joinMeeting(meetingId);
            }
            initListener()
        }

        rcvEngine && initController();
    }, [meetingId, rcvEngine])

    const initListener = () => {
        // listen for user events
        const userController = meetingController?.getUserController()
        userController.on(UserEvent.USER_JOINED, () => {
            updateParticipants(userController?.getMeetingUsers());
        });
        userController.on(UserEvent.USER_LEFT, () => {
            updateParticipants(userController?.getMeetingUsers());
        });
        userController.on(UserEvent.USER_UPDATED, () => {
            updateParticipants(userController?.getMeetingUsers());
        });
        updateParticipants(userController.getMeetingUsers())
    }

    const updateParticipants = (users: Record<string, IParticipant>) => {
        const localParticipant = Object.values(users).filter(participant => participant.isMe);
        const activeRemoteParticipants = Object.values(users).filter(
            participant => !participant.isDeleted && !participant.isMe
        );
        setParticipantList([...localParticipant, ...activeRemoteParticipants]);
    }

    const handleAdmitAll = () => {
        meetingController.getUserController().admitAll().catch(e => {
            alert(`Error occurs in putUserInWaitingRoom due to :${e.message}`)
        });
    };

    const handleEndMeeting = () => {
        rcvEngine?.getMeetingController()?.endMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });
    }

    return (
        <div className='meeting-wrapper'>
            <RcButtonGroup>
                {meetingController?.isWaitingRoomEnabled && (
                    <RcButton
                        onClick={handleAdmitAll}
                        color="success.b03">
                        Admit all
                    </RcButton>
                )}
                <RcButton color="danger.b03" onClick={handleEndMeeting}>End meeting</RcButton>
            </RcButtonGroup>
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
                            <RcTableRow>
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
        </div>
    )
}

export default InMeeting