import { RcvEngine, SYMBOL_RCV_ENGINE } from '@sdk/index';

export function getHttpClient(sdk) {
    const platform = sdk.platform();
    return {
        origin: 'https://platform.ringcentral.com',
        send: options => platform.send(options),
    };
}

export function getInitConfig(authData) {
    return {
        isGuest: !authData?.owner_id,
    };
}

export async function initRingcentralSDKByPasword() {
    const rcsdk = new (window as any).RingCentral.SDK({
        server: 'https://platform.ringcentral.com',
        clientId: 'QGBGV60-RKixEgQ-SFPuyw',
        clientSecret: 'ICFikaceQ3yUXH7zLHIOlwRUANA0mCR7m3T8g01o5SnA',
    });
    const authData = await rcsdk
        .login({
            username: 'rene.keyi+002@gmail.com', // phone number in full format
            extension: '', // leave blank if direct number is used
            password: 'Ring@1920'
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