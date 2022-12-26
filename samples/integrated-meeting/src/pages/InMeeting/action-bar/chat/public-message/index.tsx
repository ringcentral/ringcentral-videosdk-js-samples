import React, { FC, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';

import { useMeetingContext } from '@src/store/meeting';
import './index.less';
import { useGlobalContext } from '@src/store/global';

import { ChatType, Message } from '@sdk';
import MessageList from '../message-list';
import SendMessage from '../send-message';

const PublicMessage: FC<{ messages: Message[] }> = props => {
    const { enqueueSnackbar } = useSnackbar();

    const { messages } = props;

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();
    const chatController = meetingController?.getChatController();

    const { state: meetingState, dispatch } = useMeetingContext();

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
    const displayMessages = messages.filter(msg => msg.chatType === ChatType.PUBLIC);

    return (
        <div className='chat-modal-content'>
            <MessageList messages={displayMessages} participants={meetingState.participantList} />

            <SendMessage
                hasPrivilege={true}
                msg={msg}
                send={sendMessage}
                onChange={msg => setMsg(msg)}
            />
        </div>
    );
};

export default PublicMessage;
