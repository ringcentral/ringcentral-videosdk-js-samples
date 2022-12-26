import React, { FC, useRef, useState } from 'react';
import { Button, Popover, Tooltip } from '@mui/material';
import { Lock, People, LockOpen, MicOff, Mic } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import ParticipantItem from './participant-item';
import { ActiveFeatureModal, MeetingReduceType, useMeetingContext } from '@src/store/meeting';
import './index.less';
import MeetingFeatureModal from '../meeting-feature-modal';
import { useGlobalContext } from '@src/store/global';

const Participants: FC = () => {
    const { enqueueSnackbar } = useSnackbar();

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
                enqueueSnackbar('Unlock meeting failed', {
                    variant: 'error',
                });
            }
        } else {
            try {
                await meetingController.lockMeeting();
            } catch (e) {
                enqueueSnackbar('Lock meeting failed', {
                    variant: 'error',
                });
            }
        }
    };

    const muteAll = async () => {
        try {
            await meetingController?.getAudioController()?.muteAllRemoteAudioStreams();
            setIsShowMuteAllPopover(false);
        } catch (e) {
            enqueueSnackbar('Mute all audio failed', {
                variant: 'error',
            });
        }
    };

    const unmuteAll = async () => {
        try {
            await meetingController?.getAudioController()?.unmuteAllRemoteAudioStreams();
        } catch (e) {
            enqueueSnackbar('Unmute all audio failed', {
                variant: 'error',
            });
        }
    };

    return (
        <div className='participants'>
            <div className='action-button' onClick={showParticipantModal}>
                <People></People>
                <p className='count'>{meetingState.participantList.length}</p>
            </div>
            <MeetingFeatureModal title={`participants(${meetingState.participantList.length})`}>
                <div className='participants-modal'>
                    <div className='operation-bar'>
                        <div className='operation-bar-icon-wrapper' onClick={toggleLockMeeting}>
                            {meetingState.isMeetingLocked ? (
                                <Tooltip
                                    title='Allow new participants to join'
                                    placement='top'
                                    arrow>
                                    <Lock className='operation-bar-icon highlight'></Lock>
                                </Tooltip>
                            ) : (
                                <Tooltip
                                    title='Prevent new users from joining the meeting'
                                    placement='top'
                                    arrow>
                                    <LockOpen className='operation-bar-icon'></LockOpen>
                                </Tooltip>
                            )}
                        </div>
                        <div
                            className='operation-bar-icon-wrapper'
                            ref={muteAllButtonRef}
                            onClick={() => setIsShowMuteAllPopover(true)}>
                            <Tooltip title='Mute audio for all attendees' placement='top' arrow>
                                <MicOff className='operation-bar-icon'></MicOff>
                            </Tooltip>
                        </div>
                        <div className='operation-bar-icon-wrapper'>
                            <Tooltip
                                title='Request all attendees to ummute their audio'
                                placement='top'
                                arrow>
                                <Mic className='operation-bar-icon' onClick={unmuteAll}></Mic>
                            </Tooltip>
                        </div>
                        <Popover
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
                                    <Button
                                        variant='outlined'
                                        size='small'
                                        style={{ width: '80px' }}
                                        onClick={() => setIsShowMuteAllPopover(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant='contained'
                                        size='small'
                                        style={{ width: '80px', marginLeft: '10px' }}
                                        onClick={muteAll}>
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        </Popover>
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
