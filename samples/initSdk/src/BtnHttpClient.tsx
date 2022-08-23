import React, { useState } from 'react';
import { RcvEngine } from '@sdk';
import { Button, Spinner } from 'react-bootstrap';

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
                return response.json()
            })
            .catch((e) => {
                setLoading(false)
                const msg = `Login fails: ${e.message}.`
                alert(msg)
            });

        const engine = RcvEngine.create(
            {
                httpClient: {
                    send: options => rcsdk.platform().send(options),
                },
            }
        );
        setRcvEngine(engine)
    }

    return (
        <Button
            variant="success"
            onClick={usernameModeHandler}>
            Init SDK by httpClient  {isLoading ? <Spinner animation="border" role="status" size="sm" /> : null}
        </Button>
    )
}

export default BtnHttpClient