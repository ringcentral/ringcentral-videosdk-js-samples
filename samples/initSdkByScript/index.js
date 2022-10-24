const config = {
    clientId: 'your clientID',
    clientSecret: 'your client secret',
    token: {
        access_token: "xxx",
        endpoint_id: "xxx",
        expires_in: 3600,
        owner_id: "xxx",
        refresh_token: "xxx",
        refresh_token_expires_in: 604800,
        scope: "ReadAccounts Meetings SubscriptionWebhook",
        token_type: "bearer"
    }
}

function initSDK() {
    const { clientId, clientSecret, token } = config
    const RcvEngine = window.librcv.RcvEngine;
    // You could open 'enableDiscovery' and set 'discoveryServer' if neccessary
    const engine = RcvEngine.create(
        {
            clientId,
            clientSecret,
            enableDiscovery: false 
        }
    );
    engine.setAuthToken(JSON.stringify({ token }));
    alert('Success!')
}

initSDK()
