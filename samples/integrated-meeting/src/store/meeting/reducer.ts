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
        case MeetingReduceType.IS_MODAL_PINNED:
            return {
                ...state,
                isModalPinned: payload.isModalPinned,
            };
        case MeetingReduceType.ACTIVE_FEATURE_MODAL:
            return {
                ...state,
                activeFeatureModal: payload.activeFeatureModal,
            };
        case MeetingReduceType.MEETING_LOCK_STATE:
            return {
                ...state,
                isMeetingLocked: payload.isMeetingLocked,
            };

        default:
            return state;
    }
}
