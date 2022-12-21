import React, { FC } from 'react';
import { RcIcon } from '@ringcentral/juno';
import { Team } from '@ringcentral/juno-icon';
import ParticipantItem from './participant-item';
import { ActiveFeatureModal, MeetingReduceType, useMeetingContext } from '@src/store/meeting';
import './index.less';
import MeetingFeatureModal from '../meeting-feature-modal';

const Participants: FC = () => {
    const { state: meetingState, dispatch } = useMeetingContext();

    const showParticipantModal = () => {
        dispatch({
            type: MeetingReduceType.ACTIVE_FEATURE_MODAL,
            payload: { activeFeatureModal: ActiveFeatureModal.Participant },
        });
    };

    return (
        <div className='participants'>
            <div className='action-button' onClick={showParticipantModal}>
                <RcIcon size='large' symbol={Team} />
                <p className='count'>{meetingState.participantList.length}</p>
                <p className='action-text'>Participants</p>
            </div>
            <MeetingFeatureModal title={`participants(${meetingState.participantList.length})`}>
                <div className='participants-modal'>
                    <div className='operation-bar'></div>
                    <div className='participant-list'>
                        {meetingState.participantList.map(participant => {
                            return (
                                <ParticipantItem
                                    key={participant.uid}
                                    participant={participant}></ParticipantItem>
                            );
                        })}
                    </div>
                </div>
            </MeetingFeatureModal>
        </div>
    );
};

export default Participants;
