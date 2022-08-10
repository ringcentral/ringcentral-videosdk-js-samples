import React, { FC, useMemo, useRef, useState } from 'react'
import { RcvEngine } from '@sdk'
import { Button } from 'react-bootstrap';
interface IProps {
    rcvEngine: RcvEngine
}

const TabVideoTest: FC<IProps> = ({ rcvEngine }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isTesting, setIsTesting] = useState<boolean>(false);

    const videoDeviceManager = useMemo(
        () => rcvEngine?.getVideoDeviceManager(),
        [rcvEngine, rcvEngine?.getVideoDeviceManager()]
    );

    const handleVideoTestStart = () => {
        setIsTesting(true);
        videoDeviceManager.startVideoDeviceTest().then(stream => {
            videoRef.current!.srcObject = stream;
            videoRef.current!.play();
        });
    }

    const handleVideoTestStop = () => {
        setIsTesting(false);
        videoDeviceManager.stopVideoDeviceTest();
    }

    return (
        <div className='card-wrapper'>
            <h5>Video Test</h5>
            <div>
                <Button onClick={handleVideoTestStart} variant="success" disabled={isTesting}>Start Video Test</Button>
                <Button onClick={handleVideoTestStop} variant="danger">Stop Video Test</Button>
            </div>
            <video ref={videoRef} width={400} height={320} muted controls />
            <p> Video test status: {isTesting ? 'is tesing...' : 'stopped'}</p>
        </div>
    )
}

export default TabVideoTest