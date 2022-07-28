import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react'
import { EngineEvent, StreamEvent, StreamType, TrackType, IStream } from '@sdk/index';
import './index.less';
import { sinkStreamElement, unSinkStreamElement } from '../utils/streamHandler';
import { Button, Input } from 'antd';
type Props = {
  rcvEngine: any
}

const VideoMeeting = ({ rcvEngine }: Props) => {
  const [meetingController, setMeetingController] = useState(null)
  // const []
  const audioWrapper = useRef<HTMLDivElement>({} as HTMLDivElement);
  const remoteVideoWrapper = useRef<HTMLDivElement>({} as HTMLDivElement);
  const localVideoWrapper = useRef<HTMLDivElement>({} as HTMLDivElement);

  useEffect(() => {
    rcgEventListen();
  }, [rcvEngine])

  useEffect(() => {
    if (meetingController) {
      streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_REMOVED, stream => {
        unSinkStreamElement(stream, audioWrapper.current);
      });
      streamManager?.on(StreamEvent.REMOTE_AUDIO_TRACK_ADDED, (stream: IStream) => {
        sinkStreamElement(stream, TrackType.AUDIO, audioWrapper.current);
      });
      streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_ADDED, stream => {
        if (stream.type === StreamType.VIDEO_SCREENSHARING) {
          // sinkStreamElement(stream, TrackType.VIDEO, screenSharingRef.current);
          return;
        }
        sinkStreamElement(stream, TrackType.VIDEO, remoteVideoWrapper.current);
      });
      streamManager?.on(StreamEvent.REMOTE_VIDEO_TRACK_REMOVED, stream => {
        if (stream.type === StreamType.VIDEO_SCREENSHARING) {
          // unSinkStreamElement(stream, screenSharingRef.current);
          return;
        }
        unSinkStreamElement(stream, remoteVideoWrapper.current);
      });
      streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_ADDED, stream => {
        if (stream.type === StreamType.VIDEO_SCREENSHARING) {
          // sinkStreamElement(stream, TrackType.VIDEO, screenSharingRef.current);
          return;
        }
        sinkStreamElement(stream, TrackType.VIDEO, localVideoWrapper.current);
      });
      streamManager?.on(StreamEvent.LOCAL_VIDEO_TRACK_REMOVED, stream => {
        if (stream.type === StreamType.VIDEO_SCREENSHARING) {
          // unSinkStreamElement(stream, screenSharingRef.current);
          return;
        }
        unSinkStreamElement(stream, localVideoWrapper.current);
      });
      streamManager?.on(StreamEvent.LOCAL_AUDIO_TRACK_ADDED, stream => {
        console.log(stream);
      });
      streamManager?.on(StreamEvent.LOCAL_AUDIO_TRACK_REMOVED, stream => {
        console.log(stream);
      });

      const videoController = meetingController?.getVideoController();
      videoController.muteLocalVideoStream(false)
    }

  }, [meetingController])

  const onMeetingJoined = () => {
    console.log('meeting joined')
  }

  const streamManager = meetingController?.getStreamManager();

  const onMeetingLeft = () => {
    console.log('meeting joined')
  }

  const onMeetingStateChange = () => {
    console.log('meeting changed')
  }

  const audioController = useMemo(
    () => meetingController?.getAudioController(),
    [meetingController]
  );



  const startMeetingHandler = async () => {
    console.log('-----', rcvEngine)

    // rcgEventListen()
    await rcvEngine.startInstantMeeting();
    const meetingController = rcvEngine?.getMeetingController();

    setMeetingController(meetingController)
  }

  const joinMeetingHandler = async () => {
    await rcgEventListen
  }


  const rcgEventListen = () => {
    if (rcvEngine) {
      rcvEngine.on(EngineEvent.MEETING_JOINED, onMeetingJoined);
      rcvEngine.on(EngineEvent.MEETING_LEFT, onMeetingLeft);
      rcvEngine.on(
        EngineEvent.MEETING_STATE_CHANGED,
        onMeetingStateChange
      );
    }
  }


  return (
    <div>
      <div className="upper-btn">
        <Button type="primary" onClick={startMeetingHandler}>start meeting</Button>

        <Button onClick={joinMeetingHandler}>join meeting</Button>
        <Input placeholder='please input meetingId'></Input>
      </div>

      <div ref={localVideoWrapper} className="videoWrapper"></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default VideoMeeting;