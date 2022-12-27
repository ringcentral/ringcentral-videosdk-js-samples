import { Dispatch } from 'react';
import { IMeetingInfo, IParticipant, Message, RcvEngine } from '@sdk';

export enum ActiveFeatureModal {
    Participant,
    Chat,
}

export enum MeetingReduceType {
    PARTICIPANT_LIST = 'PARTICIPANTS_LIST',
    AUDIO_MUTE_UPDATED = 'AUDIO_MUTE_UPDATED',
    VIDEO_MUTE_UPDATED = 'VIDEO_MUTE_UPDATED',
    MEETING_INFO = 'MEETING_INFO',
    IS_MODAL_PINNED = 'IS_MODAL_PINNED',
    ACTIVE_FEATURE_MODAL = 'ACTIVE_FEATURE_MODAL',
    MEETING_LOCK_STATE = 'MEETING_LOCK_STATE',
    CHAT_MESSAGES = 'CHAT_MESSAGES',
}

export interface IMeetingState {
    isMeetingLocked: boolean;
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    participantList: IParticipant[];
    localParticipant?: IParticipant;
    meetingInfo?: IMeetingInfo;
    isModalPinned: boolean;
    activeFeatureModal: ActiveFeatureModal | null;
    chatMessages: Message[];
}

export interface IMeetingAction {
    type: MeetingReduceType;
    payload?: Partial<IMeetingState>;
}

export interface IMeetingContext {
    state: IMeetingState;
    dispatch: Dispatch<IMeetingAction>;
}
