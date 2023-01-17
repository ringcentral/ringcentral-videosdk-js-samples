import React, { FC } from 'react';
import { IParticipant, NQIState } from '@sdk';

import { MicOff, Mic } from '@mui/icons-material';
import GoodConnection from '@src/components/icon/good-connection';
import WeakConnection from '@src/components/icon/weak-connection';
import PoorConnection from '@src/components/icon/poor-connection';
import NoConnection from '@src/components/icon/no-connection';

import './index.less';

const NqiIcon = ({ nqiStatus }: { nqiStatus?: NQIState }) => {
    if (nqiStatus === NQIState.GOOD) {
        return <GoodConnection size={14}></GoodConnection>;
    } else if (nqiStatus === NQIState.MEDIUM) {
        return <WeakConnection size={14}></WeakConnection>;
    } else if (nqiStatus === NQIState.POOR) {
        return <PoorConnection size={14}></PoorConnection>;
    } else if (nqiStatus === NQIState.DISCONNECT) {
      return <NoConnection size={14}></NoConnection>;
    }
    return <GoodConnection size={14}></GoodConnection>;
};

interface IVideoInfo {
    participant: IParticipant;
    isMe: boolean;
    nqi?: NQIState;
}
const VideoInfo: FC<IVideoInfo> = ({ nqi, isMe, participant }) => {
    return (
        <div className='gallery-video-info'>
            <div className='icon-item'>
                <NqiIcon nqiStatus={nqi}></NqiIcon>
            </div>
            <div className='icon-item'>
                {participant.isAudioMuted ? (
                    <MicOff sx={{ fontSize: '14px' }}></MicOff>
                ) : (
                    <Mic sx={{ fontSize: '14px' }}></Mic>
                )}
            </div>

            <p className='display-name'>{participant.displayName}{isMe?'(You)':''}</p>
        </div>
    );
};

export default VideoInfo;
