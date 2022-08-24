import React, { FC, useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import { RcvEngine, UserEvent, IParticipant, AttendeeStatus } from '@sdk';
import { Button, ButtonGroup, Table } from 'react-bootstrap';

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
    const [participantList, setParticipantList] = useState<IParticipant[]>([]);

    const meetingController = useMemo(
        () => rcvEngine?.getMeetingController(),
        [rcvEngine, rcvEngine?.getMeetingController()]
    );

    useEffect(() => {
        const initController = async () => {
            let meetingCtl;
            if (rcvEngine?.getMeetingController()) {
                meetingCtl = rcvEngine?.getMeetingController();
            }
            // when do refreshing
            else {
                meetingCtl = await rcvEngine
                    .joinMeeting(meetingId, {});
            }
            initListener(meetingCtl)
        }

        rcvEngine && initController();
    }, [meetingId, rcvEngine])

    const initListener = (meetingController) => {
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
        meetingController.getUserController().admitAllUser().catch(e => {
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
                        onClick={handleAdmitAll}
                        color='success'>
                        Admit all
                    </Button>
                )}
                <Button variant="danger" onClick={handleEndMeeting}>End meeting</Button>
            </ButtonGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Uid</th>
                        <th>DisplayName</th>
                        <th>Status</th>
                        <th>Me</th>
                        <th>Host</th>
                        <th>Moderator</th>
                        <th>VideoMuted</th>
                        <th>AudioMuted</th>
                        <th>isScreenSharing</th>
                        <th>isSpeaking</th>
                    </tr>
                </thead>
                <tbody>
                    {participantList.map(participant => {
                        return (
                            <tr>
                                <td> {participant.uid}</td>
                                <td> {participant.displayName}</td>
                                <td> {ATTENDEE_STATUS_DESC[participant.status] || 'Not included in enum'}</td>
                                <td> {participant.isMe ? 'YES' : 'NO'}</td>
                                <td> {participant.isHost ? 'YES' : 'NO'}</td>
                                <td> {participant.isModerator ? 'YES' : 'NO'}</td>
                                <td> {participant.isVideoMuted ? 'MUTE' : 'UNMUTE'}</td>
                                <td> {participant.isAudioMuted ? 'YES' : 'NO'}</td>
                                <td> {participant.isScreenSharing ? 'YES' : 'NO'}</td>
                                <td> {participant.isSpeaking ? 'YES' : 'NO'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default InMeeting