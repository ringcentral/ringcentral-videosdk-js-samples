import React, { FC, ReactNode } from 'react';
import { Portal } from '@mui/material';
import { Cancel, PushPinRounded } from '@mui/icons-material';
import { useMeetingContext, ActiveFeatureModal, MeetingReduceType } from '@src/store/meeting';
import './index.less';
import { useElementContext } from '@src/store/element';

interface IMeetingFeatureModal {
    children: ReactNode;
    title: string;
}
const MeetingFeatureModal: FC<IMeetingFeatureModal> = prop => {
    const { title, children } = prop;
    const { state: meetingState, dispatch } = useMeetingContext();
    const { sidePortal } = useElementContext();

    const closeActiveFeatureModal = () => {
        dispatch({
            type: MeetingReduceType.ACTIVE_FEATURE_MODAL,
            payload: { activeFeatureModal: null },
        });
    };

    const togglePin = () => {
        dispatch({
            type: MeetingReduceType.IS_MODAL_PINNED,
            payload: { isModalPinned: !meetingState.isModalPinned },
        });
    };

    if (meetingState.activeFeatureModal !== ActiveFeatureModal.Participant) {
        return null;
    }

    return (
        <Portal container={sidePortal.current} disablePortal={!meetingState.isModalPinned}>
            <div
                className={`meeting-feature-modal ${
                    meetingState.isModalPinned ? 'pin-up' : 'active'
                }`}>
                <div className='header'>
                    <p className='title'>{title}</p>
                    <div>
                        <PushPinRounded
                            sx={{
                                color: '#5f6368',
                                cursor: 'pointer',
                                transform: meetingState.isModalPinned
                                    ? 'rotate(0)'
                                    : 'rotate(45deg)',
                            }}
                            onClick={togglePin}></PushPinRounded>

                        <Cancel
                            sx={{
                                color: '#5f6368',
                                cursor: 'pointer',
                                marginLeft: '10px',
                            }}
                            onClick={closeActiveFeatureModal}></Cancel>
                    </div>
                </div>
                <div className='content'>{children}</div>
            </div>
        </Portal>
    );
};

export default MeetingFeatureModal;
