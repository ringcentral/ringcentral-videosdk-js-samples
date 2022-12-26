import { Button, OutlinedInput } from '@mui/material';
import React, { useCallback, useContext } from 'react';

interface ISendMessageOptions {
    send: () => void;
    msg: string | undefined;
    hasPrivilege: boolean;
    onChange: (value: string) => void;
}

const SendMessage = ({ msg, send, onChange, hasPrivilege }: ISendMessageOptions) => {
    const isICanSend = useCallback(() => {
        if (hasPrivilege) return true;
        return false;
    }, [hasPrivilege]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <OutlinedInput
                disabled={!isICanSend}
                margin='dense'
                placeholder='send message'
                style={{ flex: 1 }}
                type='text'
                value={msg}
                onChange={e => onChange(e.target.value)}
            />
            <Button color='primary' disabled={!isICanSend} onClick={send}>
                send
            </Button>
        </div>
    );
};

export default SendMessage;
