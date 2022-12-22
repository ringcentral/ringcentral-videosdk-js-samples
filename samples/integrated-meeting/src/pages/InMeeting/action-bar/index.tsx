import React, { FC, useEffect } from 'react';
import { IParticipant } from '@sdk';
import { RcButton, RcIcon, RcIconButton } from '@ringcentral/juno';
import { MicOff, Mic, Videocam, VideocamOff, HandUp } from '@ringcentral/juno-icon';
import AudioAction from './audio-action';
import VideoAction from './video-action';
import LeaveAction from './leave-action';
import Participants from './participants';
import MeetingInfoAction from './meeting-info-action';
import './index.less';

const ActionBar: FC = () => {
    return (
        <div className='meeting-action-bar'>
            <div className='left-action-group'>
                <MeetingInfoAction></MeetingInfoAction>
            </div>
            <div className='action-group'>
                <AudioAction></AudioAction>
                <VideoAction></VideoAction>
                <Participants></Participants>
                <LeaveAction></LeaveAction>
            </div>
        </div>
    );
};

export default ActionBar;
