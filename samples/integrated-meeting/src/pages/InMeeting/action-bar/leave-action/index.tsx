import React, { FC, useRef, useState } from 'react';
import { RcIcon, RcPopover } from '@ringcentral/juno';
import { HandUp } from '@ringcentral/juno-icon';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { useOnClickOutside } from '@src/hooks';

const LeaveAction: FC = () => {
    const actionButtonRef = useRef();

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();

    const [isShowLeaveOption, setIsShowLeaveOption] = useState(false);

    const leaveMeetingHandler = () => {
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
        <div>
            <div className='action-button' onClick={leaveMeetingHandler} ref={actionButtonRef}>
                <RcIcon size='large' symbol={HandUp} color='#ea4335' />
                <p className='action-text'>Leave</p>
            </div>
            <RcPopover
                open={isShowLeaveOption}
                anchorEl={actionButtonRef.current}
                onClose={() => setIsShowLeaveOption(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}>
                <div className='meeting-popover center-bottom'>
                    <div className='meeting-popover-operation-item' onClick={leaveMeeting}>
                        Leave meeting
                    </div>
                    <div className='meeting-popover-operation-item' onClick={endMeeting}>
                        End meeting for everyone
                    </div>
                </div>
            </RcPopover>
        </div>
    );
};

export default LeaveAction;
