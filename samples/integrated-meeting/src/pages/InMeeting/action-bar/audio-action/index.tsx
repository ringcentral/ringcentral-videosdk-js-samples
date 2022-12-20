import React, { FC, useEffect, useRef, useState } from 'react';
import { RcIcon } from '@ringcentral/juno';
import { MicOff, Mic, ArrowUp2, Check } from '@ringcentral/juno-icon';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { useOnClickOutside } from '@src/hooks';

interface IAudioAction {}
const AudioAction: FC<IAudioAction> = () => {
    const ref = useRef();
    useOnClickOutside(ref, () => setIsShowAudioDeviceList(false));

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();
    const [audioDeviceList, setAudioDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [audioActiveDevice, setAudioActiveDevice] = useState('');

    const [isShowAudioDeviceList, setIsShowAudioDeviceList] = useState(false);

    useEffect(() => {
        if (rcvEngine) {
            getAudioDeviceList();
        }
    }, [rcvEngine]);

    const getAudioDeviceList = () => {
        rcvEngine
            .getAudioDeviceManager()
            .enumerateRecordingDevices()
            .then(devices => {
                console.log(devices);
                setAudioDeviceList(devices || []);
                if (devices.length) {
                    const audioController = meetingController.getAudioController();
                    const deviceId = devices[0].deviceId;
                    audioController.enableAudio({ deviceId });
                    setAudioActiveDevice(deviceId);
                }
            });
    };

    const handleChangeAudioDevice = (deviceId: string) => {
        if (audioActiveDevice === deviceId) {
            return;
        }
        meetingController
            .getAudioController()
            .enableAudio({ deviceId })
            .then(() => {
                setAudioActiveDevice(deviceId);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const toggleMuteAudio = () => {
        if (meetingState.isAudioMuted) {
            meetingController?.getAudioController()?.unmuteLocalAudioStream();
        } else {
            meetingController?.getAudioController()?.muteLocalAudioStream();
        }
    };
    return (
        <div className='audio-action'>
            <div className='action-button' onClick={toggleMuteAudio}>
                <RcIcon size='large' symbol={meetingState.isAudioMuted ? MicOff : Mic} />
                <p className='action-text'>{meetingState.isAudioMuted ? 'Unmute' : 'Mute'}</p>
                <div
                    className={`action-button-more ${isShowAudioDeviceList ? 'checked' : ''}`}
                    onClick={e => {
                        e.stopPropagation();
                        setIsShowAudioDeviceList(!isShowAudioDeviceList);
                    }}>
                    <RcIcon size='small' symbol={ArrowUp2} />
                </div>
                {isShowAudioDeviceList ? (
                    <div className='action-bar-pop-menu' ref={ref}>
                        <ul>
                            {audioDeviceList.map(item => {
                                return (
                                    <li
                                        key={item.deviceId}
                                        className='action-bar-pop-menu-item'
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleChangeAudioDevice(item.deviceId);
                                        }}>
                                        {audioActiveDevice === item.deviceId ? (
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
        </div>
    );
};

export default AudioAction;
