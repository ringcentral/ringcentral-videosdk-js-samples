import React, { useEffect, useState, useCallback } from 'react';
import { MenuItem, Select, SelectChangeEvent, IconButton } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { ILiveTranscriptionSettings, LiveTranscriptionEvent } from '@ringcentral/video-sdk';
import { useSnackbar } from 'notistack';
import { useGlobalContext } from '@src/store/global';
import TranscriptionList from '../transcript-list'

import './index.less';

const TranscriptionWapper = () => {
    const { rcvEngine } = useGlobalContext();
    const { enqueueSnackbar } = useSnackbar();
    const defaultSetting = rcvEngine?.getMeetingController()?.getLiveTranscriptionController().getLiveTranscriptionSettings();
    const [isTranscriptionStart, setIsTranscriptionStart] = useState(false);
    const [language, setLanguage] = useState<string>(defaultSetting?.meetingLanguage);
    const [settings, setSettings] = useState<ILiveTranscriptionSettings | null>(defaultSetting);
    const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);

    useEffect(() => {
        if (rcvEngine) {
            const liveTranscriptionController = getLiveTranscriptionController()

            const settingChanged = liveTranscriptionController.on(
                LiveTranscriptionEvent.LIVE_TRANSCRIPTION_SETTING_CHANGED,
                handleLiveTranscriptionSettingChanged
            );

            const supportLanguagesChanged = liveTranscriptionController.on(
                LiveTranscriptionEvent.LIVE_TRANSCRIPTION_SUPPORTED_LANGUAGES,
                setSupportedLanguages
            );

            const languagesChanged = liveTranscriptionController.on(
                LiveTranscriptionEvent.LIVE_TRANSCRIPTION_LANGUAGE_CHANGED,
                setLanguage
            );

            return () => {
                settingChanged();
                supportLanguagesChanged();
                languagesChanged();
            }
        }
    }, [rcvEngine]);

    useEffect(() => {
        try {
            if (settings?.transcriptServerConnected) {
                getLiveTranscriptionController()?.getSupportLanguages();
            }
        } catch (error) {
            enqueueSnackbar(`get support languages error: ${error.message}`, {
                variant: 'error',
            });
        }
    }, [settings?.transcriptServerConnected]);


    const handleLiveTranscriptionSettingChanged = (
        liveTranscriptionSettings: ILiveTranscriptionSettings
    ) => {
        console.info('LIVE_TRANSCRIPTION_SETTING_CHANGED', liveTranscriptionSettings);
        setSettings(liveTranscriptionSettings);
        setIsTranscriptionStart(liveTranscriptionSettings.transcriptionActive);
        setLanguage(liveTranscriptionSettings.meetingLanguage);
    };

    const getLiveTranscriptionController = () => {
        return rcvEngine.getMeetingController().getLiveTranscriptionController();
    }

    // --------------------- action handlers ---------------------
    const handleStartLiveTranscription = useCallback(async () => {
        try {
            await getLiveTranscriptionController().startLiveTranscription();
        } catch (error) {
            enqueueSnackbar(`start live transcription error: ${error.message}`, {
                variant: 'error',
            });
        }
    }, []);

    const handlePauseLiveTranscription = useCallback(() => {
        try {
            getLiveTranscriptionController().pauseLiveTranscription();
        } catch (error) {
            enqueueSnackbar(`pause live transcription error: ${error.message}`, {
                variant: 'error',
            });
        }
    }, []);

    const handleSwitchLanguage = (event: SelectChangeEvent) => {
        try {
            getLiveTranscriptionController().switchLanguage(event.target.value);
        } catch (error) {
            enqueueSnackbar(`switch language error: ${error.message}`, {
                variant: 'error',
            });
        }
    };

    return (
        <>
            {settings?.transcriptServerConnected ? (
                <>
                    <div className={"lt-toolbar"}>
                        <div className={"lt-toolbarFlexItem"}>
                            <IconButton
                                style={{ fontSize: '14px' }}
                                color='primary'
                                size='small'
                                onClick={
                                    isTranscriptionStart
                                        ? handlePauseLiveTranscription
                                        : handleStartLiveTranscription
                                }>
                                {isTranscriptionStart ? "Pause" : "Start"}
                                {isTranscriptionStart ? <Pause /> : <PlayArrow />}
                            </IconButton>
                        </div>
                        {supportedLanguages.length ? (
                            <Select
                                size='small'
                                displayEmpty
                                key={language}
                                value={language}
                                onChange={handleSwitchLanguage}>
                                {supportedLanguages.map(language => (
                                    <MenuItem key={language} value={language}>
                                        {language}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : null}
                    </div>
                    <TranscriptionList isConnect={settings?.transcriptServerConnected} />
                </>
            ) : <div className='lt-caption'>Enable transcript<span className={'dotting'}></span></div>
            }
        </>
    );
};

export default TranscriptionWapper;