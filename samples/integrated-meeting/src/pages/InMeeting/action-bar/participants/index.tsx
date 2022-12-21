import React, { FC, useEffect, useRef, useState } from 'react';
import { RcIcon } from '@ringcentral/juno';
import { Team, DeleteCircle } from '@ringcentral/juno-icon';
import ParticipantItem from './participant-item';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import './index.less';

const Participants: FC = () => {
    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();

    const [isShowParticipantModal, setIsShowParticipantModal] = useState(false);

    return (
        <div className='participants'>
            <div className='action-button' onClick={() => setIsShowParticipantModal(true)}>
                <RcIcon size='large' symbol={Team} />
                <p className='count'>{meetingState.participantList.length}</p>
                <p className='action-text'>Participants</p>
            </div>
            {isShowParticipantModal ? (
                <div className='meeting-feature-modal participants-modal'>
                    <div className='header'>
                        <p className='title'>participants</p>
                        <RcIcon
                            size='large'
                            color='#5f6368'
                            symbol={DeleteCircle}
                            onClick={() => setIsShowParticipantModal(false)}
                        />
                    </div>
                    <div className='content'>
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
                </div>
            ) : null}
        </div>
    );
};

export default Participants;
