import { Dispatch } from 'react';
import { IParticipant, RcvEngine } from '@sdk';

export enum MeetingReduceType {
    MEETING_JOINED = 'MEETING_JOINED',
    PARTICIPANT_LIST = 'PARTICIPANTS_LIST',
    AUDIO_MUTE_UPDATED = 'AUDIO_MUTE_UPDATED',
    VIDEO_MUTE_UPDATED = 'VIDEO_MUTE_UPDATED'
}

export interface IMeetingState {
    isMeetingJoined: boolean;
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    participantList: IParticipant[];
}

export interface IMeetingAction {
    type: MeetingReduceType;
    payload?: Partial<IMeetingState>;
}

export interface IMeetingContext {
    rcvEngine: RcvEngine | null;
    state: IMeetingState;
    setRcvEngine: (rcvEngine: RcvEngine) => void;
    dispatch: Dispatch<IMeetingAction>;
}
