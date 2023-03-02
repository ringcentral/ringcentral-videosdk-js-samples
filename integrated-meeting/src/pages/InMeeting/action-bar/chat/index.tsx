import React, { FC, useState } from 'react';
import { ChatType } from '@ringcentral/video-sdk';
import { Button, ButtonGroup } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

import { ActiveFeatureModal, MeetingReduceType, useMeetingContext } from '@src/store/meeting';
import MeetingFeatureModal from '../meeting-feature-modal';
import SetPrivilege from './privilege';
import PublicMessage from './public-message';
import PrivateMessage from './private-message';
import './index.less';

const Chat: FC = () => {
    const { state: meetingState, dispatch } = useMeetingContext();

    const buttonGroups = [ChatType.PUBLIC, ChatType.PRIVATE];
    const [currentType, setCurrentType] = useState<ChatType>(ChatType.PUBLIC);

    const showChatModal = () => {
        dispatch({
            type: MeetingReduceType.ACTIVE_FEATURE_MODAL,
            payload: { activeFeatureModal: ActiveFeatureModal.Chat },
        });
    };

    return (
        <div className='chat'>
            <div className='action-button' onClick={showChatModal}>
                <ChatIcon></ChatIcon>
            </div>
            {meetingState.activeFeatureModal === ActiveFeatureModal.Chat ? (
                <MeetingFeatureModal title='chat'>
                    <div className='chat-modal-content'>
                        {meetingState.localParticipant.isHost ||
                        meetingState.localParticipant.isModerator ? (
                            <SetPrivilege></SetPrivilege>
                        ) : null}
                        <ButtonGroup color='primary' fullWidth variant='contained'>
                            {buttonGroups.map((type: ChatType) => (
                                <Button
                                    key={type}
                                    variant={currentType === type ? 'contained' : 'outlined'}
                                    onClick={() => {
                                        if (type === currentType) return;
                                        setCurrentType(type);
                                    }}>
                                    {type === ChatType.PUBLIC ? 'With everyone' : 'Privately'}
                                </Button>
                            ))}
                        </ButtonGroup>
                        {currentType === ChatType.PUBLIC ? (
                            <PublicMessage></PublicMessage>
                        ) : (
                            <PrivateMessage></PrivateMessage>
                        )}
                    </div>
                </MeetingFeatureModal>
            ) : null}
        </div>
    );
};

export default Chat;
