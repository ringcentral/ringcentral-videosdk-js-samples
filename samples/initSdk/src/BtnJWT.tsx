import React from 'react';
import { RcvEngine, GrantType } from '@ringcentral/video-sdk';
import { Button } from '@mui/material';

const BtnAccessToken = ({ setRcvEngine, config }) => {

    const tokenModeHandler = async () => {
        const { clientId, clientSecret, jwt } = config
        if (!clientId || !clientSecret || !jwt) {
            const msg = `It needs clientId, clientSecret and jwt. Please check app.config.js!`
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
            grantType: GrantType.JWT,
            jwt,
        });
        setRcvEngine(engine)
    }

    return (
        <Button onClick={tokenModeHandler} variant="outlined">
            Init SDK by JWT
        </Button>
    )
}

export default BtnAccessToken