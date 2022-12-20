import React, { FC, useEffect, useRef } from 'react';
import { IParticipant } from '@sdk';
import Avatar from '@src/components/avatar';
import { RcIcon, RcPopover } from '@ringcentral/juno';
import {
    VideocamOffBorder,
    VideocamBorder,
    MicOffBorder,
    MicBorder,
    MoreVert,
} from '@ringcentral/juno-icon';
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

    return (
        <div className='participant-item'>
            <div className='participant-info'>
                <Avatar displaySize={30} imgSize={45} participant={participant}></Avatar>
                <div className='participant-name'>
                    {participant.displayName}
                    {participant.isMe ? ' (you)' : ''}
                    {participant.isModerator ? <p className='role'>meeting host</p> : null}
                </div>
            </div>
            <div className='participant-operation'>
                {!participant.isMe ? (
                    <>
                        <RcIcon
                            size='medium'
                            className='participant-operation-icon more'
                            symbol={MoreVert}
                            onClick={showMoreOperation}
                        />
                        <RcPopover
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
                            <div className='meeting-popover'>
                                <div className='meeting-popover-operation-item'>
                                    Assign moderator role
                                </div>
                                <div className='meeting-popover-operation-item'>Hangup</div>
                            </div>
                        </RcPopover>
                    </>
                ) : null}

                <RcIcon
                    size='medium'
                    className='participant-operation-icon'
                    symbol={participant.isAudioMuted ? MicOffBorder : MicBorder}
                    onClick={toggleMuteAudio}
                />
                <RcIcon
                    size='medium'
                    className='participant-operation-icon'
                    symbol={participant.isVideoMuted ? VideocamOffBorder : VideocamBorder}
                    onClick={toggleMuteVideo}
                />
            </div>
        </div>
    );
};

export default ParticipantItem;
