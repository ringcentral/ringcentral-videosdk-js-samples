import React, { FC, ReactNode, useCallback } from 'react';
import { RcIcon, RcPortal, RcText } from '@ringcentral/juno';
import { DeleteCircle, Pin, UnpinSlash } from '@ringcentral/juno-icon';
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
        <RcPortal container={sidePortal.current} disablePortal={!meetingState.isModalPinned}>
            <div
                className={`meeting-feature-modal ${
                    meetingState.isModalPinned ? 'pin-up' : 'active'
                }`}>
                <div className='header'>
                    <p className='title'>{title}</p>
                    <div>
                        <RcIcon
                            size='medium'
                            color='#5f6368'
                            symbol={meetingState.isModalPinned ? UnpinSlash : Pin}
                            onClick={togglePin}
                        />
                        <RcIcon
                            style={{ marginLeft: '10px' }}
                            size='medium'
                            color='#5f6368'
                            symbol={DeleteCircle}
                            onClick={closeActiveFeatureModal}
                        />
                    </div>
                </div>
                <div className='content'>{children}</div>
            </div>
        </RcPortal>
    );
};

export default MeetingFeatureModal;
