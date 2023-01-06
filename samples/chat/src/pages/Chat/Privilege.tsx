import React, { useState, useContext } from 'react';
import { ChatPrivilege } from '@sdk';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
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
        <FormControl variant="standard">
            <InputLabel id="select-privilege">Set privilege</InputLabel>
            <Select
                id="select-privilege"
                value={privilege}
                onChange={handleChange}>
                {PRIVILEGES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </Select>
            <FormHelperText>Host or moderator can do!</FormHelperText>
        </FormControl>
    );
};

export default SetPrivilege;
