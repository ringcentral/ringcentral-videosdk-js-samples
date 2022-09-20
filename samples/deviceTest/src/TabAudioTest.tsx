import React, { FC, useMemo, useRef, useState } from 'react'
import { RcvEngine } from '@sdk'
import { RcButton } from '@ringcentral/juno';
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
                <RcButton onClick={handlePlaybackStart} color="success.b03">Start Playback Test</RcButton>
                <RcButton onClick={handlePlaybackkStop} color="danger.b03">Stop Playback Test</RcButton>
            </div>
            <div className='card-wrapper'>
                <h5>Recording Device Test</h5>
                <div>
                    <RcButton onClick={handleRecordStart} disabled={isRecording} color="success.b03">Start Recording Test</RcButton>
                    <RcButton onClick={handleRecordStop} color="danger.b03">Stop Recording Test</RcButton>
                </div>
                <audio ref={audioRef} controls />
                <p> Recording status: {isRecording ? 'is recording...' : 'stopped'}</p>
            </div>
        </>
    )
}

export default TabAudioTest