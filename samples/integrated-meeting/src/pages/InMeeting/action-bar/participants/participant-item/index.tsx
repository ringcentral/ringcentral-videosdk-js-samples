import React, { FC, useMemo } from 'react';
import { IParticipant } from '@sdk';
import Avatar from '@src/pages/InMeeting/avatar';

import { useSnackbar } from 'notistack';
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
    localParticipantIsHost: boolean;
}
const ParticipantItem: FC<IParticipantItem> = ({ participant, localParticipantIsHost }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const showMoreOperation = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const hasPermission = useMemo(() => {
        return localParticipantIsHost || participant.isMe;
    }, [localParticipantIsHost, participant.isMe]);

    const toggleMuteLocalAudio = async () => {
        try {
            if (participant.isAudioMuted) {
                await meetingController?.getAudioController()?.unmuteLocalAudioStream();
            } else {
                await meetingController?.getAudioController()?.muteLocalAudioStream();
            }
        } catch (e) {
            enqueueSnackbar('Toggle mute audio failed', {
                variant: 'error',
            });
        }
    };

    const toggleMuteRemoteAudio = async () => {
        try {
            if (participant.isAudioMuted) {
                await meetingController
                    ?.getAudioController()
                    ?.unmuteRemoteAudioStream(participant.uid);
            } else {
                await meetingController
                    ?.getAudioController()
                    ?.muteRemoteAudioStream(participant.uid);
            }
        } catch (e) {
            enqueueSnackbar('Toggle mute remote audio failed', {
                variant: 'error',
            });
        }
    };

    const toggleMuteLocalVideo = async () => {
        try {
            if (participant.isVideoMuted) {
                await meetingController?.getVideoController()?.unmuteLocalVideoStream();
            } else {
                await meetingController?.getVideoController()?.muteLocalVideoStream();
            }
        } catch (e) {
            enqueueSnackbar('Toggle mute video failed', {
                variant: 'error',
            });
        }
    };

    const toggleMuteRemoteVideo = async () => {
        try {
            if (participant.isVideoMuted) {
                await meetingController
                    ?.getVideoController()
                    ?.unmuteRemoteVideoStream(participant.uid);
            } else {
                await meetingController
                    ?.getVideoController()
                    ?.muteRemoteVideoStream(participant.uid);
            }
        } catch (e) {
            enqueueSnackbar('Toggle mute remote video failed', {
                variant: 'error',
            });
        }
    };

    const toggleMuteAudio = () => {
        if (!hasPermission) {
            return;
        }
        if (participant.isMe) {
            toggleMuteLocalAudio();
        } else {
            toggleMuteRemoteAudio();
        }
    };

    const toggleMuteVideo = () => {
        if (!hasPermission) {
            return;
        }
        if (participant.isMe) {
            toggleMuteLocalVideo();
        } else {
            toggleMuteRemoteVideo();
        }
    };

    const assignModerators = async () => {
        try {
            await meetingController?.getUserController()?.assignModerators([participant.uid]);
            setAnchorEl(null);
        } catch (e) {
            enqueueSnackbar('Assign moderator failed', {
                variant: 'error',
            });
        }
    };

    const removeUser = async () => {
        try {
            await meetingController?.getUserController()?.removeUser(participant.uid);
            setAnchorEl(null);
        } catch (e) {
            enqueueSnackbar('Remove participant failed', {
                variant: 'error',
            });
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
                {localParticipantIsHost && !participant.isMe ? (
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
                                            <Star
                                                sx={{ color: '#5f6368', fontSize: '14px' }}></Star>
                                        </div>
                                        Assign moderator role
                                    </div>
                                ) : null}
                                <div
                                    className='meeting-popover-operation-item'
                                    onClick={removeUser}>
                                    <div className='operation-icon'>
                                        <CallEnd
                                            sx={{ color: '#5f6368', fontSize: '14px' }}></CallEnd>
                                    </div>
                                    Hangup
                                </div>
                            </div>
                        </Popover>
                    </>
                ) : null}
                <div
                    onClick={toggleMuteAudio}
                    className={`participant-operation-icon ${!hasPermission ? 'disabled' : ''}`}>
                    {participant.isAudioMuted ? (
                        <MicOffOutlined></MicOffOutlined>
                    ) : (
                        <MicNoneOutlined></MicNoneOutlined>
                    )}
                </div>
                <div
                    onClick={toggleMuteVideo}
                    className={`participant-operation-icon ${!hasPermission ? 'disabled' : ''}`}>
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
