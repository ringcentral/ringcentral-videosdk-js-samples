import React from 'react';
import { useMemo } from 'react';
import type { IParticipant, IStream } from '@ringcentral/video-sdk';
import { useStreamContext } from '../StreamProvider';
import type { IVideoCanvas } from '../StreamProvider';
import Avatar from '../avatar';
import './index.css';

export interface IStreamContainerProps {
    stream: Partial<IStream>;
    objectFit?: IVideoCanvas['objectFit'];
    remoteParticipantList: IParticipant[];
    localParticipant: IParticipant
}

function getParticipantByStream(stream: Partial<IStream>, remoteParticipantList: IParticipant[], localParticipant?: IParticipant): IParticipant | undefined {
    return [...remoteParticipantList, localParticipant].find(p => p && p.uid === stream.participantId);
}

export const StreamContainer = (props: IStreamContainerProps) => {
    const { stream, objectFit = 'contain', remoteParticipantList = [], localParticipant } = props;
    const participant = getParticipantByStream(stream, remoteParticipantList, localParticipant);
    const { setVideoRender } = useStreamContext();

    const videoContainer = useMemo(() => {
        return (
            <div
                className='video-container'
                ref={video => setVideoRender(stream.id, video, objectFit)}
                style={{
                    visibility: participant?.isVideoMuted ? 'hidden' : 'visible'
                }}
            />
        );
    }, [stream.id, participant?.isVideoMuted, objectFit]);

    return (
        <div className={`custom-stream-container`}>
            <div className='stream-container-inner'>
                <div
                    className='avatar-wrapper'
                    style={{
                        visibility: participant?.isVideoMuted ? 'visible' : 'hidden'
                    }}>
                    {participant && (
                        <Avatar displaySize='100%' imgSize={300} participant={participant}></Avatar>
                    )}
                </div>
                {videoContainer}
            </div>
        </div>
    );
}
