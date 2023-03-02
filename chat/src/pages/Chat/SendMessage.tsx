import React, { useCallback } from 'react';
import { ChatType } from '@ringcentral/video-sdk';
import { Button, TextField } from '@mui/material';

interface ISendMessageOptions {
    send: () => void;
    currentType: string;
    hasPrivilege: boolean;
    onChange: (value: string) => void;
}

const SendMessage = ({ send, onChange, hasPrivilege, currentType }: ISendMessageOptions) => {
    const isICanSend = useCallback(() => {
        if (hasPrivilege) return true;
        if (currentType === ChatType.PUBLIC) return true;
        return false;
    }, [currentType, hasPrivilege]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
                style={{ flex: 1 }}
                placeholder='send message'
                onChange={e => onChange(e.target.value)}
                disabled={!isICanSend}
                fullWidth
            />
            <Button variant="contained" onClick={send} disabled={!isICanSend}>
                send
            </Button>
        </div>
    );
};

export default SendMessage;
