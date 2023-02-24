import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ChatPrivilege } from '@ringcentral/video-sdk';
import { useGlobalContext } from '@src/store/global';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

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
        <FormControl size='small' sx={{ width: '320px' }}>
            <InputLabel>Allow</InputLabel>
            <Select
                label={'Allow'}
                placeholder='select'
                style={{ width: 300, marginBottom: 15 }}
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
