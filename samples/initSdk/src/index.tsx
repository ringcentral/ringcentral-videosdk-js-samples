import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Row, Col } from 'react-bootstrap';
import BtnHttpClient from './BtnHttpClient'
import BtnAccessToken from './BtnAccessToken'
import './index.less'
declare global {
    interface Window {
        initConfig: Record<string, string>
    }
}

export default function App({ config }) {
    const [rcvEngine, setRcvEngine] = useState(null)

    return (
        <>
            <div className='header'>Demo: init SDK</div>
            <Row className='start-view'>
                {!rcvEngine &&
                    <>
                        <Col sm={6}>
                            <BtnHttpClient config={config} setRcvEngine={setRcvEngine} />
                        </Col>
                        <Col sm={6}>
                            <BtnAccessToken config={config} setRcvEngine={setRcvEngine} />
                        </Col>

                    </>
                }
                {rcvEngine && <h4>RcvEngine initialization is successful!</h4>}
            </Row>
        </>
    )
}

createRoot(document.getElementById("root")).render(
    <App config={{
        ...window.initConfig,
    }} />
);