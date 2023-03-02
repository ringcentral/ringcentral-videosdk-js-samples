import React, { FC } from 'react';

interface IIconProp {
    size: number;
}
const WeakConnection: FC<IIconProp> = props => {
    const { size } = props;
    return (
        <div style={{ width: `${size}px`, height: `${size}px`, display: 'flex' }}>
            <svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
                <path
                    fill='#000'
                    opacity='0.32'
                    d='M25 4h2a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'></path>
                <path
                    fill='#000'
                    d='M17 14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2h2zM7 20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2z'></path>
            </svg>
        </div>
    );
};

export default WeakConnection;
