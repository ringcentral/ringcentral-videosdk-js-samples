import React, { useCallback } from 'react';
import { ChatType } from '@sdk';
import { RcButton, RcTextField } from '@ringcentral/juno';

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
            <RcTextField
                style={{ flex: 1 }}
                variant="outline"
                placeholder='send message'
                onChange={e => onChange(e.target.value)}
                disabled={!isICanSend}
                fullWidth
                gutterBottom
            />
            <RcButton onClick={send} disabled={!isICanSend}>
                send
            </RcButton>
        </div>
    );
};

export default SendMessage;
