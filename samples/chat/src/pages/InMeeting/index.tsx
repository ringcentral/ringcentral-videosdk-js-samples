import React, { FC, useEffect, useState } from 'react'
import { RcvEngine, UserEvent, IParticipant } from '@sdk';
import { useParams } from 'react-router-dom';
import { RcButtonGroup, RcButton, RcDialog, RcDialogTitle, RcLoading } from '@ringcentral/juno';
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
        <div className='meeting-wrapper'>
            <RcLoading loading={loading}>
                <RcButtonGroup>
                    <RcButton color="success.b03" onClick={() => setChatVisible(true)}>Chat</RcButton>
                    <RcButton color="highlight.b03" onClick={handleLeaveMeeting}>Leave</RcButton>
                    <RcButton color="danger.b03" onClick={handleEndMeeting}>End</RcButton>
                </RcButtonGroup>
                <br />
                <ParticipantTable participantList={participantList} />
            </RcLoading>
            <RcDialog
                onClose={() => setChatVisible(false)}
                open={chatVisible}>
                <RcDialogTitle>Chat</RcDialogTitle>
                <ChatContent
                    chatController={meetingController?.getChatController()}
                    participants={participantList}
                />
            </RcDialog>

        </div>
    )
}

export default InMeeting