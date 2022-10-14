import React, { FC, useMemo, useRef, useState, useEffect } from 'react'
import { RcvEngine } from '@sdk'
import { RcButton, RcSelect, RcMenuItem } from '@ringcentral/juno';
interface IProps {
    rcvEngine: RcvEngine
}

const TabVideoTest: FC<IProps> = ({ rcvEngine }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [activeDevice, setActiveDevice] = useState('');

    const videoDeviceManager = useMemo(
        () => rcvEngine?.getVideoDeviceManager(),
        [rcvEngine, rcvEngine?.getVideoDeviceManager()]
    );

    useEffect(() => {
        videoDeviceManager.enumerateVideoDevices().then(deviceList => {
            if (!deviceList.length) {
                return;
            }
            setDeviceList(deviceList);
            setActiveDevice(deviceList[0].deviceId);
        });
    }, []);

    const handleVideoDeviceChange = e => {
        setActiveDevice(e.target.value);
        videoDeviceManager.setVideoDevice(e.target.value);
    };

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
            <RcSelect label="Set Video Device" value={activeDevice} style={{ width: 200 }}
                onChange={handleVideoDeviceChange}>
                {deviceList.map((item) => <RcMenuItem key={item.deviceId} value={item.deviceId}> {item.label}</RcMenuItem>)}
            </RcSelect>
            <div style={{ marginTop: 20 }}>
                <h5>Video device test</h5>
                <RcButton onClick={handleVideoTestStart} color="success.b03" disabled={isTesting}>Start Video Test</RcButton>
                <RcButton onClick={handleVideoTestStop} color="danger.b03">Stop Video Test</RcButton>
            </div>
            <video ref={videoRef} width={400} height={320} muted controls />
            <p> Video test status: {isTesting ? 'is tesing...' : 'stopped'}</p>
        </div>
    )
}

export default TabVideoTest