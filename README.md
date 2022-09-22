# RingCentral Video Client SDK for Web Browser

## Overview

This repository contains sample projects using the RingCentral video SDK for web browser. This tutorial guides you to get started in your development efforts to create a web application with real-time audio/video communications.

With the video client SDK you can:

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
    - yarn install or npm install
    - yarn run dev or npm run dev

4. A new browser window or tab with the link **https://localhost:9000/** will be opened successfully. On the page, click the **Advanced** button and then click the **Proceed to localhost (unsafe)** link to load the sample application.

## Known Issues

- You may encounter some problems while running the sample app, such as UI abnormal display or crash, etc

## Contact Us

- Sign Up: Currently we have very early versions of our Android, iOS, and web SDK available for limited partners. If you would like to request access to the same, please email rcv-partners@ringcentral.com
- Dev Support & Feedback: For feedback, questions, or suggestions around SDK please email videosdkfeedback@ringcentral.com
