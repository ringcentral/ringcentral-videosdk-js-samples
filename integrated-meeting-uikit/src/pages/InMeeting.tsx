import React, { useState } from 'react';
import { useMediaQuery, Alert } from '@mui/material';
import {
    RcvEngineProvider,
    ActionBar,
    AudioAction,
    ChatAction,
    LeaveAction,
    LogoIcon,
    MeetingInfoAction,
    ParticipantAction,
    RecordAction,
    VideoAction,
    Layout,
    LayoutType,
    ScreenSharingAction,
    MoreAction,
    InviteAction,
    ClosedCaptionAction,
    LiveTranscriptionAction
} from '@ringcentral/video-sdk-react';

const InMeeting = ({ rcvEngine }) => {
    const [errorMsg, setErrorMsg] = useState('');
    const isWidthGt850 = useMediaQuery('(min-width:850px)');

    const getMeetingLink = (meetingInfo) => {
        return `http://my.demo.com/${meetingInfo.meetingId}`
    }

    const myInviteAction = <InviteAction
        isShowLabel={true}
        key={'invite-action'}
        renderMeetingLink={getMeetingLink}
        onCopyToClipboardSuccess={(message) => {
            console.log('copy to clipboard success', message);
        }}
    />

    return (
        <div className={'meeting-container'}>
            {errorMsg && <Alert className='demo-alert' severity="error">{errorMsg}</Alert>}
            <RcvEngineProvider rcvEngine={rcvEngine} onError={(e: Error) => {
                setErrorMsg(e.message);
                setTimeout(() => setErrorMsg(''), 5000);
            }}>
                <Layout
                    defaultLayout={LayoutType.gallery}
                    style={{
                        flex: 1,
                    }}
                />
                <ActionBar
                    leftActions={[
                        <MeetingInfoAction
                            key={'meeting-info-action'}
                            renderMeetingLink={getMeetingLink}
                        />]}
                    centerActions={[
                        <AudioAction isShowLabel={true} key={'audio-action'} />,
                        <VideoAction isShowLabel={true} key={'video-action'} />,
                        <ScreenSharingAction isShowLabel={true} key={'screen-sharing-action'} />,
                        isWidthGt850 && myInviteAction,
                        <ParticipantAction isShowLabel={true} key={'participant-action'} />,
                        <ChatAction isShowLabel={true} key={'chat-action'} />,
                        isWidthGt850 && <RecordAction isShowLabel={true} key={'record-action'} />,
                        <MoreAction
                            isShowLabel={true}
                            key={'more-action'}
                            moreActions={[
                                <ClosedCaptionAction isShowLabel={true} key={'closed-captions-action'} />,
                                <LiveTranscriptionAction isShowLabel={true} key={'live-transcription-action'} />,
                                !isWidthGt850 && myInviteAction,
                                !isWidthGt850 && <RecordAction isShowLabel={true} key={'record-action'} />,
                            ]}
                        />,
                        <LeaveAction key={'leave-action'} />,
                    ]}
                    rightActions={[<LogoIcon key={'logo-icon'} text="My Demo" />]}
                />

            </RcvEngineProvider>
        </div>
    )
}

export default InMeeting;