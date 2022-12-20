import React, { FC, useRef, useState } from 'react';
import { RcIcon } from '@ringcentral/juno';
import { HandUp } from '@ringcentral/juno-icon';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { useOnClickOutside } from '@src/hooks';

const LeaveAction: FC = () => {
    const ref = useRef();
    useOnClickOutside(ref, () => setIsShowLeaveOption(false));

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();

    const [isShowLeaveOption, setIsShowLeaveOption] = useState(false);

    const leaveMeetingHandler = () => {
        console.log(meetingState);
        if (
            meetingState.localParticipant &&
            meetingState.localParticipant.isModerator &&
            meetingState.participantList.length > 1
        ) {
            setIsShowLeaveOption(true);
        } else {
            leaveMeeting();
        }
    };

    const leaveMeeting = async () => {
        try {
            await meetingController.leaveMeeting();
        } catch (e) {
            console.log(e);
        }
    };

    const endMeeting = async () => {
        try {
            await meetingController.endMeeting();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className='action-button-wrapper' ref={ref}>
            <div className='action-button' onClick={leaveMeetingHandler}>
                <RcIcon size='large' symbol={HandUp} color='#ea4335' />
                <p className='action-text'>Leave</p>
            </div>
            {isShowLeaveOption ? (
                <div className='action-bar-popover'>
                    <ul>
                        <li className='action-bar-popover-menu-item' onClick={leaveMeeting}>
                            Leave meeting
                        </li>
                        <li className='action-bar-popover-menu-item' onClick={endMeeting}>
                            End meeting for everyone
                        </li>
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

export default LeaveAction;
