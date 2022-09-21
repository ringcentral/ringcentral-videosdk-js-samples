import React, { useState } from 'react'
import { RcButton, RcFormGroup, RcTextField, RcCheckbox, RcSelect, RcMenuItem } from '@ringcentral/juno';
import { RcvEngine, WaitingRoomMode } from '@sdk';

const WaitingRoomOptions = [
    {
        value: WaitingRoomMode.EVERYONE,
        label: 'Everyone need to'
    },
    {
        value: WaitingRoomMode.NOT_AUTH_USER,
        label: 'Not auth user need to'
    },
    {
        value: WaitingRoomMode.NOT_COWORKERS,
        label: 'Not coworkers need to'
    }
]

const StartView = () => {
    const [formData, setFormData] = useState({
        meetingName: "RingCentral's Meeting",
        allowJoinBeforeHost: true,
        muteAudioForParticipant: false,
        muteVideoForParticipant: true,
        requirePassword: false,
        meetingPassword: '123456',
        isWaitingRoomEnabled: false,
        waitingRoomMode: WaitingRoomMode.EVERYONE,
        allowScreenSharing: true,
        onlyAuthUserCanJoin: false,
        onlyCoworkersCanJoin: false,
        enableE2ee: false,
    })
    const [isStartLoading, setStartLoading] = useState(false);

    const startMeetingHandler = async () => {
        const rcvEngine = RcvEngine.instance()
        if (rcvEngine) {
            setStartLoading(true)
            rcvEngine.startInstantMeeting(formData)
                .catch(e => {
                    alert(`Error occurs due to :${e.message}`)
                })
                .finally(() => setStartLoading(false));
        }
    }

    return (
        <div className='start-view'>
            <RcFormGroup>
                <RcTextField label="MeetingName" value={formData.meetingName}
                    onChange={({ target: { value } }) => setFormData({ ...formData, meetingName: value })} />
            </RcFormGroup>
            <RcFormGroup>
                <RcCheckbox label="allowJoinBeforeHost" checked={formData.allowJoinBeforeHost}
                    onChange={({ target }) => setFormData({ ...formData, allowJoinBeforeHost: target.checked })} />
            </RcFormGroup>
            <RcFormGroup>
                <RcCheckbox label="muteAudioForParticipant" checked={formData.muteAudioForParticipant}
                    onChange={({ target }) => setFormData({ ...formData, muteAudioForParticipant: target.checked })} />
            </RcFormGroup>
            <RcFormGroup>
                <RcCheckbox label="muteVideoForParticipant" checked={formData.muteVideoForParticipant}
                    onChange={({ target }) => setFormData({ ...formData, muteVideoForParticipant: target.checked })} />
            </RcFormGroup>
            <RcFormGroup>
                <RcCheckbox label="requirePassword" checked={formData.requirePassword}
                    onChange={({ target }) => setFormData({ ...formData, requirePassword: target.checked })} />
            </RcFormGroup>
            {formData.requirePassword &&
                <RcFormGroup>
                    <RcTextField label="MeetingPassword" value={formData.meetingPassword}
                        onChange={({ target: { value } }) => setFormData({ ...formData, meetingPassword: value })} />
                </RcFormGroup>}
            <RcFormGroup>
                <RcCheckbox label="isWaitingRoomEnabled" checked={formData.isWaitingRoomEnabled}
                    onChange={({ target }) => setFormData({ ...formData, isWaitingRoomEnabled: target.checked })} />
            </RcFormGroup>
            {formData.isWaitingRoomEnabled &&
                <RcFormGroup>
                    <RcSelect label="waitingRoomMode" value={formData.waitingRoomMode} style={{ width: 200 }}
                        onChange={({ target: { value } }) => setFormData({ ...formData, waitingRoomMode: +value })}>
                        {WaitingRoomOptions.map((typeObj) => <RcMenuItem key={typeObj.value} value={typeObj.value}>{typeObj.label}</RcMenuItem>)}
                    </RcSelect>
                </RcFormGroup>}
            <RcFormGroup>
                <RcCheckbox label="allowScreenSharing" checked={formData.allowScreenSharing}
                    onChange={({ target }) => setFormData({ ...formData, allowScreenSharing: target.checked })} />
            </RcFormGroup>
            <RcFormGroup>
                <RcCheckbox label="onlyAuthUserCanJoin" checked={formData.onlyAuthUserCanJoin}
                    onChange={({ target }) => setFormData({ ...formData, onlyAuthUserCanJoin: target.checked })} />
            </RcFormGroup>
            <RcFormGroup>
                <RcCheckbox label="onlyCoworkersCanJoin" checked={formData.onlyCoworkersCanJoin}
                    onChange={({ target }) => setFormData({ ...formData, onlyCoworkersCanJoin: target.checked })} />
            </RcFormGroup>
            <RcFormGroup>
                <RcCheckbox label="enableE2ee" disabled />
            </RcFormGroup>

            <RcButton
                className='start-btn'
                color="success.b03"
                loadingMode="prefix"
                loading={isStartLoading}
                disabled={isStartLoading}
                onClick={startMeetingHandler}>
                Start meeting
            </RcButton>
        </div>
    )
}

export default StartView