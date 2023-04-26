import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { RcvEngine, EngineEvent, ErrorCodeType, GrantType } from "@ringcentral/video-sdk";
import isSupport  from "@ringcentral/video-sdk/isSupport";
import { AppBar } from "@mui/material";
import StartView from "./pages/StartView";
import InMeeting from "./pages/InMeeting";
import GlobalContext from "./context";
import "./index.less";
declare global {
  interface Window {
    initConfig: Record<string, string>;
  }
}

export default function App({ config }) {
  const [rcvEngine, setRcvEngine] = useState(null);
  const [isMeetingJoined, setMeetingJoined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initSDK = async () => {
      const { clientId, clientSecret, jwt, userName, password } = config;
      // You could open 'enableDiscovery' and set 'discoveryServer' if neccessary
      const engine = RcvEngine.create({
        clientId, clientSecret,
        enableDiscovery: false,
      });
      // if config jwt, initialize SDK with jwt
      // else initialize SDK with password
      await engine.authorize({
        grantType: jwt ? GrantType.JWT : GrantType.PASSWORD,
        jwt,
        username: userName,
        password,
      });

      engine.on(EngineEvent.MEETING_JOINED, (meetingId, errorCode) => {
        if (errorCode === ErrorCodeType.ERR_OK) {
          setMeetingJoined(true);
          if (!window.location.pathname.includes("/meeting/")) {
            navigate(`/meeting/${meetingId}`);
          }
        }
      });
      engine.on(EngineEvent.MEETING_LEFT, () => {
        navigate("/", { replace: true });
      });
      setRcvEngine(engine);
    };

    console.log('isSupport', isSupport());
    
    initSDK();
  }, []);

  return (
    <GlobalContext.Provider value={{ isMeetingJoined }}>
        <AppBar position="static" className="header">
          Demo: basic meeting with mute/unmute audio/video
        </AppBar>
        <Routes>
          <Route path="meeting">
            <Route
              path=":meetingId"
              element={<InMeeting rcvEngine={rcvEngine} />}
            />
          </Route>
          <Route path="/" element={<StartView rcvEngine={rcvEngine} />} />
        </Routes>
    </GlobalContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App
      config={{
        ...window.initConfig,
      }}
    />
  </BrowserRouter>
);
