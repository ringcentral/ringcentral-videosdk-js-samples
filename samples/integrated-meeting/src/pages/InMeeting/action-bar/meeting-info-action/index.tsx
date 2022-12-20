import React, { FC, useEffect, useRef, useState } from 'react';
import { RcIcon } from '@ringcentral/juno';
import { InfoBorder, Info } from '@ringcentral/juno-icon';
import { useMeetingContext } from '@src/store/meeting';
import { useGlobalContext } from '@src/store/global';
import { useOnClickOutside } from '@src/hooks';

const MeetingInfoAction: FC = () => {
    const ref = useRef();
    useOnClickOutside(ref, () => setIsShowMeetingInfo(false));

    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();

    const { state: meetingState } = useMeetingContext();

    const [isShowMeetingInfo, setIsShowMeetingInfo] = useState(false);

    useEffect(() => {
        if (meetingController) {
            getMeetingInfo();
        }
    }, [meetingController]);

    const getMeetingInfo = async () => {
        try {
            let meetingInfo = await meetingController.getMeetingInfo();
            console.log(meetingInfo);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className='meeting-info'>
            <div className='left-action-button'>
                <RcIcon size='large' symbol={isShowMeetingInfo ? Info : InfoBorder} />
            </div>
        </div>
    );
};

export default MeetingInfoAction;
