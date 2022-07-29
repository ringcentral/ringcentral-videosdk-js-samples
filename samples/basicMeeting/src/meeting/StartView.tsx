import React, { FC } from 'react'

interface IProps {
    startMeetingHandler: () => {}
    joinMeetingHandler: () => {}
}

const StartView: FC<IProps> = (props) => {
    const { startMeetingHandler, joinMeetingHandler } = props
    return (
        <div className='start-view row'>
            <div className="col-4">
                <button type="button" className="btn btn-success" onClick={startMeetingHandler}>start meeting</button>
            </div>
            <div className="col-8">
                <div className='input-group'>
                    <input type="text" className="form-control" placeholder='please input meeting id' />
                    <button type="button" className="btn btn-primary" onClick={joinMeetingHandler}>join meeting</button>
                </div>
            </div>
        </div>)
}

export default StartView