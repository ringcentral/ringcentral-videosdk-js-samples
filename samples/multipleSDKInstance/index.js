
function initSDK(config) {
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
    window.engine = engine;
    console.log(engine)
}


