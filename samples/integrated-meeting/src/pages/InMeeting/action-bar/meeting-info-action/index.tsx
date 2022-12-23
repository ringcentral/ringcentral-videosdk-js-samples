import React, { FC, useRef, useState } from 'react';
import { Popover } from '@mui/material';
import { Info } from '@mui/icons-material';
import { MeetingReduceType, useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import './index.less';

const MeetingInfoAction: FC = () => {
    const actionButtonRef = useRef();

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

    const showMeetingInfo = async e => {
        e.stopPropagation();
        if (!meetingState.meetingInfo) {
            await getMeetingInfo();
        }
        setIsShowMeetingInfo(true);
    };

    return (
        <div>
            <div className='left-action-button' onClick={showMeetingInfo} ref={actionButtonRef}>
                <Info></Info>
            </div>
            <Popover
                open={isShowMeetingInfo}
                anchorEl={actionButtonRef.current}
                onClose={() => setIsShowMeetingInfo(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                <div className='meeting-popover pad-t-10 pad-b-10 left-bottom'>
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
            </Popover>
        </div>
    );
};

export default MeetingInfoAction;
