import React, { FC } from 'react';
import AudioAction from './audio-action';
import VideoAction from './video-action';
import LeaveAction from './leave-action';
import Participants from './participants';
import MeetingInfoAction from './meeting-info-action';
import ClosedCaption from './closed-caption';
import Chat from './chat';
import RecordAction from './record-action';
import LiveTranscription from './live-transcription';
import './index.less';

const ActionBar: FC = () => {
    return (
        <div className='meeting-action-bar'>
            <div className='left-action-group'>
                <MeetingInfoAction />
            </div>
            <div className='action-group'>
                <AudioAction />
                <VideoAction />
                <Participants />
                <Chat />
                <RecordAction />
                <ClosedCaption />
                <LiveTranscription />
                <LeaveAction />
            </div>
        </div>
    );
};

export default ActionBar;
