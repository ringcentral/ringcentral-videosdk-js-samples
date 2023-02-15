import React, { useEffect, useState, useRef } from 'react';
import { SmartDisplay, Pause } from '@mui/icons-material';
import { RecordingEvent, RecordingStatus } from '@sdk';
import { useGlobalContext } from '@src/store/global';

import './index.less';

const RecordAction = () => {
    const [recordingState, setRecordingState] = useState<RecordingStatus>(
        RecordingStatus.UNACTIVATED
    );
    const [isRecordingAllowed, setRecordingAllowed] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const { rcvEngine } = useGlobalContext();
    const timerRef = useRef<NodeJS.Timer>();

    useEffect(() => {
        if (rcvEngine) {
            const recordingController = rcvEngine.getMeetingController().getRecordingController();
            // update state
            setRecordingState(recordingController.getRecordingState());
            setRecordingAllowed(recordingController.isRecordingAllowed());
            setRecordingDuration(recordingController.getRecordingDuration());
            // add listener
            recordingController.on(RecordingEvent.RECORDING_STATE_CHANGED, state => {
                setRecordingState(state);
                if (state === RecordingStatus.RUNNING) {
                    startTimer();
                }
                else {
                    stopTimer();
                }
            });
            recordingController.on(RecordingEvent.RECORDING_ALLOWED_CHANGED, isAllow => {
                setRecordingAllowed(isAllow);
            });
        }
    }, [rcvEngine]);

    const toggleRecording = async () => {
        if (!isRecordingAllowed) {
            return;
        }
        const recordingController = rcvEngine?.getMeetingController().getRecordingController();
        if (recordingState !== RecordingStatus.RUNNING) {
            await recordingController?.startRecording();
        }
        else {
            await recordingController?.pauseRecording();
        }
    };

    const startTimer = () => {
        timerRef.current && clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setRecordingDuration(seconds => seconds + 1);
        }, 1000);
    };

    const stopTimer = () => {
        timerRef.current && clearInterval(timerRef.current);
    };

    return (
        <>
            <div className={`action-button ${isRecordingAllowed ? '' : 'disable'}`} onClick={toggleRecording}>
                {recordingState === RecordingStatus.RUNNING ? <Pause className='action-button-icon' /> : <SmartDisplay className='action-button-icon' />}
            </div>
            {recordingState === RecordingStatus.RUNNING &&
                <div className='record-mark'>
                    <span className='record-mark-label'>REC</span>
                    <span>{formatTime(recordingDuration)}</span>
                </div>}
        </>
    );
};

const formatTime = (duration: number) => {
    let hh = 0;
    let mm = 0;
    let ss = ~~duration;
    if (ss > 3599) {
        hh = Math.floor(ss / 3600);
        mm = Math.floor(ss % 3600 / 60);
        ss = ss % 60;
        return (hh > 9 ? hh : '0' + hh) + ':' + (mm > 9 ? mm : '0' + mm) + ':' + (ss > 9 ? ss : '0' + ss);
    } else if (ss > 59) {
        mm = Math.floor(ss / 60);
        ss = ss % 60;
        return '00:' + (mm > 9 ? mm : '0' + mm) + ':' + (ss > 9 ? ss : '0' + ss);
    } else {
        return '00:00:' + (ss > 9 ? ss : '0' + ss);
    }
};

export default RecordAction;