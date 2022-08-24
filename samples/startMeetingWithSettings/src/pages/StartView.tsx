import React, { useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap';
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
        <Form className='start-view'>
            <Form.Group className="mb-3">
                <Form.Label>MeetingName:</Form.Label>
                <Form.Control type="text" value={formData.meetingName}
                    onChange={({ target: { value } }) => setFormData({ ...formData, meetingName: value })} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="allowJoinBeforeHost" checked={formData.allowJoinBeforeHost}
                    onChange={({ target: { value } }) => setFormData({ ...formData, allowJoinBeforeHost: value === 'on' })} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="muteAudioForParticipant" checked={formData.muteAudioForParticipant}
                    onChange={({ target: { value } }) => setFormData({ ...formData, muteAudioForParticipant: value === 'on' })} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="muteVideoForParticipant" checked={formData.muteVideoForParticipant}
                    onChange={({ target: { value } }) => setFormData({ ...formData, muteVideoForParticipant: value === 'on' })} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="requirePassword" checked={formData.requirePassword}
                    onChange={({ target: { value } }) => setFormData({ ...formData, requirePassword: value === 'on' })} />
            </Form.Group>
            {formData.requirePassword &&
                <Form.Group className="mb-3">
                    <Form.Label>MeetingPassword:</Form.Label>
                    <Form.Control type="text" value={formData.meetingPassword}
                        onChange={({ target: { value } }) => setFormData({ ...formData, meetingPassword: value })} />
                </Form.Group>}
            <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="isWaitingRoomEnabled" checked={formData.isWaitingRoomEnabled}
                    onChange={({ target: { value } }) => setFormData({ ...formData, isWaitingRoomEnabled: value === 'on' })} />
            </Form.Group>
            {formData.isWaitingRoomEnabled &&
                <Form.Group className="mb-3">
                    <Form.Label>waitingRoomMode:</Form.Label>
                    <Form.Select value={formData.waitingRoomMode}
                        onChange={({ target: { value } }) => setFormData({ ...formData, waitingRoomMode: +value })}>
                        {WaitingRoomOptions.map((typeObj) => <option key={typeObj.value} value={typeObj.value}>{typeObj.label}</option>)}
                    </Form.Select>
                </Form.Group>}
            <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="allowScreenSharing" checked={formData.allowScreenSharing}
                    onChange={({ target: { value } }) => setFormData({ ...formData, allowScreenSharing: value === 'on' })} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="onlyAuthUserCanJoin" checked={formData.onlyAuthUserCanJoin}
                    onChange={({ target: { value } }) => setFormData({ ...formData, onlyAuthUserCanJoin: value === 'on' })} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="onlyCoworkersCanJoin" checked={formData.onlyCoworkersCanJoin}
                    onChange={({ target: { value } }) => setFormData({ ...formData, onlyCoworkersCanJoin: value === 'on' })} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="enableE2ee" disabled />
            </Form.Group>

            <Button
                className='start-btn'
                variant="success"
                disabled={isStartLoading}
                onClick={startMeetingHandler}>
                Start meeting {isStartLoading ? <Spinner animation="border" role="status" size="sm" /> : null}
            </Button>
        </Form >
    )
}

export default StartView