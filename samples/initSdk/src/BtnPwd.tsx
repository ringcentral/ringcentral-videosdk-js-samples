import React from 'react';
import { RcvEngine, GrantType } from '@sdk';
import { RcButton } from '@ringcentral/juno';

const BtnAccessToken = ({ setRcvEngine, config }) => {

    const tokenModeHandler = async () => {
        const { clientId, clientSecret, userName, password } = config
        if (!clientId || !clientSecret || !userName || !password) {
            const msg = `It needs clientId, clientSecret, userName and password. Please check app.config.js!`
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
            grantType: GrantType.PASSWORD,
            username: userName,
            password,
        });
        setRcvEngine(engine)
    }

    return (
        <RcButton onClick={tokenModeHandler}>
            Init SDK by userName and password
        </RcButton>
    )
}

export default BtnAccessToken