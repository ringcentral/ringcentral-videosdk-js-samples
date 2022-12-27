import React, { FC, useRef, useState } from 'react';
import { Popover } from '@mui/material';
import { CallEnd } from '@mui/icons-material';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { useSnackbar } from 'notistack';

const LeaveAction: FC = () => {
    const { enqueueSnackbar } = useSnackbar();

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
            enqueueSnackbar('Leave meeting failed', {
                variant: 'error',
            });
        }
    };

    const endMeeting = async () => {
        try {
            await meetingController.endMeeting();
        } catch (e) {
            enqueueSnackbar('End meeting failed', {
                variant: 'error',
            });
        }
    };

    return (
        <div>
            <div className='action-button' onClick={leaveMeetingHandler} ref={actionButtonRef}>
                <CallEnd sx={{ color: '#ea4335' }}></CallEnd>
            </div>
            <Popover
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
                <div className='meeting-popover pad-t-10 pad-b-10 center-bottom'>
                    <div className='meeting-popover-operation-item' onClick={leaveMeeting}>
                        Leave meeting
                    </div>
                    <div className='meeting-popover-operation-item' onClick={endMeeting}>
                        End meeting for everyone
                    </div>
                </div>
            </Popover>
        </div>
    );
};

export default LeaveAction;
