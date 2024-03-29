import React, { FC, useEffect, useState, useRef } from 'react'
import { RcvEngine, AudioEvent, VideoEvent, IParticipant, UserEvent, StreamEvent } from '@ringcentral/video-sdk';
import { useParams } from 'react-router-dom';
import { ButtonGroup, Button, Alert, Select, MenuItem, Grid } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, BlurOn, BlurOff } from '@mui/icons-material';
import AttendeeVideoList from './AttendeeVideoList';
import ParticipantTable from './ParticipantTable';
import { useGlobalContext } from '../../context';
import { sinkStreamElement, unSinkStreamElement, TrackType } from '../../utils/dom'
interface IProps {
    rcvEngine: RcvEngine
}

const InMeeting: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const { meetingId } = useParams();
    const { isMeetingJoined } = useGlobalContext();

    const [loading, setLoading] = useState(false);
    const [audioDeviceList, setAudioDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [videoDeviceList, setVideoDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [audioActiveDevice, setAudioActiveDevice] = useState('');
    const [videoActiveDevice, setVideoActiveDevice] = useState('');
    const [audioMuted, setAudioMuted] = useState(true);
    const [videoMute, setVideoMute] = useState(true);
    const [videoVbg, setVideoVbg] = useState(false);
    const [participantList, setParticipantList] = useState<IParticipant[]>([]);
    const audioRef = useRef({} as HTMLDivElement);

    const meetingController = rcvEngine?.getMeetingController();

    useEffect(() => {

        const initController = async () => {
            // when do refreshing
            if (!isMeetingJoined) {
                setLoading(true);
                await rcvEngine.joinMeeting(meetingId);
                setLoading(false)
            }
            initDeviceList();
            initListener()
        }
        rcvEngine && initController();
    }, [meetingId, rcvEngine])

    const initDeviceList = () => {
        rcvEngine.
            getAudioDeviceManager()
            .enumerateRecordingDevices().then((devices) => {
                setAudioDeviceList(devices || []);
                if (devices.length) {
                    const audioController = meetingController.getAudioController();
                    const deviceId = devices[0].deviceId;
                    audioController.enableAudio({ deviceId });
                    setAudioActiveDevice(deviceId)
                    console.log('change audio device:', deviceId)
                }
            });
        rcvEngine
            .getVideoDeviceManager()
            .enumerateVideoDevices()
            .then(devices => {
                setVideoDeviceList(devices || []);
                devices.length && setVideoActiveDevice(devices[0].deviceId)
            });
    }

    const initListener = () => {
        const audioController = meetingController?.getAudioController()
        const videoController = meetingController?.getVideoController()

        // listen for audio unmute/mute events
        const audioLocalMuteListener = audioController?.on(
            AudioEvent.LOCAL_AUDIO_MUTE_CHANGED,
            (mute) => {
                setAudioMuted(mute);
                updateParticipants();
            }
        );
        const audioRemoteMuteListener = audioController?.on(
            AudioEvent.REMOTE_AUDIO_MUTE_CHANGED,
            (uid: string, mute: boolean) => {
                updateParticipants();
            }
        );
        // listen for video unmute/mute events
        const videoLocalMuteListener = videoController?.on(
            VideoEvent.LOCAL_VIDEO_MUTE_CHANGED,
            (mute) => {
                setVideoMute(mute);
                updateParticipants();
            }
        );
        const videoRemoteMuteListener = videoController?.on(
            VideoEvent.REMOTE_VIDEO_MUTE_CHANGED,
            (uid: string, mute: boolean) => {
                updateParticipants();
            }
        );
        const userController = meetingController?.getUserController()
        const userJoinedListener = userController.on(UserEvent.USER_JOINED, () => {
            updateParticipants();
        });
        const userLeftListener = userController.on(UserEvent.USER_LEFT, () => {
            updateParticipants();
        });
        const userUpdateListener = userController.on(UserEvent.USER_UPDATED, () => {
            updateParticipants();
        });
        const userSpeakChangedListener = userController.on(UserEvent.ACTIVE_SPEAKER_USER_CHANGED, (participant: IParticipant) => {
            console.log(UserEvent.ACTIVE_VIDEO_USER_CHANGED, participant);
            updateParticipants();
        });

        // audio
        const streamManager = meetingController?.getStreamManager();
        streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_REMOVED, stream => {
            unSinkStreamElement(stream, audioRef.current);
        });
        streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_ADDED, stream => {
            sinkStreamElement(stream, TrackType.AUDIO, audioRef.current);
        });

        return () => {
            audioLocalMuteListener?.();
            audioRemoteMuteListener?.();
            videoLocalMuteListener?.();
            videoRemoteMuteListener?.();
            userJoinedListener?.();
            userLeftListener?.();
            userUpdateListener?.();
            userSpeakChangedListener();
        };
    }

    const updateParticipants = () => {
        const users = meetingController.getUserController()?.getMeetingUsers();
        const localParticipant = Object.values(users).filter(participant => participant.isMe);
        const activeRemoteParticipants = Object.values(users).filter(
            participant => !participant.isDeleted && !participant.isMe
        );
        setParticipantList([...localParticipant, ...activeRemoteParticipants]);
    }

    // ---------------------------- start: button click handler ----------------------------
    const toggleMuteAudio = () => {
        if (audioMuted) {
            meetingController?.getAudioController()?.unmuteLocalAudioStream()
                .catch((e) => {
                    alert(`Error occurs due to :${e.message}`)
                });
        }
        else {
            meetingController?.getAudioController()?.muteLocalAudioStream()
                .catch((e) => {
                    alert(`Error occurs due to :${e.message}`)
                });
        }
    }

    const toggleMuteVideo = () => {
        if (videoMute) {
            const constraints = videoActiveDevice ? {
                deviceId: videoActiveDevice
            } : undefined;
            meetingController?.getVideoController()?.unmuteLocalVideoStream(constraints)
                .catch((e) => {
                    alert(`Error occurs due to :${e.message}`)
                });
        }
        else {
            meetingController?.getVideoController()?.muteLocalVideoStream()
                .catch((e) => {
                    alert(`Error occurs due to :${e.message}`)
                });
        }
    }

    const toggleVbg = (enable) => {
        if (enable) {
            meetingController?.getVideoController()?.switchVirtualBackground('blur', 100);
            setVideoVbg(true);
        }
        else {
            meetingController?.getVideoController()?.disableVirtualBackground();
            setVideoVbg(false);
        }
    }

    const handleLeaveMeeting = () =>
        meetingController?.leaveMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });


    const handleEndMeeting = () => {
        meetingController?.endMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });
    }

    const handleChangeAudioRecordingDevice = async (e) => {
        const deviceId = e.target.value;
        setVideoActiveDevice(deviceId);
        console.log('change audio device:', deviceId)
        await rcvEngine.getAudioDeviceManager().setRecordingDevice(deviceId);
        await meetingController.getAudioController().enableAudio({ deviceId });
    };

    const handleChangVideoMedia = async (e) => {
        const deviceId = e.target.value;
        setVideoActiveDevice(deviceId);
        await rcvEngine?.getVideoDeviceManager().setVideoDevice(deviceId);
        !videoMute && meetingController
            .getVideoController()
            .unmuteLocalVideoStream({ advanced: [{ deviceId }] });
    };

    // ---------------------------- end: button click handler ----------------------------

    return (
        <>
            <Alert severity="info"> {loading ? 'loading...' : 'Meeting Id:' + meetingId}</Alert>
            <div className='meeting-wrapper'>
                <AttendeeVideoList meetingController={meetingController} participantList={participantList} />
                <ButtonGroup>
                    <Button
                        variant="outlined"
                        onClick={toggleMuteAudio}
                        startIcon={audioMuted ? <MicOff /> : <Mic />}>
                        Audio
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={toggleMuteVideo}
                        startIcon={videoMute ? <VideocamOff /> : <Videocam />}>
                        Video
                    </Button>
                    {!videoMute && <Button
                        variant="outlined"
                        onClick={() => toggleVbg(!videoVbg)}
                        startIcon={videoVbg ? <BlurOn /> : <BlurOff />}>
                        {videoVbg ? 'Disable VBG' : 'Enable VBG'}
                    </Button>}
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleLeaveMeeting}>
                        Leave
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleEndMeeting}>
                        End
                    </Button>
                </ButtonGroup>
                <br />
                <Grid container>
                    <Grid item xs={6}>
                        <Select label="select Microphone" value={audioActiveDevice} style={{ width: 400 }}
                            onChange={handleChangeAudioRecordingDevice}>
                            {audioDeviceList.map((device) => <MenuItem key={device.deviceId} value={device.deviceId}>{device.label}</MenuItem>)}
                        </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <Select label="select Camera" value={videoActiveDevice} style={{ width: 400 }}
                            onChange={handleChangVideoMedia}>
                            {videoDeviceList.map((device) => <MenuItem key={device.deviceId} value={device.deviceId}>{device.label}</MenuItem>)}
                        </Select>
                    </Grid>
                </Grid>
                <br />
                <ParticipantTable
                    participantList={participantList} />
                <div ref={audioRef} />
            </div>
        </>
    )
}

export default InMeeting