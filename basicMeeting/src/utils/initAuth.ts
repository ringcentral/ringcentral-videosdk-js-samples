import { RcvEngine } from '@sdk';

export function getHttpClient(sdk, origin) {
    const platform = sdk.platform();
    return {
        origin,
        send: options => platform.send(options),
    };
}

export function getInitConfig(authData) {
    return {
        isGuest: !authData?.owner_id,
    };
}

export async function initRingcentralSDKByPasword(config) {
    const { server, clientId, clientSecret, username, password } = config
    const rcsdk = new (window as any).RingCentral.SDK({
        server,
        clientId,
        clientSecret,
    });
    const authData = await rcsdk
        .login({
            username, // phone number in full format
            extension: '', // leave blank if direct number is used
            password
        })
        .then(function (response) {
            return response.json();
        });

    return {
        rcsdk,
        authData,
    };
}


export async function initRcvEngine() {
    const { rcsdk, authData } = await initRingcentralSDKByPasword();

    const rcvEngine = new RcvEngine(
        getHttpClient(rcsdk),
        getInitConfig(authData)
    );


    return rcvEngine;
}