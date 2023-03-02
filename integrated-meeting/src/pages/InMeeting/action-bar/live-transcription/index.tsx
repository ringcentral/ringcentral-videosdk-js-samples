import React from 'react';
import { FontDownload } from '@mui/icons-material';
import { ActiveFeatureModal, MeetingReduceType, useMeetingContext } from '@src/store/meeting';
import { useSnackbar } from 'notistack';
import { useGlobalContext } from '@src/store/global';
import MeetingFeatureModal from '../meeting-feature-modal';
import TranscriptionPanel from './transcript-panel';

import './index.less';

const LiveTranscription = () => {
    const { state: meetingState, dispatch } = useMeetingContext();
    const { rcvEngine } = useGlobalContext();
    const { enqueueSnackbar } = useSnackbar();

    const showTLModal = async () => {
        dispatch({
            type: MeetingReduceType.ACTIVE_FEATURE_MODAL,
            payload: { activeFeatureModal: ActiveFeatureModal.LiveTranscprition },
        });
        const liveTranscriptionCtrl = rcvEngine.getMeetingController().getLiveTranscriptionController();
        if (!liveTranscriptionCtrl.getLiveTranscriptionSettings()?.transcriptServerConnected) {
            try {
                await liveTranscriptionCtrl.enableLiveTranscription();
            } catch (error) {
                enqueueSnackbar(`error when enable LiveTranscription: ${error.message}`, {
                    variant: 'error',
                });
            }
        }
    };

    return (
        <>
            <div className={`action-button`} onClick={showTLModal}>
                <FontDownload className='action-button-icon' />
            </div>
            {meetingState.activeFeatureModal === ActiveFeatureModal.LiveTranscprition ? (
                <MeetingFeatureModal title='Transcript '>
                    <div className='lt-modal-content'>
                        <TranscriptionPanel />
                    </div>
                </MeetingFeatureModal>
            ) : null}
        </>
    );
};

export default LiveTranscription;