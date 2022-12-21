import React, {
    createContext,
    Dispatch,
    useCallback,
    useContext,
    useReducer,
    PropsWithChildren,
    useState,
    useEffect,
} from 'react';
import { IMeetingState, IMeetingContext, MeetingReduceType } from './types';
import { meetingReducer } from './reducer';

const initState: IMeetingState = {
    isAudioMuted: true,
    isVideoMuted: true,
    participantList: [],
    isModalPinned: false,
    activeFeatureModal: null,
};
export const MeetingContext = createContext<IMeetingContext>({
    state: initState,
    dispatch: () => {},
});

export const MeetingContextProvider: React.FC<PropsWithChildren<{}>> = props => {
    const [state, dispatch] = useReducer(meetingReducer, initState);
    return (
        <MeetingContext.Provider value={{ state, dispatch }}>
            {props.children}
        </MeetingContext.Provider>
    );
};

const useMeetingContext = () => useContext<IMeetingContext>(MeetingContext);
export { useMeetingContext };
