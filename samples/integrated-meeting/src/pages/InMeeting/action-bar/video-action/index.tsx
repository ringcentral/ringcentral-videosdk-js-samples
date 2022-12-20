import React, { FC, useEffect, useRef, useState } from 'react';
import { RcIcon } from '@ringcentral/juno';
import { Videocam, VideocamOff, ArrowUp2, Check } from '@ringcentral/juno-icon';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { useOnClickOutside } from '@src/hooks';

interface IVideoAction {}
const VideoAction: FC<IVideoAction> = () => {
    const ref = useRef();
    useOnClickOutside(ref, () => setIsShowVideoDeviceList(false));

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();
    const [videoDeviceList, setVideoDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [videoActiveDevice, setVideoActiveDevice] = useState('');

    const [isShowVideoDeviceList, setIsShowVideoDeviceList] = useState(false);

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
        <div className='action-button-wrapper' ref={ref}>
            <div className='action-button' onClick={toggleMuteVideo}>
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
            {isShowVideoDeviceList ? (
                <div className='action-bar-popover'>
                    <ul>
                        {videoDeviceList.map(item => {
                            return (
                                <li
                                    key={item.deviceId}
                                    className='action-bar-popover-menu-item'
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleChangeVideoDevice(item.deviceId);
                                    }}>
                                    {videoActiveDevice === item.deviceId ? (
                                        <div className='checked'>
                                            <RcIcon size='small' symbol={Check} />
                                        </div>
                                    ) : null}
                                    {item.label}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

export default VideoAction;
