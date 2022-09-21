import React, { useState } from 'react';
import { RcvEngine } from '@sdk';
import { RcButton } from '@ringcentral/juno';

const BtnHttpClient = ({ setRcvEngine, config }) => {
    const [isLoading, setLoading] = useState(false)

    const usernameModeHandler = async () => {
        const { clientId, clientSecret, userName: username, password } = config
        if (!clientId || !clientSecret) {
            const msg = `It needs clientId and clientSecret. Please check app.config.js!`
            alert(msg)
            return;
        }

        const RingCentralSdk = (window as any).RingCentral.SDK;
        const rcsdk = new RingCentralSdk({
            server: RingCentralSdk.server.production,
            clientId,
            clientSecret,
        });

        setLoading(true)
        await rcsdk
            .login({
                username,
                extension: '',
                password
            })
            .then((response) => {
                setLoading(false)
                const engine = RcvEngine.create(
                    {
                        httpClient: {
                            send: options => rcsdk.platform().send(options),
                        },
                    }
                );
                setRcvEngine(engine)
                return response.json()
            })
            .catch((e) => {
                setLoading(false)
                setRcvEngine("error")
                const msg = `Login fails: ${e.message}.`
                alert(msg)
            });
    }

    return (
        <RcButton
            color="success.b03"
            loadingMode="prefix"
            loading={isLoading}
            onClick={usernameModeHandler}>
            Init SDK by httpClient
        </RcButton>
    )
}

export default BtnHttpClient