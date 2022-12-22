import React, { FC, useEffect, useRef, useState } from 'react';
import { RcButton, RcIcon, RcPopover } from '@ringcentral/juno';
import { Videocam, VideocamOff, ArrowUp2, Check } from '@ringcentral/juno-icon';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { VideoEvent } from '@sdk';

const VideoAction: FC = () => {
    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();
    const [videoDeviceList, setVideoDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [videoActiveDevice, setVideoActiveDevice] = useState('');

    const [isShowVideoDeviceList, setIsShowVideoDeviceList] = useState(false);

    const actionButtonRef = useRef();

    useEffect(() => {
        if (rcvEngine) {
            getvideoDeviceList();
            initListener();
        }
    }, [rcvEngine]);

    const [isShowVideoUnmuteDemandPop, setIsShowVideoUnmuteDemandPop] = useState(false);

    const initListener = () => {
        const videoController = meetingController?.getVideoController();

        const videoMuteDemandListener = videoController?.on(VideoEvent.VIDEO_UNMUTE_DEMAND, () => {
            setIsShowVideoUnmuteDemandPop(true);
        });
        return () => {
            videoMuteDemandListener();
        };
    };

    const getvideoDeviceList = () => {
        rcvEngine
            .getVideoDeviceManager()
            .enumerateVideoDevices()
            .then(devices => {
                setVideoDeviceList(devices || []);
                devices.length && setVideoActiveDevice(devices[0].deviceId);
            });
    };

    const handleChangeVideoDevice = (deviceId: string) => {
        if (videoActiveDevice === deviceId) {
            return;
        }
        meetingController
            .getAudioController()
            .enableAudio({ deviceId })
            .then(() => {
                setVideoActiveDevice(deviceId);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const toggleMuteVideo = () => {
        if (meetingState.isVideoMuted) {
            meetingController?.getVideoController()?.unmuteLocalVideoStream();
        } else {
            meetingController?.getVideoController()?.muteLocalVideoStream();
        }
    };

    const acceptUnMuteVideoDemand = () => {
        meetingController?.getVideoController()?.unmuteLocalVideoStream();
        setIsShowVideoUnmuteDemandPop(false);
    };

    return (
        <div>
            <div className='action-button' onClick={toggleMuteVideo} ref={actionButtonRef}>
                <RcIcon size='large' symbol={meetingState.isVideoMuted ? VideocamOff : Videocam} />
                <p className='action-text'>
                    {meetingState.isVideoMuted ? 'Start Video' : 'Stop Video'}
                </p>
                <div
                    className={`action-button-more ${isShowVideoDeviceList ? 'checked' : ''}`}
                    onClick={e => {
                        e.stopPropagation();
                        setIsShowVideoDeviceList(!isShowVideoDeviceList);
                    }}>
                    <RcIcon size='small' symbol={ArrowUp2} />
                </div>
            </div>
            <RcPopover
                open={isShowVideoDeviceList}
                anchorEl={actionButtonRef.current}
                onClose={() => setIsShowVideoDeviceList(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}>
                <div className='meeting-popover pad-t-10 pad-b-10 center-bottom'>
                    {videoDeviceList.map(item => {
                        return (
                            <div
                                key={item.deviceId}
                                className='meeting-popover-operation-item'
                                onClick={e => {
                                    e.stopPropagation();
                                    handleChangeVideoDevice(item.deviceId);
                                }}>
                                {videoActiveDevice === item.deviceId ? (
                                    <div className='operation-icon'>
                                        <RcIcon size='small' symbol={Check} color='#039fd8' />
                                    </div>
                                ) : null}
                                {item.label}
                            </div>
                        );
                    })}
                </div>
            </RcPopover>
            <RcPopover
                open={Boolean(actionButtonRef.current) && isShowVideoUnmuteDemandPop}
                anchorEl={actionButtonRef.current}
                onClose={() => setIsShowVideoUnmuteDemandPop(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}>
                <div className='meeting-popover center-bottom'>
                    <div className='title'>Unmute</div>
                    <div className='content'>Allow moderator to unmute you?</div>
                    <div className='footer pad-t-5'>
                        <RcButton
                            radius='round'
                            keepElevation
                            color='#fff'
                            size='small'
                            style={{ width: '100px' }}
                            onClick={() => setIsShowVideoUnmuteDemandPop(false)}>
                            Don't Allow
                        </RcButton>
                        <RcButton
                            radius='round'
                            keepElevation
                            color='#066fac'
                            size='small'
                            style={{ width: '100px', marginLeft: '10px' }}
                            onClick={acceptUnMuteVideoDemand}>
                            OK
                        </RcButton>
                    </div>
                </div>
            </RcPopover>
        </div>
    );
};

export default VideoAction;
