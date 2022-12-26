import React, { FC, useEffect, useState } from 'react';

import {
    ClosedCaption as ClosedCaptionIcon,
    ClosedCaptionDisabled as ClosedCaptionDisabledIcon,
} from '@mui/icons-material';
import { useGlobalContext } from '@src/store/global';
import { ClosedCaptionsData, ClosedCaptionsEvent, ClosedCaptionsState } from '@sdk';
import { useSnackbar } from 'notistack';
import ClosedCaptionsContent from './closed-captions-content';

const ClosedCaption: FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    const { rcvEngine } = useGlobalContext();
    const [isClosedCaptionsStarted, setIsClosedCaptionsStarted] = useState(false);

    const [closedCaptionsData, setClosedCaptionsData] = useState<ClosedCaptionsData[]>([]);

    const meetingController = rcvEngine?.getMeetingController();
    const closedCaptionsController = meetingController.getClosedCaptionsController();

    const toggleClosedCaptions = async () => {
        if (isClosedCaptionsStarted) {
            try {
                await closedCaptionsController?.stopClosedCaptions();
                enqueueSnackbar('stop closed captions success', { variant: 'success' });
            } catch (error) {
                enqueueSnackbar(`stop closed captions error: ${error.message}`, {
                    variant: 'error',
                });
            }
        } else {
            try {
                await closedCaptionsController?.startClosedCaptions();
                enqueueSnackbar('start closed captions success', { variant: 'success' });
            } catch (error) {
                enqueueSnackbar(`start closed captions error: ${error.message}`, {
                    variant: 'error',
                });
            }
        }
    };

    useEffect(() => {
        const removeClosedCaptionsStateListener = closedCaptionsController?.on(
            ClosedCaptionsEvent.CLOSED_CAPTIONS_STATE_CHANGED,
            state => {
                setIsClosedCaptionsStarted(state === ClosedCaptionsState.STARTED ? true : false);
            }
        );
        return () => {
            removeClosedCaptionsStateListener?.();
        };
    }, []);

    useEffect(() => {
        const removeClosedCaptionsDataListener = closedCaptionsController?.on(
            ClosedCaptionsEvent.CLOSED_CAPTIONS_DATA,
            setClosedCaptionsData
        );
        return () => {
            removeClosedCaptionsDataListener?.();
        };
    }, []);

    return (
        <div>
            <div className='action-button' onClick={toggleClosedCaptions}>
                {isClosedCaptionsStarted ? <ClosedCaptionDisabledIcon /> : <ClosedCaptionIcon />}
            </div>
            {isClosedCaptionsStarted ? (
                <ClosedCaptionsContent
                    closedCaptionsData={closedCaptionsData}></ClosedCaptionsContent>
            ) : null}
        </div>
    );
};

export default ClosedCaption;
