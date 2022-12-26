import { Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ChatPrivilege } from '@sdk';
import { useGlobalContext } from '@src/store/global';
import { useSnackbar } from 'notistack';
import React, { useCallback, useContext, useState } from 'react';

const PRIVILEGES = [ChatPrivilege.EVERYONE, ChatPrivilege.HOST_MODERATOR];

const SetPrivilege = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { rcvEngine } = useGlobalContext();
    const meetingController = rcvEngine?.getMeetingController();
    const chatController = meetingController?.getChatController();
    const defaultPrivilege = chatController?.getCurrentChatPrivilege();
    const [privilege, setPrivilege] = useState<ChatPrivilege | ''>(defaultPrivilege);

    const handleChange = async event => {
        const value = event.target.value;
        try {
            await chatController?.setChatPrivilege(value);
            setPrivilege(value);
        } catch (error) {
            enqueueSnackbar(`${error.message}`, { variant: 'error' });
        }
    };

    return (
        <FormControl size='small'>
            <InputLabel>Allow</InputLabel>
            <Select
                label={'Allow'}
                placeholder='select'
                style={{ width: 300, marginBottom: 20 }}
                value={privilege}
                onChange={handleChange}>
                {PRIVILEGES.map(privilege => (
                    <MenuItem key={privilege} value={privilege}>
                        {privilege} to chat
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SetPrivilege;
