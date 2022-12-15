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
    isMeetingJoined: false,
    isAudioMuted: true,
    isVideoMuted: true,
    participantList: [],
};
export const MeetingContext = createContext<IMeetingContext>({
    rcvEngine: null,
    state: initState,
    setRcvEngine: () => {},
    dispatch: () => {},
});

export const MeetingContextProvider: React.FC<
    PropsWithChildren<{ isMeetingJoined: boolean }>
> = props => {
    const { isMeetingJoined } = props;
    useEffect(() => {
        dispatch({ type: MeetingReduceType.MEETING_JOINED, payload: { isMeetingJoined } });
    }, [isMeetingJoined]);

    const [rcvEngine, setRcvEngine] = useState(null);
    const [state, dispatch] = useReducer(meetingReducer, initState);
    return (
        <MeetingContext.Provider value={{ state, dispatch, rcvEngine, setRcvEngine }}>
            {props.children}
        </MeetingContext.Provider>
    );
};

const useMeetingContext = () => useContext<IMeetingContext>(MeetingContext);
export { useMeetingContext };
