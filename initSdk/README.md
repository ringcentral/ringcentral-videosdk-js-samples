## Basic Meeting Sample app

### Feature List

- Initialize sdk
- Option 1: login with username and password, then provide httpClient object to SDK for intialization.
- Option 2: Initialize SDK by clientId and clientSecret, then inject access token by ` engine.setAuthToken(tokenString)`.
- Option 3: Initialize SDK by clientId ,clientSecret and JWT, then inject access token by ` engine.authorize({grantType: 'JWT', jwtString)`.
- Option 4: Initialize SDK by clientId ,clientSecret and username&password, then inject access token by ` engine.authorize({grantType: 'PASSWORD', username, password)`.

### How to Run?

- Fill in `app.config.js` with your app and account information
- Run `yarn install`
- Run `yarn run dev`
- Open `https://localhost:9000/` in browser