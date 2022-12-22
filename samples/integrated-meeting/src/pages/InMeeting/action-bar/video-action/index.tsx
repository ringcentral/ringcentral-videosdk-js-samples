import React, { FC, useEffect, useRef, useState } from 'react';
import { RcIcon, RcPopover } from '@ringcentral/juno';
import { Videocam, VideocamOff, ArrowUp2, Check } from '@ringcentral/juno-icon';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';

interface IVideoAction {}
const VideoAction: FC<IVideoAction> = () => {
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
        }
    }, [rcvEngine]);

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
        </div>
    );
};

export default VideoAction;
