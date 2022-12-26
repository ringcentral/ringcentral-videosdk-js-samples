import React, { FC, useRef, useState } from 'react';
import { Button, Popover, Tooltip } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { ActiveFeatureModal, MeetingReduceType, useMeetingContext } from '@src/store/meeting';
import './index.less';
import { useGlobalContext } from '@src/store/global';
import ChatModalContent from './chat-modal-content';
import MeetingFeatureModal from '../meeting-feature-modal';

const Chat: FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState, dispatch } = useMeetingContext();

    const showParticipantModal = () => {
        dispatch({
            type: MeetingReduceType.ACTIVE_FEATURE_MODAL,
            payload: { activeFeatureModal: ActiveFeatureModal.Chat },
        });
    };

    return (
        <div className='chat'>
            <div className='action-button' onClick={showParticipantModal}>
                <ChatIcon></ChatIcon>
            </div>
            {meetingState.activeFeatureModal === ActiveFeatureModal.Chat ? (
                <MeetingFeatureModal title='chat'>
                    <ChatModalContent></ChatModalContent>
                </MeetingFeatureModal>
            ) : null}
        </div>
    );
};

export default Chat;
