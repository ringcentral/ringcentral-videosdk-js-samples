import React, { FC, useEffect } from 'react';
import { IParticipant } from '@sdk';
import { RcButton, RcIcon, RcIconButton } from '@ringcentral/juno';
import { MicOff, Mic, Videocam, VideocamOff, HandUp } from '@ringcentral/juno-icon';
import './index.less';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';

interface IActionBar {}
const ActionBar: FC<IActionBar> = () => {
    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();
    useEffect(() => {
        console.log(meetingState);
    }, [meetingState]);
    const toggleMuteAudio = () => {
        if (meetingState.isAudioMuted) {
            meetingController
                ?.getAudioController()
                ?.unmuteLocalAudioStream()
                .catch(e => {
                    console.log(e);
                });
        } else {
            meetingController
                ?.getAudioController()
                ?.muteLocalAudioStream()
                .catch(e => {
                    console.log(e);
                });
        }
    };

    const toggleMuteVideo = () => {
        if (meetingState.isVideoMuted) {
            meetingController
                ?.getVideoController()
                ?.unmuteLocalVideoStream()
                .catch(e => {
                    console.log(e);
                });
        } else {
            meetingController
                ?.getVideoController()
                ?.muteLocalVideoStream()
                .catch(e => {
                    console.log(e);
                });
        }
    };

    const handleLeaveMeeting = () =>
        meetingController?.leaveMeeting().catch(e => {
            alert(`Error occurs due to :${e.message}`);
        });

    const handleEndMeeting = () => {
        meetingController?.endMeeting().catch(e => {
            alert(`Error occurs due to :${e.message}`);
        });
    };
    return (
        <div className='meeting-action-bar'>
            <div className='action-group'>
                <div
                    className={`action-button ${meetingState.isAudioMuted ? 'highlight' : ''}`}
                    onClick={toggleMuteAudio}>
                    <RcIcon size='medium' symbol={meetingState.isAudioMuted ? MicOff : Mic} />
                </div>
                <div
                    className={`action-button ${meetingState.isAudioMuted ? 'highlight' : ''}`}
                    onClick={toggleMuteVideo}>
                    <RcIcon
                        size='medium'
                        symbol={meetingState.isVideoMuted ? VideocamOff : Videocam}
                    />
                </div>
                <div className='action-button highlight'>
                    <RcIcon size='medium' symbol={HandUp} />
                </div>
            </div>
        </div>
    );
};

export default ActionBar;
