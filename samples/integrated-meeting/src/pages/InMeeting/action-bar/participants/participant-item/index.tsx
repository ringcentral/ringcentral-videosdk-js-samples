import React, { FC, useEffect, useRef } from 'react';
import { IParticipant } from '@sdk';
import Avatar from '@src/pages/InMeeting/avatar';

import { Popover } from '@mui/material';
import {
    MicOffOutlined,
    MicNoneOutlined,
    VideocamOffOutlined,
    VideocamOutlined,
    MoreVert,
    CallEnd,
    Star,
} from '@mui/icons-material';
import { useGlobalContext } from '@src/store/global';

interface IParticipantItem {
    participant: IParticipant;
}
const ParticipantItem: FC<IParticipantItem> = ({ participant }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const showMoreOperation = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const toggleMuteLocalAudio = () => {
        if (participant.isAudioMuted) {
            meetingController?.getAudioController()?.unmuteLocalAudioStream();
        } else {
            meetingController?.getAudioController()?.muteLocalAudioStream();
        }
    };

    const toggleMuteRemoteAudio = () => {
        if (participant.isAudioMuted) {
            meetingController?.getAudioController()?.unmuteRemoteAudioStream(participant.uid);
        } else {
            meetingController?.getAudioController()?.muteRemoteAudioStream(participant.uid);
        }
    };

    const toggleMuteLocalVideo = () => {
        if (participant.isVideoMuted) {
            meetingController?.getVideoController()?.unmuteLocalVideoStream();
        } else {
            meetingController?.getVideoController()?.muteLocalVideoStream();
        }
    };

    const toggleMuteRemoteVideo = () => {
        if (participant.isVideoMuted) {
            meetingController
                ?.getVideoController()
                ?.unmuteRemoteVideoStream(participant.uid)
                .then(res => {
                    console.log(res);
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
            meetingController?.getVideoController()?.muteRemoteVideoStream(participant.uid);
        }
    };

    const toggleMuteAudio = () => {
        if (participant.isMe) {
            toggleMuteLocalAudio();
        } else {
            toggleMuteRemoteAudio();
        }
    };

    const toggleMuteVideo = () => {
        if (participant.isMe) {
            toggleMuteLocalVideo();
        } else {
            toggleMuteRemoteVideo();
        }
    };

    const assignModerators = async () => {
        try {
            let res = await meetingController
                ?.getUserController()
                ?.assignModerators([participant.uid]);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };

    const removeUser = () => {
        try {
            meetingController?.getUserController()?.removeUser(participant.uid);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className='participant-item'>
            <div className='participant-info'>
                <Avatar displaySize={30} imgSize={45} participant={participant}></Avatar>
                <div className='participant-moderator'>
                    <Star sx={{ color: '#FF8800', fontSize: '16px' }}></Star>
                </div>
                <div className='participant-name'>
                    {participant.displayName}
                    {participant.isMe ? ' (you)' : ''}
                    {participant.isHost ? <p className='role'>meeting host</p> : null}
                </div>
            </div>
            <div className='participant-operation'>
                {!participant.isMe ? (
                    <>
                        <div onClick={showMoreOperation}>
                            <MoreVert className='participant-operation-icon more'></MoreVert>
                        </div>

                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}>
                            <div className='meeting-popover pad-t-10 pad-b-10 right-top'>
                                {!participant.isModerator ? (
                                    <div
                                        className='meeting-popover-operation-item'
                                        onClick={assignModerators}>
                                        <div className='operation-icon'>
                                            <Star color='#5f6368'></Star>
                                        </div>
                                        Assign moderator role
                                    </div>
                                ) : null}
                                <div
                                    className='meeting-popover-operation-item'
                                    onClick={removeUser}>
                                    <div className='operation-icon'>
                                        <CallEnd color='#5f6368'></CallEnd>
                                    </div>
                                    Hangup
                                </div>
                            </div>
                        </Popover>
                    </>
                ) : null}
                <div onClick={toggleMuteAudio} className='participant-operation-icon'>
                    {participant.isAudioMuted ? (
                        <MicOffOutlined></MicOffOutlined>
                    ) : (
                        <MicNoneOutlined></MicNoneOutlined>
                    )}
                </div>
                <div onClick={toggleMuteVideo} className='participant-operation-icon'>
                    {participant.isVideoMuted ? (
                        <VideocamOffOutlined></VideocamOffOutlined>
                    ) : (
                        <VideocamOutlined></VideocamOutlined>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParticipantItem;
