import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { RcvEngine, UserEvent, IParticipant, AttendeeStatus } from '@sdk';
import { Button, ButtonGroup, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
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
            <ButtonGroup>
                {meetingController?.isWaitingRoomEnabled && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleAdmitAll}>
                        Admit all
                    </Button>
                )}
                <Button variant="outlined" onClick={handleEndMeeting}>End meeting</Button>
            </ButtonGroup>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Uid</TableCell>
                        <TableCell>DisplayName</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Me</TableCell>
                        <TableCell>Host</TableCell>
                        <TableCell>Moderator</TableCell>
                        <TableCell>VideoMuted</TableCell>
                        <TableCell>AudioMuted</TableCell>
                        <TableCell>isScreenSharing</TableCell>
                        <TableCell>isSpeaking</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {participantList.map(participant => {
                        return (
                            <TableRow>
                                <TableCell> {participant.uid}</TableCell>
                                <TableCell> {participant.displayName}</TableCell>
                                <TableCell> {ATTENDEE_STATUS_DESC[participant.status] || 'Not included in enum'}</TableCell>
                                <TableCell> {participant.isMe ? 'YES' : 'NO'}</TableCell>
                                <TableCell> {participant.isHost ? 'YES' : 'NO'}</TableCell>
                                <TableCell> {participant.isModerator ? 'YES' : 'NO'}</TableCell>
                                <TableCell> {participant.isVideoMuted ? 'MUTE' : 'UNMUTE'}</TableCell>
                                <TableCell> {participant.isAudioMuted ? 'YES' : 'NO'}</TableCell>
                                <TableCell> {participant.isScreenSharing ? 'YES' : 'NO'}</TableCell>
                                <TableCell> {participant.isSpeaking ? 'YES' : 'NO'}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default InMeeting