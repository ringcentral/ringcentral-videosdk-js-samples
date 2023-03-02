import React, { FC, useEffect, useRef, useState } from 'react';

import { Button, Popover } from '@mui/material';
import { Videocam, VideocamOff, KeyboardArrowUp, Check } from '@mui/icons-material';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { VideoEvent } from '@ringcentral/video-sdk';
import { useSnackbar } from 'notistack';

const VideoAction: FC = () => {
    const { enqueueSnackbar } = useSnackbar();

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

    const getvideoDeviceList = async () => {
        try {
            let devices = await rcvEngine.getVideoDeviceManager().enumerateVideoDevices();
            setVideoDeviceList(devices || []);
            devices.length && setVideoActiveDevice(devices[0].deviceId);
        } catch (e) {
            enqueueSnackbar('Get audio device list failed', {
                variant: 'error',
            });
        }
    };

    const handleChangeVideoDevice = async (deviceId: string) => {
        if (videoActiveDevice === deviceId) {
            return;
        }
        try {
            await rcvEngine?.getVideoDeviceManager().setVideoDevice(deviceId);
            if (!meetingState.isVideoMuted) {
                await meetingController
                    .getVideoController()
                    .unmuteLocalVideoStream({ advanced: [{ deviceId }] });
            }
            setVideoActiveDevice(deviceId);
        } catch (e) {
            enqueueSnackbar('Change video device failed', {
                variant: 'error',
            });
        }
    };

    const toggleMuteVideo = async () => {
        try {
            if (meetingState.isVideoMuted) {
                const constraints = videoActiveDevice ? {
                    deviceId: videoActiveDevice
                } : undefined;
                await meetingController?.getVideoController()?.unmuteLocalVideoStream(constraints);
            } else {
                await meetingController?.getVideoController()?.muteLocalVideoStream();
            }
        } catch (e) {
            enqueueSnackbar('Toggle mute video failed', {
                variant: 'error',
            });
        }
    };

    const acceptUnMuteVideoDemand = async () => {
        try {
            await meetingController?.getVideoController()?.unmuteLocalVideoStream();
            setIsShowVideoUnmuteDemandPop(false);
        } catch (e) {
            enqueueSnackbar('Unmute video failed', {
                variant: 'error',
            });
        }
    };

    return (
        <div>
            <div className='action-button' onClick={toggleMuteVideo} ref={actionButtonRef}>
                {meetingState.isVideoMuted ? <VideocamOff /> : <Videocam />}
                <div
                    className={`action-button-more ${isShowVideoDeviceList ? 'checked' : ''}`}
                    onClick={e => {
                        e.stopPropagation();
                        setIsShowVideoDeviceList(!isShowVideoDeviceList);
                    }}>
                    <KeyboardArrowUp sx={{ fontSize: '14px' }}></KeyboardArrowUp>
                </div>
            </div>
            <Popover
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
                                        <Check sx={{ color: '#039fd8', fontSize: '16px' }} />
                                    </div>
                                ) : null}
                                {item.label}
                            </div>
                        );
                    })}
                </div>
            </Popover>
            <Popover
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
                        <Button
                            size='small'
                            variant='outlined'
                            style={{ width: '100px' }}
                            onClick={() => setIsShowVideoUnmuteDemandPop(false)}>
                            Refuse
                        </Button>
                        <Button
                            variant='contained'
                            size='small'
                            style={{ width: '100px', marginLeft: '10px' }}
                            onClick={acceptUnMuteVideoDemand}>
                            OK
                        </Button>
                    </div>
                </div>
            </Popover>
        </div>
    );
};

export default VideoAction;
