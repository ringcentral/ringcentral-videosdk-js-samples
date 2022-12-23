import React, { FC, useEffect, useMemo } from 'react';
import { IParticipant, NQIState } from '@sdk';

import { MicOff, Mic } from '@mui/icons-material';

import './index.less';

// const NqiIconMap = {
//     [NQIState.GOOD]: GoodConnection,
//     [NQIState.MEDIUM]: WeakConnection,
//     [NQIState.DISCONNECT]: NoConnection,
//     [NQIState.POOR]: PoorConnection,
//     [NQIState.UNKNOWN]: WeakConnection,
// };

interface VideoInfo {
    participant: IParticipant;
}
const VideoInfo: FC<VideoInfo> = ({ participant }) => {
    return (
        <div className='gallery-video-info'>
            <div className='icon-item'>
                {/* <RcIcon size='small' symbol={NqiIconMap[participant.nqiStatus]} /> */}
            </div>
            <div className='icon-item'>
                {participant.isAudioMuted ? <MicOff></MicOff> : <Mic></Mic>}
            </div>

            <p className='display-name'>{participant.displayName}</p>
        </div>
    );
};

export default VideoInfo;
