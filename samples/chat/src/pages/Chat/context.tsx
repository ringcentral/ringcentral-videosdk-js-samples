import { createContext } from 'react';
import { IParticipant, Message, ChatController } from '@sdk';

interface IChatContext {
    chatController: ChatController | undefined;
    participants: IParticipant[];
    messages: Message[];
}
const ChatContext = createContext<IChatContext>({} as any);

export default ChatContext;
