import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Popover, Tooltip } from '@mui/material';
import { Lock, People, LockOpen, MicOff, Mic } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { useMeetingContext } from '@src/store/meeting';
import './index.less';
import { useGlobalContext } from '@src/store/global';

import SetPrivilege from '../privilege';
import { ChatEvent, ChatType, Message } from '@sdk';
import PublicMessage from '../public-message';
import PrivateMessage from '../private-message';

const ChatModalContent: FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();
    const chatController = meetingController?.getChatController();

    const { state: meetingState, dispatch } = useMeetingContext();
    const [messages, setMessages] = useState<Message[]>([]);

    const buttonGroups = [ChatType.PUBLIC, ChatType.PRIVATE];
    const [currentType, setCurrentType] = useState<ChatType>(ChatType.PUBLIC);

    useEffect(() => {
        const receiveMsgs = msgs => setMessages(preMsgs => preMsgs.concat(msgs));
        chatController?.on(ChatEvent.CHAT_MESSAGE_RECEIVED, receiveMsgs);
        return () => chatController?.off(ChatEvent.CHAT_MESSAGE_RECEIVED, receiveMsgs);
    }, [chatController]);

    return (
        <div className='chat-modal-content'>
            {meetingState.localParticipant.isHost || meetingState.localParticipant.isModerator ? (
                <SetPrivilege></SetPrivilege>
            ) : null}
            <ButtonGroup aria-label='main meeting tab' color='primary' variant='contained'>
                {buttonGroups.map((type: ChatType) => (
                    <Button
                        key={type}
                        variant={currentType === type ? 'contained' : 'outlined'}
                        onClick={() => {
                            if (type === currentType) return;
                            setCurrentType(type);
                        }}>
                        {type}
                    </Button>
                ))}
            </ButtonGroup>
            {currentType === ChatType.PUBLIC ? (
                <PublicMessage messages={messages}></PublicMessage>
            ) : (
                <PrivateMessage messages={messages}></PrivateMessage>
            )}
        </div>
    );
};

export default ChatModalContent;
