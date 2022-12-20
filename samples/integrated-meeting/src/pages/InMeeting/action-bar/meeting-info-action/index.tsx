import React, { FC, useEffect, useRef, useState } from 'react';
import { RcIcon } from '@ringcentral/juno';
import { InfoBorder, Info } from '@ringcentral/juno-icon';
import { MeetingReduceType, useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { useOnClickOutside } from '@src/hooks';
import './index.less';

const MeetingInfoAction: FC = () => {
    const ref = useRef();
    useOnClickOutside(ref, () => setIsShowMeetingInfo(false));

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState, dispatch } = useMeetingContext();

    const [isShowMeetingInfo, setIsShowMeetingInfo] = useState(false);

    const getMeetingInfo = async () => {
        try {
            let meetingInfo = await meetingController.getMeetingInfo();
            dispatch({
                type: MeetingReduceType.MEETING_INFO,
                payload: { meetingInfo },
            });

            console.log(meetingInfo);
        } catch (e) {
            console.log(e);
        }
    };

    const toggleMeetingInfo = async e => {
        e.stopPropagation();
        if (!isShowMeetingInfo) {
            if (!meetingState.meetingInfo) {
                await getMeetingInfo();
            }
            setIsShowMeetingInfo(true);
        } else {
            setIsShowMeetingInfo(false);
        }
    };

    return (
        <div className='left-action-button-wrapper' ref={ref}>
            <div className='left-action-button' onClick={toggleMeetingInfo}>
                <RcIcon size='large' symbol={isShowMeetingInfo ? Info : InfoBorder} />
            </div>
            {isShowMeetingInfo ? (
                <div
                    className='action-bar-popover left'
                    style={{ left: 0, transform: 'translateX(0)' }}>
                    <div className='meeting-info'>
                        <h1 className='meeting-info-title'>Meeting details</h1>
                        <div className='meeting-info-item'>
                            <label>Meeting Name</label>
                            <p>{meetingState.meetingInfo?.meetingName}</p>
                        </div>
                        <div className='meeting-info-item'>
                            <label>Host</label>
                            <p>{meetingState.meetingInfo?.hostName}</p>
                        </div>
                        <div className='meeting-info-item'>
                            <label>Meeting Id</label>
                            <p>{meetingState.meetingInfo?.meetingId}</p>
                        </div>
                        <div className='meeting-info-item'>
                            <label>Meeting Link</label>
                            <p>{meetingState.meetingInfo?.meetingLink}</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default MeetingInfoAction;
