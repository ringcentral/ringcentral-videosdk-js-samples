import React, { FC, useMemo, useState, useEffect } from 'react'
import { ChatController, IParticipant, Message, ChatPrivilege, ChatType, ChatEvent } from '@sdk';
import { Tabs, Tab, Box } from '@mui/material';
import ChatContext from './context';
import SetPrivilege from './Privilege';
import MessageList from './MessageList';
import SendMessage from './SendMessage';
import Participants from './Participants';
interface IProps {
    chatController: ChatController | undefined;
    participants: IParticipant[];
}

const mainButtonGroup = [ChatType.PUBLIC, ChatType.PRIVATE];

const InMeeting: FC<IProps> = ({
    chatController,
    participants,
}) => {
    const [currentType, setCurrentType] = useState<ChatType>(mainButtonGroup[0]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [msg, setMsg] = useState<string>();
    const [uid, setUid] = useState<string>('');

    useEffect(() => {
        const receiveMsgs = msgs => setMessages(preMsgs => preMsgs.concat(msgs));
        // listen to CHAT_MESSAGE_RECEIVED event
        chatController?.on(ChatEvent.CHAT_MESSAGE_RECEIVED, receiveMsgs);
        // remove listener
        return () => chatController?.off(ChatEvent.CHAT_MESSAGE_RECEIVED, receiveMsgs);
    }, [chatController]);

    const isHostOrModerator = useMemo(() => {
        const myself: IParticipant = participants.filter(participant => participant.isMe)[0];
        return myself?.isHost || myself?.isModerator || false;
    }, [participants])

    const displayMessages = messages.filter(msg => {
        if (msg.chatType !== ChatType.PRIVATE) return msg.chatType === currentType;
        return [msg.from, msg.to].includes(uid);
    });

    const sendMessage = async () => {
        try {
            switch (currentType) {
                case ChatType.PUBLIC:
                    await chatController?.sendMessageToAll(msg);
                    break;
                case ChatType.PRIVATE:
                    await chatController?.sendMessageToUser(uid, msg);
                    break;
            }
            setMsg('');
        } catch (error) {
            alert(error.message);
        }
    }

    const props = {
        participants,
        chatController,
        messages,
    };

    return (
        <ChatContext.Provider value={props}>
            {isHostOrModerator && (
                <SetPrivilege defaultPrivilege={chatController?.getCurrentChatPrivilege()} />
            )}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentType} onChange={(event: React.ChangeEvent<{}>, value: any) => {
                    setCurrentType(value);
                    setUid('');
                }}>
                    <Tab value={ChatType.PUBLIC} label="public" />
                    <Tab value={ChatType.PRIVATE} label="private" />
                </Tabs>
            </Box>
            <TabPanel value={ChatType.PRIVATE} tab={currentType}>
                <Participants
                    participants={participants}
                    uid={uid}
                    changeParticipants={id => setUid(id)}
                />
            </TabPanel>
            <MessageList messages={displayMessages} participants={participants} />
            {(uid || currentType !== ChatType.PRIVATE) && (
                <SendMessage
                    hasPrivilege={isHostOrModerator || chatController?.getCurrentChatPrivilege() === ChatPrivilege.EVERYONE}
                    onChange={msg => setMsg(msg)}
                    send={sendMessage}
                    currentType={currentType}
                />
            )}
        </ChatContext.Provider>

    )
}

interface TabPanelProps {
    children?: React.ReactNode;
    tab: string;
    value: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, tab } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== tab}
            id={`simple-tabpanel-${tab}`}
            aria-labelledby={`simple-tab-${tab}`}
        >
            {value === tab && <div>{children}</div>}
        </div>
    );
}

export default InMeeting