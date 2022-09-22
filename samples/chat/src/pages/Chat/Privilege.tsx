import React, { useState, useContext } from 'react';
import { ChatPrivilege } from '@sdk';
import { RcSelect, RcMenuItem } from '@ringcentral/juno';
import ChatContext from './context';

const PRIVILEGES = [ChatPrivilege.EVERYONE, ChatPrivilege.HOST_MODERATOR];
const SetPrivilege = ({ defaultPrivilege }) => {

    const [privilege, setPrivilege] = useState<ChatPrivilege>(defaultPrivilege);
    const { chatController } = useContext(ChatContext);

    const handleChange = async (e) => {
        const value = e.target.value;

        try {
            await chatController?.setChatPrivilege(value);
            setPrivilege(value);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div style={{ margin: 20 }}>
            <RcSelect
                label="Set privilege"
                helperText="Host or moderator can do!"
                value={privilege}
                onChange={handleChange}>
                {PRIVILEGES.map((item) => <RcMenuItem key={item} value={item}>{item}</RcMenuItem>)}
            </RcSelect>
        </div>
    );
};

export default SetPrivilege;
