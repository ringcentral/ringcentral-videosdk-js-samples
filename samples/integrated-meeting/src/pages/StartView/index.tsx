import React, { FC, useCallback, useState, useRef } from 'react';
import {
    RcButton,
    RcDialog,
    RcDialogActions,
    RcDialogContent,
    RcDialogTitle,
    RcIcon,
    RcTextField,
} from '@ringcentral/juno';
import { StartMeeting, JoinMeeting } from '@ringcentral/juno-icon';
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
                        onClick={!isStartLoading ? startMeetingHandler : null}>
                        <RcIcon size='xxxlarge' symbol={StartMeeting} color='#039fd8' />
                    </div>
                    <p className='meeting-button-text'>Start Meeting</p>
                </div>
                <div className='meeting-button-wrapper' onClick={() => setIsShowModal(true)}>
                    <div className='meeting-button'>
                        <RcIcon size='xxxlarge' symbol={JoinMeeting} color='#039fd8' />
                    </div>
                    <p className='meeting-button-text'>Join Meeting</p>
                </div>
            </div>
            <RcDialog open={isShowModal} onClose={() => setIsShowModal(false)} maxWidth='xs'>
                <RcDialogTitle>Join a meeting</RcDialogTitle>
                <RcDialogContent>
                    <RcTextField
                        required
                        label='Meeting Id'
                        id='control'
                        inputRef={inputMeetingIdRef}
                    />
                    <RcTextField
                        className='mar-l-15'
                        label='Password'
                        id='control'
                        inputRef={inputPwdRef}
                    />
                </RcDialogContent>
                <RcDialogActions>
                    <RcButton
                        radius='round'
                        keepElevation
                        color='#fff'
                        size='small'
                        style={{ width: '100px' }}
                        onClick={() => setIsShowModal(false)}>
                        Cancel
                    </RcButton>
                    <RcButton
                        radius='round'
                        keepElevation
                        color='#066fac'
                        size='small'
                        style={{ width: '100px', marginLeft: '10px' }}
                        onClick={!isJoinLoading ? joinMeetingHandler : null}>
                        Join
                    </RcButton>
                </RcDialogActions>
            </RcDialog>
        </div>
    );
};

export default StartView;
