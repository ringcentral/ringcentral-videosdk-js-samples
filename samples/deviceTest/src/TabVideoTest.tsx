import React, { FC, useMemo, useRef, useState, useEffect } from 'react'
import { RcvEngine } from '@sdk'
import { Button, Select, MenuItem, FormControl } from '@mui/material';
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
            <div style={{ marginTop: 20 }}>
                <FormControl size="small" variant="standard">
                    <Select label="Set Video Device" value={activeDevice} fullWidth style={{ width: 200 }}
                        onChange={handleVideoDeviceChange}>
                        {deviceList.map((item) => <MenuItem key={item.deviceId} value={item.deviceId}> {item.label}</MenuItem>)}
                    </Select>
                </FormControl>
                <h5>Video device test</h5>
                <Button onClick={handleVideoTestStart} variant="outlined" disabled={isTesting}>Start Video Test</Button>
                <Button onClick={handleVideoTestStop} variant="outlined" color='error'>Stop Video Test</Button>
            </div>
            <video ref={videoRef} width={400} height={320} muted controls />
            <p> Video test status: {isTesting ? 'is tesing...' : 'stopped'}</p>
        </div>
    )
}

export default TabVideoTest