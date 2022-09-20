import React, { useState, useEffect, useRef } from 'react'
import { RcButtonGroup, RcButton } from '@ringcentral/juno';
import { SharingEvent, SharingState, StreamEvent, StreamType } from '@sdk';
import { useGlobalContext } from '../context';

const InMeeting = ({ meetingController }) => {
    const { isMeetingJoined } = useGlobalContext();
    const [sharingStarted, setSharingStarted] = useState(false);
    const screenSharingRef = useRef<HTMLVideoElement>({} as HTMLVideoElement);

    useEffect(() => {
        if (isMeetingJoined) {
            const sharingController = meetingController.getSharingController();

            // listen for sharing state change event
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

            // listen for streams change event
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
    }, [isMeetingJoined])

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
            <video className='sharing-video' autoPlay={true} muted={true} ref={screenSharingRef} />
            <RcButtonGroup>
                <RcButton onClick={toggleSharing}>
                    {sharingStarted ? 'Stop sharing' : 'Start sharing'}
                </RcButton>
                <RcButton color="danger.b03" onClick={handleEndMeeting}>End Meeting</RcButton>
            </RcButtonGroup>
        </>
    )
}

export default InMeeting