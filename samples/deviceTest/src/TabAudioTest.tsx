import React, { FC, useMemo, useRef, useState } from 'react'
import { RcvEngine } from '@ringcentral/video-sdk'
import { Button } from '@mui/material';
interface IProps {
    rcvEngine: RcvEngine
}

const AUDIO_TEST_URL = 'https://v.ringcentral.com/static/d8af4fc3b43dca9559ee7517031cc4acv1.ogg';

const TabAudioTest: FC<IProps> = ({ rcvEngine }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const audioDeviceManager = useMemo(
        () => rcvEngine?.getAudioDeviceManager(),
        [rcvEngine, rcvEngine?.getAudioDeviceManager()]
    );

    const handlePlaybackStart = () => {
        audioDeviceManager?.startPlaybackDeviceTest(AUDIO_TEST_URL);
    };

    const handlePlaybackkStop = () => {
        audioDeviceManager?.stopPlaybackDeviceTest();
    };

    const handleRecordStart = async () => {
        setIsRecording(true);
        let chunks: Blob[] = [];
        const stream = await audioDeviceManager.startRecordingDeviceTest();
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            chunks.push(e.data);
        };
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
            chunks = [];
            if (audioRef && audioRef.current) {
                audioRef.current.src = URL.createObjectURL(blob);
                audioRef.current.play();
            }
        };
        mediaRecorder.current = recorder;
        mediaRecorder.current.start();
    }

    const handleRecordStop = async () => {
        setIsRecording(false);
        audioDeviceManager.stopRecordingDeviceTest();
        if (mediaRecorder && mediaRecorder.current) {
            mediaRecorder.current.stop();
            mediaRecorder.current = null;
        }
    }

    return (
        <>
            <div className='card-wrapper'>
                <h5>Playback Device Test</h5>
                <Button onClick={handlePlaybackStart} variant="outlined">Start Playback Test</Button>
                <Button onClick={handlePlaybackkStop} variant="outlined" color='error'>Stop Playback Test</Button>
            </div>
            <div className='card-wrapper'>
                <h5>Recording Device Test</h5>
                <div>
                    <Button onClick={handleRecordStart} disabled={isRecording} variant="outlined">Start Recording Test</Button>
                    <Button onClick={handleRecordStop} variant="outlined" color='error'>Stop Recording Test</Button>
                </div>
                <audio ref={audioRef} controls />
                <p> Recording status: {isRecording ? 'is recording...' : 'stopped'}</p>
            </div>
        </>
    )
}

export default TabAudioTest