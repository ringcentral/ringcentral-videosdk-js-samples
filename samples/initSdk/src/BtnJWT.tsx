import React from 'react';
import { RcvEngine, GrantType } from '@sdk';
import { RcButton } from '@ringcentral/juno';

const BtnAccessToken = ({ setRcvEngine, config }) => {

    const tokenModeHandler = async () => {
        const { clientId, clientSecret, jwt } = config
        if (!clientId || !clientSecret || !jwt) {
            const msg = `It needs clientId, clientSecret and jwt. Please check app.config.js!`
            alert(msg)
            return;
        }
        const engine = RcvEngine.create(
            {
                clientId,
                clientSecret
            }
        );
        await engine.authorize({
            grantType: GrantType.JWT,
            jwt,
        });
        setRcvEngine(engine)
    }

    return (
        <RcButton onClick={tokenModeHandler}>
            Init SDK by JWT
        </RcButton>
    )
}

export default BtnAccessToken