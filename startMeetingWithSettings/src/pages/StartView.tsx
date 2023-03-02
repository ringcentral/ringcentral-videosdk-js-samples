import React, { useState } from 'react'
import { Button, FormGroup, TextField, Checkbox, Select, MenuItem, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { RcvEngine, WaitingRoomMode, OnlyAuthUserJoinMode } from '@ringcentral/video-sdk';

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
        onlyAuthUserJoinMode: OnlyAuthUserJoinMode.OFF,
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
            <FormGroup>
                <TextField label="MeetingName" value={formData.meetingName}
                    onChange={({ target: { value } }) => setFormData({ ...formData, meetingName: value })} />
                <FormControlLabel
                    label="allowJoinBeforeHost"
                    control={<Checkbox checked={formData.allowJoinBeforeHost}
                        onChange={({ target }) => setFormData({ ...formData, allowJoinBeforeHost: target.checked })} />} />
                <FormControlLabel
                    label="muteAudioForParticipant"
                    control={<Checkbox checked={formData.muteAudioForParticipant}
                        onChange={({ target }) => setFormData({ ...formData, muteAudioForParticipant: target.checked })} />} />
                <FormControlLabel
                    label="muteVideoForParticipant"
                    control={<Checkbox checked={formData.muteVideoForParticipant}
                        onChange={({ target }) => setFormData({ ...formData, muteVideoForParticipant: target.checked })} />} />
                <FormControlLabel
                    label="requirePassword"
                    control={<Checkbox checked={formData.requirePassword}
                        onChange={({ target }) => setFormData({ ...formData, requirePassword: target.checked })} />} />
                {formData.requirePassword &&
                    <TextField label="MeetingPassword" value={formData.meetingPassword}
                        onChange={({ target: { value } }) => setFormData({ ...formData, meetingPassword: value })} />
                }
                <FormControlLabel
                    label="isWaitingRoomEnabled"
                    control={<Checkbox checked={formData.isWaitingRoomEnabled}
                        onChange={({ target }) => setFormData({ ...formData, isWaitingRoomEnabled: target.checked })} />} />
                {formData.isWaitingRoomEnabled &&
                    <Select label="waitingRoomMode" value={formData.waitingRoomMode} style={{ width: 200 }}
                        onChange={({ target: { value } }) => setFormData({ ...formData, waitingRoomMode: +value })}>
                        {WaitingRoomOptions.map((typeObj) => <MenuItem key={typeObj.value} value={typeObj.value}>{typeObj.label}</MenuItem>)}
                    </Select>
                }
                <FormControlLabel
                    label="allowScreenSharing"
                    control={<Checkbox checked={formData.allowScreenSharing}
                        onChange={({ target }) => setFormData({ ...formData, allowScreenSharing: target.checked })} />} />
                <FormControl>
                    <FormLabel>onlyAuthUserJoinMode</FormLabel>
                    <Select
                        value={formData.onlyAuthUserJoinMode}
                        onChange={({ target: { value } }) => setFormData({ ...formData, onlyAuthUserJoinMode: +value })}>
                        <MenuItem value={OnlyAuthUserJoinMode.OFF}>OFF</MenuItem>
                        <MenuItem value={OnlyAuthUserJoinMode.CO_WORKERS}>CO_WORKERS</MenuItem>
                        <MenuItem value={OnlyAuthUserJoinMode.SIGNED_IN_USERS}>
                            SIGNED_IN_USERS
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel
                    label="enableE2ee"
                    control={<Checkbox checked={formData.enableE2ee}
                        onChange={({ target }) => setFormData({ ...formData, enableE2ee: target.checked })} />} />
            </FormGroup>
            <Button
                className='start-btn'
                variant="contained"
                disabled={isStartLoading}
                onClick={startMeetingHandler}>
                Start meeting{isStartLoading ? '...' : ''}
            </Button>
        </div>
    )
}

export default StartView