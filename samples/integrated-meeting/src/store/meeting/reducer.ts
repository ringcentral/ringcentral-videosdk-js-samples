import { IMeetingState, MeetingReduceType, IMeetingAction } from './types';

export function meetingReducer(state: IMeetingState, { type, payload }: IMeetingAction) {
    switch (type) {
        case MeetingReduceType.PARTICIPANT_LIST:
            return {
                ...state,
                localParticipant: payload.localParticipant,
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
        case MeetingReduceType.MEETING_INFO:
            return {
                ...state,
                meetingInfo: payload.meetingInfo,
            };
        default:
            return state;
    }
}
