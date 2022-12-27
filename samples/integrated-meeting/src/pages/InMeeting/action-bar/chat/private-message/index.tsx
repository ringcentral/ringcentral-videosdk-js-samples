import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ChatPrivilege, ChatType } from '@sdk';

import { KeyboardArrowLeft } from '@mui/icons-material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';

import MessageList from '../message-list';
import PrivateChatList from '../private-chat-list';
import SendMessage from '../send-message';

import { PrivateChatItem } from '../type';
import './index.less';

const PrivateMessage: FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();
    const chatController = meetingController?.getChatController();
    const privilege = chatController?.getCurrentChatPrivilege();

    const { state: meetingState } = useMeetingContext();

    const [privateChatList, setPrivateChatList] = useState<PrivateChatItem[]>([]);

    const privateChatListRef = useRef<PrivateChatItem[]>([]);

    const [msg, setMsg] = useState<string>('');
    const [uid, setUid] = useState<string>('');

    const sendMessage = async () => {
        try {
            await chatController?.sendMessageToUser(uid, msg);
            setMsg('');
        } catch (error) {
            enqueueSnackbar(error.message, {
                variant: 'error',
            });
        }
    };

    useEffect(() => {
        const localUid = meetingState.localParticipant.uid;
        let privateMessages = meetingState.chatMessages.filter(
            msg => msg.chatType === ChatType.PRIVATE
        );

        privateMessages.forEach(item => {
            let chatUid = '';
            if (item.to === localUid) {
                chatUid = item.from;
            } else if (item.from === localUid) {
                chatUid = item.to;
            }

            const newPrivateChat = {
                chatUid: chatUid,
                lastMessageFrom: item.from,
                lastMessageContent: item.from === localUid ? `You: ${item.message}` : item.message,
                lastMessageTime: item.timestamp,
            };
            let findIndex = privateChatListRef.current.findIndex(i => i.chatUid === chatUid);
            if (findIndex === -1) {
                privateChatListRef.current.push(newPrivateChat);
            } else {
                if (item.timestamp > privateChatListRef.current[findIndex].lastMessageTime) {
                    privateChatListRef.current[findIndex] = newPrivateChat;
                }
            }
        });
        setPrivateChatList(privateChatListRef.current);
    }, [meetingState.chatMessages]);

    const currentPrivateChatPerson = useMemo(() => {
        return meetingState.participantList.find(item => item.uid === uid);
    }, [uid, meetingState.participantList]);

    const displayMessages = meetingState.chatMessages.filter(msg =>
        [msg.from, msg.to].includes(uid)
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
            {uid ? (
                <>
                    <div className='current-chat-with' onClick={() => setUid('')}>
                        <KeyboardArrowLeft></KeyboardArrowLeft>
                        {currentPrivateChatPerson.displayName}
                    </div>
                    <div className='chat-message'>
                        <MessageList messages={displayMessages} />
                    </div>
                    <SendMessage
                        msg={msg}
                        send={sendMessage}
                        onChange={setMsg}
                        hasPrivilege={hasPrivilege}></SendMessage>
                </>
            ) : (
                <>
                    <FormControl size='small' sx={{ width: '320px', marginTop: '15px' }}>
                        <InputLabel>Chat with</InputLabel>
                        <Select
                            label='Select Participant'
                            placeholder='chat with'
                            style={{ width: 300, marginBottom: 20 }}
                            value={uid}
                            onChange={e => setUid(e.target.value)}>
                            {meetingState.participantList
                                .filter(participant => !participant.isMe)
                                .map(participant => (
                                    <MenuItem key={participant.uid} value={participant.uid}>
                                        {participant.displayName}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <div className='chat-message'>
                        <PrivateChatList privateChatList={privateChatList} onSelect={setUid} />
                    </div>
                </>
            )}
        </>
    );
};

export default PrivateMessage;
