import React from 'react';
import { RcvEngine } from '@sdk';
import { RcButton } from '@ringcentral/juno';

const BtnAccessToken = ({ setRcvEngine, config }) => {

    const tokenModeHandler = () => {
        const { clientId, clientSecret, token } = config
        if (!clientId || !clientSecret || !token) {
            const msg = `It needs clientId, clientSecret and token. Please check app.config.js!`
            alert(msg)
            return;
        }
        const engine = RcvEngine.create(
            {
                clientId,
                clientSecret
            }
        );
        engine.setAuthToken(JSON.stringify(token));
        setRcvEngine(engine)
    }

    return (
        <RcButton onClick={tokenModeHandler}>
            Init SDK by access token
        </RcButton>
    )
}

export default BtnAccessToken