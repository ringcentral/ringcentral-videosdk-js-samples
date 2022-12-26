import React, { FC } from 'react';
import AudioAction from './audio-action';
import VideoAction from './video-action';
import LeaveAction from './leave-action';
import Participants from './participants';
import MeetingInfoAction from './meeting-info-action';
import ClosedCaption from './closed-caption';
import Chat from './chat';
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
                <Chat></Chat>
                <ClosedCaption></ClosedCaption>
                <LeaveAction></LeaveAction>
            </div>
        </div>
    );
};

export default ActionBar;
