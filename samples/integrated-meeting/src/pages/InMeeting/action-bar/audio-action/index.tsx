import React, { FC, useEffect, useRef, useState } from 'react';
import { RcIcon, RcPopover } from '@ringcentral/juno';
import { MicOff, Mic, ArrowUp2, Check } from '@ringcentral/juno-icon';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';

interface IAudioAction {}
const AudioAction: FC<IAudioAction> = () => {
    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();
    const [audioDeviceList, setAudioDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [audioActiveDevice, setAudioActiveDevice] = useState('');

    const [isShowAudioDeviceList, setIsShowAudioDeviceList] = useState(false);

    const actionButtonRef = useRef();

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
        <div>
            <div className='action-button' onClick={toggleMuteAudio} ref={actionButtonRef}>
                <RcIcon size='large' symbol={meetingState.isAudioMuted ? MicOff : Mic} />
                <p className='action-text'>{meetingState.isAudioMuted ? 'Unmute' : 'Mute'}</p>
                <div
                    className={`action-button-more ${isShowAudioDeviceList ? 'checked' : ''}`}
                    onClick={e => {
                        e.stopPropagation();
                        setIsShowAudioDeviceList(true);
                    }}>
                    <RcIcon size='small' symbol={ArrowUp2} />
                </div>
            </div>
            <RcPopover
                open={isShowAudioDeviceList}
                anchorEl={actionButtonRef.current}
                onClose={() => setIsShowAudioDeviceList(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}>
                <div className='meeting-popover center-bottom'>
                    {audioDeviceList.map(item => {
                        return (
                            <div
                                key={item.deviceId}
                                className='meeting-popover-operation-item'
                                onClick={e => {
                                    e.stopPropagation();
                                    handleChangeAudioDevice(item.deviceId);
                                }}>
                                {audioActiveDevice === item.deviceId ? (
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

export default AudioAction;
