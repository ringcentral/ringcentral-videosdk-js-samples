import React from 'react';
import { RcvEngine } from '@sdk';
import { Button } from 'react-bootstrap';

const BtnAccessToken = ({ setRcvEngine, config }) => {

    const tokenModeHandler = () => {
        const { clientId, clientSecret, token } = config
        if (!clientId || !clientSecret || !token) {
            const msg = `It needs clientId, clientSecret and token. Please check app.config.js!`
            alert(msg)
            return;
        }
        const engine = new RcvEngine(
            {
                clientId,
                clientSecret
            }
        );
        engine.setAuthToken(JSON.stringify({ token }));
        setRcvEngine(engine)
    }

    return (
        <Button onClick={tokenModeHandler}>
            Init SDK by access token
        </Button>
    )
}

export default BtnAccessToken