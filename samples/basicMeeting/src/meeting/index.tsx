import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { EngineEvent, StreamEvent } from '@sdk';
import { sinkStreamElement, unSinkStreamElement } from '../utils/streamHandler';
import { TrackType } from '../utils/constants'
import StartView from './StartView'

type Props = {
  rcvEngine: any
}

const VideoMeeting = ({ rcvEngine }: Props) => {
  const [meetingController, setMeetingController] = useState(null)
  const remoteVideoWrapper = useRef<HTMLDivElement>({} as HTMLDivElement);
  const localVideoWrapper = useRef<HTMLDivElement>({} as HTMLDivElement);
  const streamManager = meetingController?.getStreamManager();

  useEffect(() => {
    if (rcvEngine) {
      rcvEngine.on(EngineEvent.MEETING_JOINED, onMeetingJoined);
      rcvEngine.on(EngineEvent.MEETING_LEFT, onMeetingLeft);
      rcvEngine.on(
        EngineEvent.MEETING_STATE_CHANGED,
        onMeetingStateChange
      );
    }
  }, [rcvEngine])

  useEffect(() => {
    if (meetingController) {
      streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_ADDED, stream => {
        sinkStreamElement(stream, TrackType.VIDEO, remoteVideoWrapper.current);
      });
      streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_REMOVED, stream => {
        unSinkStreamElement(stream, remoteVideoWrapper.current);
      });
      streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, stream => {
        sinkStreamElement(stream, TrackType.VIDEO, localVideoWrapper.current);
      });
      streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
        unSinkStreamElement(stream, localVideoWrapper.current);
      });
    }

  }, [meetingController])

  const onMeetingJoined = () => {
    console.log('meeting joined')
  }

  const onMeetingLeft = () => {
    console.log('meeting joined')
  }

  const onMeetingStateChange = () => {
    console.log('meeting changed')
  }

  const startMeetingHandler = async () => {
    console.log('-----', rcvEngine)

    // rcgEventListen()
    await rcvEngine.startInstantMeeting();
    const meetingController = rcvEngine?.getMeetingController();
    setMeetingController(meetingController)
  }

  const joinMeetingHandler = async () => {
  }


  return (
    <div>
      {!meetingController && <StartView joinMeetingHandler={joinMeetingHandler} startMeetingHandler={startMeetingHandler} />}
      {meetingController &&
        <div>
          <div
            data-lable='localVideoWrapper'
            ref={localVideoWrapper}
          />
          <div
            data-lable='remoteVideoWrapper'
            ref={remoteVideoWrapper}
          />
          <div>Button bar</div>
        </div>
      }
    </div>
  )
}

export default VideoMeeting;