import { IMeetingState, MeetingReduceType, IMeetingAction } from './types';

export function meetingReducer(state: IMeetingState, { type, payload }: IMeetingAction) {
    switch (type) {
        case MeetingReduceType.PARTICIPANT_LIST:
            return {
                ...state,
                participantList: payload.participantList,
            };
        case MeetingReduceType.AUDIO_MUTE_UPDATED:
            return {
                ...state,
                isAudioMuted: payload.isAudioMuted,
            };
        case MeetingReduceType.VIDEO_MUTE_UPDATED:
            return {
                ...state,
                isVideoMuted: payload.isVideoMuted,
            };
        default:
            return state;
    }
}
