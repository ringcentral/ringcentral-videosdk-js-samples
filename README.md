# RingCentral Video Client SDK for Web Browser

## Overview

This repository contains sample projects using the RingCentral video SDK for web browser. This tutorial guides you to get started in your development efforts to create a web application with real-time audio/video communications.

With the video client SDK you can:

- Join or start a meeting with a valid access token.
- Join the meeting as a guest. (The app needs to get the authorization of the guest type first)
- Start audio/video communication with participants.
- Mute and unmute local audio.
- Start and stop the local video.
- Sharing the device screen or application.
- Receive meeting and media event callback, such as participant joined/leave, audio/video muted/unmuted.
- Host or moderator privileges:
    - Mute and unmute a particular participant' audio or video.
    - Mute and unmute all participants' audio or video.
    - Lock/unlock the meeting.
    - Start and pause the recording.
    - Assign and revoke the moderator role with participants.
    - Put in-meeting participants into the waiting room.
    - Admit/deny a user from the waiting room.
    - Admit all users from the waiting room.
    - Stop remote participant' sharing.
    - Remove participants in the meeting.

## Prerequisites

- Npm, Node, and Yarn need to be installed.
    - Node version must be greater than 14.0 (https://nodejs.dev/download/)
    - Yarn version must be greater than 2.0 (https://classic.yarnpkg.com/lang/en/docs/install/)
    - Npm installation: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- RingCentral Video Account (free - https://app.ringcentral.com/signup)
- Access to RingCentral Video Documentation (https://ringcentral-ringcentral-video-api-docs.readthedocs-hosted.com/en/latest/ using password "workasone")

## How to run the sample project

1. Open the unzipped folder, open a sample project under **samples** folder in an IDE (e.g. Visual Studio Code), or open a **terminal** and enter into the path of the sample project.

2. Open and modify the **app.config.js** file and place your client id, client secret, RingCentral extension user name, and password.

3. Run following scripts in the command line:
    a. yarn install or npm install
    b. yarn run dev or npm run dev

4. A new browser window or tab with the link **https://localhost:9000/** will be opened successfully. On the page, click the **Advanced** button and then click the **Proceed to localhost (unsafe)** link to load the sample application.

## Known Issues

- Some interfaces are not supported yet in the current beta version, they are being actively developed. For example, start and stop screen or application sharing, start and pause recording, and send in-meeting chat messages, etc.
- You may encounter some problems while running the sample app, such as UI abnormal display or crash, etc

## Contact Us

- Sign Up: Currently we have very early versions of our Android, iOS, and web SDK available for limited partners. If you would like to request access to the same, please email rcv-partners@ringcentral.com
- Dev Support & Feedback: For feedback, questions, or suggestions around SDK please email videosdkfeedback@ringcentral.com
