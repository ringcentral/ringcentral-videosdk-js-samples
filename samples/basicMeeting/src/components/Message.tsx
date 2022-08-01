import React, { FC, useEffect } from 'react'
import { Alert } from 'react-bootstrap';
import './Message.less';

interface IProps extends IMessage {
    onClose?: () => void
}

export interface IMessage {
    msg: string
    type?: 'success' | 'danger' | 'warning' | 'info'
}

const Message: FC<IProps> = (props) => {
    const { msg, type = 'info', onClose } = props;

    useEffect(() => {
        if (msg && onClose) {
            setTimeout(() => { onClose() }, 3000)
        }
    }, [msg])

    return msg ? <Alert className='my-alert' variant={type}>{msg} </Alert> : null
}

export default Message