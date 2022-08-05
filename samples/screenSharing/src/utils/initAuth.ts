export function getHttpClient(sdk, origin) {
    const platform = sdk.platform();
    return {
        origin,
        send: options => platform.send(options),
    };
}

export async function initRingcentralSDKByPasword(config) {
    const { origin: server, clientId, clientSecret, userName: username, password } = config
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
        .then((response) => {
            return response.json()
        })
        .catch((e) => {
            const msg = `Login fails: ${e.message}. Please check app.config.js to verify your configuration!`
            alert(msg)
        });

    return {
        rcsdk,
        authData,
    };
}