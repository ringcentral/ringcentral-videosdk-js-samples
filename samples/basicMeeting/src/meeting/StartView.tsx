import React, { FC } from 'react'

interface IProps {
    startMeetingHandler: () => {}
    joinMeetingHandler: () => {}
}

const StartView: FC<IProps> = (props) => {
    const { startMeetingHandler, joinMeetingHandler } = props
    return (
        <div className='start-view'>
            <button type="button" className="btn btn-primary" onClick={startMeetingHandler}>start meeting</button>
            <input type="text" className="form-control" placeholder='please input meetingId' />
            <button type="button" className="btn btn-primary" onClick={joinMeetingHandler}>join meeting</button>

        </div>)
}

export default StartView