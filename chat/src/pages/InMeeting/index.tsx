import React, { FC, useEffect, useState } from 'react'
import { RcvEngine, UserEvent, IParticipant } from '@ringcentral/video-sdk';
import { useParams } from 'react-router-dom';
import { ButtonGroup, Button, Dialog, DialogTitle, Alert, DialogContent } from '@mui/material';
import { useGlobalContext } from '../../context';
import ParticipantTable from './ParticipantTable'
import ChatContent from '../Chat'
interface IProps {
    rcvEngine: RcvEngine
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();
    const { isMeetingJoined } = useGlobalContext();

    const [loading, setLoading] = useState(false)
    const [participantList, setParticipantList] = useState<IParticipant[]>([]);
    const [chatVisible, setChatVisible] = useState(false);

    const meetingController = rcvEngine?.getMeetingController();

    useEffect(() => {
        const initController = async () => {
            // when do refreshing
            if (!isMeetingJoined) {
                setLoading(true);
                await rcvEngine.joinMeeting(meetingId);
                setLoading(false);
            }

            initListener();
        }
        rcvEngine && initController();
    }, [meetingId, rcvEngine])

    const initListener = () => {
        const userController = meetingController?.getUserController();
        // listen for user events
        userController.on(UserEvent.USER_JOINED, () => {
            updateParticipants(userController?.getMeetingUsers());
        });
        userController.on(UserEvent.USER_LEFT, () => {
            updateParticipants(userController?.getMeetingUsers());
        });
        userController.on(UserEvent.USER_UPDATED, () => {
            updateParticipants(userController?.getMeetingUsers());
        });
        userController.on(UserEvent.USER_ROLE_CHANGED, () => {
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


    // ---------------------------- start: button click handler ----------------------------
    const handleLeaveMeeting = () =>
        meetingController?.leaveMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });


    const handleEndMeeting = () => {
        meetingController?.endMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });
    }
    // ---------------------------- end: button click handler ----------------------------

    return (
        <>
            <Alert severity="info"> {loading ? 'loading...' : 'Meeting Id:' + meetingId}</Alert>
            <div className='meeting-wrapper'>
                <ButtonGroup>
                    <Button variant="contained" onClick={() => setChatVisible(true)}>Chat</Button>
                    <Button variant="outlined" color="secondary" onClick={handleLeaveMeeting}>Leave</Button>
                    <Button variant="contained" color="error" onClick={handleEndMeeting}>End</Button>
                </ButtonGroup>
                <br />
                <ParticipantTable participantList={participantList} />
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    onClose={() => setChatVisible(false)}
                    open={chatVisible}>
                    <DialogTitle>Chat</DialogTitle>
                    <DialogContent>
                        <ChatContent
                            chatController={meetingController?.getChatController()}
                            participants={participantList}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default InMeeting