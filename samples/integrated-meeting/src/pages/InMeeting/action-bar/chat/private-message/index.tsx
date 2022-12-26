import React, { FC, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';

import { useMeetingContext } from '@src/store/meeting';
import './index.less';
import { useGlobalContext } from '@src/store/global';

import { ChatType, Message } from '@sdk';
import MessageList from '../message-list';
import SendMessage from '../send-message';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const PrivateMessage: FC<{ messages: Message[] }> = props => {
    const { enqueueSnackbar } = useSnackbar();

    const { messages } = props;

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();
    const chatController = meetingController?.getChatController();

    const { state: meetingState } = useMeetingContext();

    const [msg, setMsg] = useState<string>('');
    const [uid, setUid] = useState<string>('');

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
    const displayMessages = messages.filter(msg => [msg.from, msg.to].includes(uid));

    return (
        <div>
            <div style={{ margin: '20px 0 20px' }}>
                <FormControl>
                    <InputLabel>Select Participant</InputLabel>
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
            </div>
            <MessageList messages={displayMessages} participants={meetingState.participantList} />

            {uid && (
                <SendMessage
                    hasPrivilege={true}
                    msg={msg}
                    send={sendMessage}
                    onChange={msg => setMsg(msg)}
                />
            )}
        </div>
    );
};

export default PrivateMessage;
