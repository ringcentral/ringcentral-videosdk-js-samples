import React, { FC, useMemo, useRef, useState } from 'react'
import { RcvEngine } from '@sdk'
import { RcButton } from '@ringcentral/juno';
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
            <h5>Video device test</h5>
            <div>
                <RcButton onClick={handleVideoTestStart} color="success.b03" disabled={isTesting}>Start Video Test</RcButton>
                <RcButton onClick={handleVideoTestStop} color="danger.b03">Stop Video Test</RcButton>
            </div>
            <video ref={videoRef} width={400} height={320} muted controls />
            <p> Video test status: {isTesting ? 'is tesing...' : 'stopped'}</p>
        </div>
    )
}

export default TabVideoTest