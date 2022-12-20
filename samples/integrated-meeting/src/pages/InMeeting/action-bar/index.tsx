import React, { FC, useEffect } from 'react';
import { IParticipant } from '@sdk';
import { RcButton, RcIcon, RcIconButton } from '@ringcentral/juno';
import { MicOff, Mic, Videocam, VideocamOff, HandUp } from '@ringcentral/juno-icon';
import AudioAction from './audio-action';
import VideoAction from './video-action';
import MeetingInfoAction from './meeting-info-action';
import './index.less';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';

interface IActionBar {}
const ActionBar: FC<IActionBar> = () => {
    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();

    return (
        <div className='meeting-action-bar'>
            <div className='left-action-group'>
                <MeetingInfoAction></MeetingInfoAction>
            </div>
            <div className='action-group'>
                <AudioAction></AudioAction>
                <VideoAction></VideoAction>
                <div className='action-button highlight'>
                    <RcIcon size='large' symbol={HandUp} />
                    <p className='action-text'>Leave</p>
                </div>
            </div>
        </div>
    );
};

export default ActionBar;
