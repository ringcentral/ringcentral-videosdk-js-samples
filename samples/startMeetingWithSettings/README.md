## Basic Meeting Sample app

### Feature List

- start meeting with settings, whose properties are as below:
  - meetingName: string;
  - allowJoinBeforeHost: bool; (Default is true)
  - muteAudioForParticipant: bool; (Default is false)
  - muteVideoForParticipant: bool; (Default is true)
  - requirePassword: bool; (Default is true)
  - meetingPassword: string; 
  - isWaitingRoomEnabled: bool; (Default is false)
  - waitingRoomMode: MeetingWaitingRoomMode
  - allowScreenSharing: bool; (Default is true)
  - onlyAuthUserCanJoin: bool; (Default is false)
  - onlyCoworkersCanJoin: bool; (Default is false)
  - enableE2ee: bool; (Default is false)

### How to Run?

- Fill in `app.config.js` with your app and account information
- Run `yarn install`
- Run `yarn run dev`
- Open `https://localhost:9000/` in browser