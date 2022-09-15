import React, { FC, useCallback, useState, useRef } from 'react'
import { RcButton, RcIcon, RcTextField } from '@ringcentral/juno';
import { StartMeeting, JoinMeeting } from '@ringcentral/juno-icon';
import { RcvEngine } from '@sdk';
interface IProps {
    rcvEngine: RcvEngine
}

const StartView: FC<IProps> = (props) => {
    const { rcvEngine } = props
    const [isStartLoading, setStartLoading] = useState(false);
    const [isJoinLoading, setJoinLoading] = useState(false);
    const inputMeetingIdRef = useRef(null)
    const inputPwdRef = useRef(null)

    const startMeetingHandler = useCallback(async () => {
        if (rcvEngine) {
            setStartLoading(true)
            rcvEngine
                .startInstantMeeting()
                .catch(e => {
                    alert(`Error occurs due to :${e.message}`)
                })
                .finally(() => setStartLoading(false));
        }
    }, [rcvEngine])

    const joinMeetingHandler = useCallback(async () => {
        if (rcvEngine) {
            if (!inputMeetingIdRef.current.value.trim()) {
                alert('Meeting id can not be empty!')
                return;
            }
            setJoinLoading(true)
            rcvEngine
                .joinMeeting(inputMeetingIdRef.current.value, { password: inputPwdRef.current.value })
                .catch(e => {
                    alert(`Error occurs due to :${e.message}`)
                })
                .finally(() => setJoinLoading(false));
        }
    }, [rcvEngine])

    return (
        <div className='start-view'>
            <RcTextField
                className='item'
                label="Meeting Id"
                id="control"
                inputRef={inputMeetingIdRef}
            />
            <RcTextField
                className='item'
                label="Password"
                id="control"
                inputRef={inputPwdRef}
            />
            <RcButton
                className='item'
                loadingMode="prefix"
                startIcon={<RcIcon symbol={StartMeeting} />}
                loading={isJoinLoading}
                disabled={isJoinLoading || isStartLoading}
                onClick={!isJoinLoading ? joinMeetingHandler : null}>
                Join meeting
            </RcButton>
            <RcButton
                className='item'
                loadingMode="prefix"
                color="success.b03"
                startIcon={<RcIcon symbol={JoinMeeting} />}
                loading={isStartLoading}
                disabled={isJoinLoading || isStartLoading}
                onClick={!isStartLoading ? startMeetingHandler : null}>
                Start meeting
            </RcButton>
        </div>
    )
}

export default StartView