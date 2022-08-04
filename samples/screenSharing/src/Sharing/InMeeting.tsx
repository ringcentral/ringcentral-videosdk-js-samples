import React, { useState, useEffect, useRef } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap';
import { SharingEvent, SharingState, StreamEvent } from '@sdk';

enum StreamType {
    VIDEO_MAIN = 'video/main',
    VIDEO_SCREENSHARING = 'video/screensharing',
}

const InMeeting = ({ meetingController }) => {
    const [sharingStarted, setSharingStarted] = useState(false);
    const screenSharingRef = useRef<HTMLVideoElement>({} as HTMLVideoElement);

    useEffect(() => {
        if (meetingController) {
            const sharingController = meetingController.getSharingController();

            sharingController.on(
                SharingEvent.SHARING_STATE_CHANGED,
                (sharingState: SharingState) => {
                    if (sharingState === SharingState.SELF_SHARING_BEGIN) {
                        setSharingStarted(true);
                    } else if (sharingState === SharingState.SELF_SHARING_END) {
                        setSharingStarted(false);
                    }
                }
            );

            const streamManager = meetingController?.getStreamManager();
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, stream => {
                if (stream.type === StreamType.VIDEO_SCREENSHARING) {
                    screenSharingRef.current.srcObject = stream.stream;
                }
            });
            streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
                if (stream.type === StreamType.VIDEO_SCREENSHARING) {
                    screenSharingRef.current.srcObject = null;
                }
            });
        }

    }, [meetingController])

    const toggleSharing = () => {
        const sharingController = meetingController.getSharingController();
        if (sharingStarted) {
            sharingController?.stopSharing();
        } else {
            sharingController?.startSharing();
        }
    };

    const handleEndMeeting = () => {
        meetingController.endMeeting().catch((e) => {
            alert(`Error occurs due to :${e.message}`)
        });
    }

    return (
        <>
            <video className='sharing-video' ref={screenSharingRef} />
            <ButtonGroup>
                <Button variant="primary" onClick={toggleSharing}>
                    {sharingStarted ? 'Stop sharing' : 'Start sharing'}
                </Button>
                <Button variant="danger" onClick={handleEndMeeting}>End Meeting</Button>
            </ButtonGroup>
        </>
    )
}

export default InMeeting