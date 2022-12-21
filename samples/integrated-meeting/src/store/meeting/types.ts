import { Dispatch } from 'react';
import { IMeetingInfo, IParticipant, RcvEngine } from '@sdk';

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
}

export interface IMeetingState {
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    participantList: IParticipant[];
    localParticipant?: IParticipant;
    meetingInfo?: IMeetingInfo;
    isModalPinned: boolean;
    activeFeatureModal: ActiveFeatureModal | null;
}

export interface IMeetingAction {
    type: MeetingReduceType;
    payload?: Partial<IMeetingState>;
}

export interface IMeetingContext {
    state: IMeetingState;
    dispatch: Dispatch<IMeetingAction>;
}
