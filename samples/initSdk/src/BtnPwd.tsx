import React from 'react';
import { RcvEngine, GrantType } from '@sdk';
import { Button } from '@mui/material';

const BtnAccessToken = ({ setRcvEngine, config }) => {

    const tokenModeHandler = async () => {
        const { clientId, clientSecret, userName, password } = config
        if (!clientId || !clientSecret || !userName || !password) {
            const msg = `It needs clientId, clientSecret, userName and password. Please check app.config.js!`
            alert(msg)
            return;
        }
        // You could open 'enableDiscovery' and set 'discoveryServer' if neccessary
        const engine = RcvEngine.create(
            {
                clientId,
                clientSecret,
                enableDiscovery: false 
            }
        );
        await engine.authorize({
            grantType: GrantType.PASSWORD,
            username: userName,
            password,
        });
        setRcvEngine(engine)
    }

    return (
        <Button onClick={tokenModeHandler} variant="outlined">
            Init SDK by userName and password
        </Button>
    )
}

export default BtnAccessToken