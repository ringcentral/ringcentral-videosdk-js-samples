import { Dispatch } from 'react';
import { IMeetingInfo, IParticipant, RcvEngine } from '@sdk';

export enum MeetingReduceType {
    PARTICIPANT_LIST = 'PARTICIPANTS_LIST',
    AUDIO_MUTE_UPDATED = 'AUDIO_MUTE_UPDATED',
    VIDEO_MUTE_UPDATED = 'VIDEO_MUTE_UPDATED',
    MEETING_INFO = 'MEETING_INFO',
}

export interface IMeetingState {
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    participantList: IParticipant[];
    localParticipant?: IParticipant;
    meetingInfo?: IMeetingInfo;
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
