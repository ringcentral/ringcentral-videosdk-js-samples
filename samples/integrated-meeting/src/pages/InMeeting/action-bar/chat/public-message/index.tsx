import React, { FC, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ChatPrivilege, ChatType } from '@ringcentral/video-sdk';

import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';

import MessageList from '../message-list';
import SendMessage from '../send-message';

const PublicMessage: FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();
    const chatController = meetingController?.getChatController();
    const privilege = chatController?.getCurrentChatPrivilege();

    const { state: meetingState } = useMeetingContext();

    const [msg, setMsg] = useState<string>('');

    const sendMessage = async () => {
        try {
            await chatController?.sendMessageToAll(msg);
            setMsg('');
        } catch (error) {
            enqueueSnackbar(error.message, {
                variant: 'error',
            });
        }
    };
    const displayMessages = meetingState.chatMessages.filter(
        msg => msg.chatType === ChatType.PUBLIC
    );

    const hasPrivilege = useMemo(
        () =>
            meetingState.localParticipant.isHost ||
            meetingState.localParticipant.isModerator ||
            privilege === ChatPrivilege.EVERYONE,
        [meetingState.localParticipant, privilege]
    );

    return (
        <>
            <div className='chat-message mar-t-15'>
                <MessageList messages={displayMessages} />
            </div>
            <SendMessage
                msg={msg}
                send={sendMessage}
                onChange={setMsg}
                hasPrivilege={hasPrivilege}></SendMessage>
        </>
    );
};

export default PublicMessage;
