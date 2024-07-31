# RingCentral Video Client SDK sample Javascript applications

## Overview

This repository contains sample Javascript projects using the RingCentral Video Client SDK. The collection of samples here can help you get started building a custom client by giving you a good jumping off point for implementing similar features on your own. 

In this project you will find the following sample applications:

- `initSdk`: Demonstrates two ways of SDK initialization
- `quickStart`: Demonstrates primary meeting features including mute/unmute audio/video
- `screenSharing`: Demonstrates the screen-sharing feature
- `chat`: Demonstrates the meeting chat feature
- `deviceTest`: Demonstrates the audio/video device test
- `startMeetingWithSettings`: Demonstrates starting a meeting with customized settings
- `guestJoinMeeting`: Demonstrates a guest joins a meeting.
- `integrated-meeting`: Demonstrates primary meeting features with UI components.
- `integrated-meeting-uikit`: Demonstrates primary meeting features with `@ringcentral/video-sdk-react` UI components.

## Prerequisites

- npm, yarn or pnpm need to be installed.
- RingCentral Video Account (free - https://app.ringcentral.com/signup)
- Access to [RingCentral Video Documentation](https://ringcentral.github.io/ringcentral-videosdk-js/)

## How to run the sample project

1. Open the unzipped folder, open a sample project in an IDE (e.g. Visual Studio Code), or open a **terminal** and enter the path of the sample project.

2. Create an **app.config.js** file and place your client id, client secret, RingCentral JWT credential.

```
window.initConfig = {
    clientId: '', 
    clientSecret: '', 
    jwt: ''
}
```

3. Run the following scripts in the command line:
    - yarn install or npm install
    - yarn run dev or npm run dev

4. A new browser window or tab with the link **https://localhost:9000/** will be opened successfully. On the page, click the **Advanced** button and then click the **Proceed to localhost (unsafe)** link to load the sample application.

## About the RingCentral Video Client SDK

The Video Client SDK is designed to help developers build their own custom, fully-embedded, video experiences or applications. It is designed to aid in the creation of user interfaces. It is not an SDK for interfacing primarily with the Video REST API. With the Video Client SDK, one can:

- Joins or starts a meeting with a valid access token.
- Joins the meeting as a guest. (The app needs to get the authorization of the guest type first)
- Starts the audio/video communication with participants.
- Mutes and unmutes the local audio.
- Starts and stops the local video.
- Sharing the device screen or application.
- Sends in-meeting private and public chat messages.
- Starts an stops the local audio and video device test.
- Receives meeting and media event callback, such as participant joined/leave, audio/video muted/unmuted.
- Host or moderator privileges:
    - Mutes and unmutes a specific participant' audio or video.
    - Mutes and unmutes all meeting users' audio or video.
    - Locks/unlocks the meeting.
    - Starts and pauses the recording.
    - Assigns and revokes the moderator role with meeting users.
    - Puts in-meeting users into the waiting room.
    - Admits/denies a user from the waiting room.
    - Admits all users from the waiting room.
    - Stops remote users' sharing.
    - Locks and unlocks the meeting sharing function.
    - Removes the meeting user from the active meeting.
- Starts and pauses recording.
- Starts and pauses close captions.
- Starts and pauses live transcription.


## Contact Us

- Dev Support & Feedback: For feedback, questions, or suggestions around SDK please email videosdkfeedback@ringcentral.com or rcv-partners@ringcentral.com.
