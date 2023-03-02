import React from 'react';
import { RcvEngine } from '@ringcentral/video-sdk';
import { Button } from '@mui/material';

const BtnAccessToken = ({ setRcvEngine, config }) => {

    const tokenModeHandler = () => {
        const { clientId, clientSecret, token } = config
        if (!clientId || !clientSecret || !token) {
            const msg = `It needs clientId, clientSecret and token. Please check app.config.js!`
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
        engine.setAuthToken(JSON.stringify(token));
        setRcvEngine(engine)
    }

    return (
        <Button onClick={tokenModeHandler} variant="outlined">
            Init SDK by access token
        </Button>
    )
}

export default BtnAccessToken