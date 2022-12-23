import React, { FC, useCallback, useState, useRef } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';

import { RcvEngine } from '@sdk';
import './index.less';
interface IProps {
    rcvEngine: RcvEngine;
}

const StartView: FC<IProps> = props => {
    const { rcvEngine } = props;
    const [isStartLoading, setStartLoading] = useState(false);
    const [isJoinLoading, setJoinLoading] = useState(false);

    const [isShowModal, setIsShowModal] = useState(false);
    const inputMeetingIdRef = useRef(null);
    const inputPwdRef = useRef(null);

    const startMeetingHandler = useCallback(async () => {
        if (rcvEngine) {
            setStartLoading(true);
            rcvEngine
                .startInstantMeeting()
                .catch(e => {
                    alert(`Error occurs due to :${e.message}`);
                })
                .finally(() => setStartLoading(false));
        }
    }, [rcvEngine]);

    const joinMeetingHandler = useCallback(async () => {
        if (rcvEngine) {
            if (!inputMeetingIdRef.current.value.trim()) {
                alert('Meeting id can not be empty!');
                return;
            }
            setJoinLoading(true);
            rcvEngine
                .joinMeeting(inputMeetingIdRef.current.value, {
                    password: inputPwdRef.current.value,
                })
                .catch(e => {
                    alert(`Error occurs due to :${e.message}`);
                })
                .finally(() => setJoinLoading(false));
        }
    }, [rcvEngine]);

    return (
        <div className='start-view'>
            <div className='meeting-button-group'>
                <div className='meeting-button-wrapper'>
                    <div
                        className='meeting-button'
                        onClick={!isStartLoading ? startMeetingHandler : null}></div>
                    <p className='meeting-button-text'>Start Meeting</p>
                </div>
                <div className='meeting-button-wrapper' onClick={() => setIsShowModal(true)}>
                    <div className='meeting-button'></div>
                    <p className='meeting-button-text'>Join Meeting</p>
                </div>
            </div>
            <Dialog open={isShowModal} onClose={() => setIsShowModal(false)} maxWidth='xs'>
                <DialogTitle>Join a meeting</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        label='Meeting Id'
                        id='control'
                        inputRef={inputMeetingIdRef}
                    />
                    <TextField
                        className='mar-l-15'
                        label='Password'
                        id='control'
                        inputRef={inputPwdRef}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        size='small'
                        style={{ width: '100px' }}
                        onClick={() => setIsShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        size='small'
                        style={{ width: '100px', marginLeft: '10px' }}
                        onClick={!isJoinLoading ? joinMeetingHandler : null}>
                        Join
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default StartView;
