import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import { RcvEngine, SYMBOL_RCV_ENGINE } from '@sdk/index';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link
} from 'react-router-dom';
import { routes } from './routes';
import './index.less'
import VideoMeeting from './pages/videoMeeting';
import { getHttpClient, getInitConfig, initRcvEngine, initRingcentralSDKByPasword } from './utils/initAuth';

const Layout = () => {
    return (
        <div className='menu-container'>
            {
                routes?.map(route => (
                    <Link to={route.path} className="menu-item">{route.name}</Link>
                ))
            }
        </div>
    )
}

export default function App() {
    // console.log('test----', RcvEngine)
    const [rcvEngine, setRcvEngine] = useState(null)

    useEffect(async () => {
        const { rcsdk, authData } = await initRingcentralSDKByPasword();
        const rcvEngine = new RcvEngine(
            getHttpClient(rcsdk),
            getInitConfig(authData)
        );
        
        setRcvEngine(rcvEngine)
    }, [])
    
    return (
        
        <Routes>
            <Route path="/" element={<Layout />} />
            
            {
                routes?.map(route => (
                    <Route path={route.path} element={<VideoMeeting rcvEngine={rcvEngine}/>} />
                ))
            }
        </Routes>
    )
}

ReactDOM.render(
<React.StrictMode>
        <Router>
            <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
)