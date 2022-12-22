import React, { FC, useEffect, useRef, useState } from 'react';
import { RcButton, RcIcon, RcPopover } from '@ringcentral/juno';
import { MicOff, Mic, ArrowUp2, Check } from '@ringcentral/juno-icon';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { AudioEvent } from '@sdk';

const AudioAction: FC = () => {
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
            initListener();
        }
    }, [rcvEngine]);

    const [isShowAudioUnmuteDemandPop, setIsShowAudioUnmuteDemandPop] = useState(false);

    const initListener = () => {
        const audioController = meetingController?.getAudioController();

        const audioMuteDemandListener = audioController?.on(AudioEvent.AUDIO_UNMUTE_DEMAND, () => {
            setIsShowAudioUnmuteDemandPop(true);
        });
        return () => {
            audioMuteDemandListener();
        };
    };

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

    const acceptUnMuteAudioDemand = () => {
        meetingController?.getAudioController()?.unmuteLocalAudioStream();
        setIsShowAudioUnmuteDemandPop(false);
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
                <div className='meeting-popover pad-t-10 pad-b-10 center-bottom'>
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
            <RcPopover
                open={Boolean(actionButtonRef.current) && isShowAudioUnmuteDemandPop}
                anchorEl={actionButtonRef.current}
                onClose={() => setIsShowAudioUnmuteDemandPop(false)}
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
                            onClick={() => setIsShowAudioUnmuteDemandPop(false)}>
                            Don't Allow
                        </RcButton>
                        <RcButton
                            radius='round'
                            keepElevation
                            color='#066fac'
                            size='small'
                            style={{ width: '100px', marginLeft: '10px' }}
                            onClick={acceptUnMuteAudioDemand}>
                            OK
                        </RcButton>
                    </div>
                </div>
            </RcPopover>
        </div>
    );
};

export default AudioAction;
