import React, { FC, useRef, useState } from 'react';
import { RcButton, RcIcon, RcPopover } from '@ringcentral/juno';
import { Team, Lock, Unlock, MicOff, Mic } from '@ringcentral/juno-icon';
import ParticipantItem from './participant-item';
import { ActiveFeatureModal, MeetingReduceType, useMeetingContext } from '@src/store/meeting';
import './index.less';
import MeetingFeatureModal from '../meeting-feature-modal';
import { useGlobalContext } from '@src/store/global';

const Participants: FC = () => {
    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState, dispatch } = useMeetingContext();

    const [isShowMuteAllPopover, setIsShowMuteAllPopover] = useState(false);
    const muteAllButtonRef = useRef();

    const showParticipantModal = () => {
        dispatch({
            type: MeetingReduceType.ACTIVE_FEATURE_MODAL,
            payload: { activeFeatureModal: ActiveFeatureModal.Participant },
        });
    };

    const toggleLockMeeting = async () => {
        if (meetingState.isMeetingLocked) {
            try {
                await meetingController.unlockMeeting();
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                await meetingController.lockMeeting();
            } catch (e) {
                console.log(e);
            }
        }
    };

    const muteAll = async () => {
        try {
            await meetingController?.getAudioController()?.muteAllRemoteAudioStreams();
            setIsShowMuteAllPopover(false);
        } catch (e) {
            console.log(e);
        }
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
                    <div className='operation-bar'>
                        <div className='operation-bar-icon-wrapper'>
                            <RcIcon
                                size='large'
                                className={`operation-bar-icon ${
                                    meetingState.isMeetingLocked ? 'highlight' : ''
                                }`}
                                symbol={meetingState.isMeetingLocked ? Lock : Unlock}
                                onClick={toggleLockMeeting}
                            />
                        </div>
                        <div className='operation-bar-icon-wrapper' ref={muteAllButtonRef}>
                            <RcIcon
                                size='large'
                                className='operation-bar-icon'
                                symbol={MicOff}
                                onClick={() => setIsShowMuteAllPopover(true)}
                            />
                        </div>
                        <div className='operation-bar-icon-wrapper'>
                            <RcIcon size='large' className='operation-bar-icon' symbol={Mic} />
                        </div>
                        <RcPopover
                            open={isShowMuteAllPopover}
                            anchorEl={muteAllButtonRef.current}
                            onClose={() => setIsShowMuteAllPopover(false)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}>
                            <div className='meeting-popover center-top'>
                                <div className='title'>Mute All</div>
                                <div className='content'>All participants will be muted.</div>
                                <div className='footer'>
                                    <RcButton
                                        radius='round'
                                        keepElevation
                                        color='#fff'
                                        size='small'
                                        style={{ width: '80px' }}
                                        onClick={() => setIsShowMuteAllPopover(false)}>
                                        Cancel
                                    </RcButton>
                                    <RcButton
                                        radius='round'
                                        keepElevation
                                        color='#066fac'
                                        size='small'
                                        style={{ width: '80px', marginLeft: '10px' }}
                                        onClick={muteAll}>
                                        Continue
                                    </RcButton>
                                </div>
                            </div>
                        </RcPopover>
                    </div>
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
