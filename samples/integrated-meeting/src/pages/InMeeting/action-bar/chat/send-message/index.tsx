import React, { FC } from 'react';

import { IconButton, OutlinedInput } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface ISendMessageOptions {
    send: () => void;
    msg: string | undefined;
    hasPrivilege: boolean;
    onChange: (value: string) => void;
}
const SendMessage: FC<ISendMessageOptions> = props => {
    const { send, msg, hasPrivilege, onChange } = props;

    return (
        <div className='send-message'>
            <OutlinedInput
                margin='dense'
                size='small'
                placeholder='send message'
                style={{ flex: 1 }}
                type='text'
                value={msg}
                onChange={e => onChange(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        send();
                    }
                }}
            />
            <IconButton color='primary' onClick={send} disabled={!hasPrivilege}>
                <SendIcon />
            </IconButton>
        </div>
    );
};

export default SendMessage;
