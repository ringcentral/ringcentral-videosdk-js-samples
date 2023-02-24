import React from 'react';
import type { ILiveTranscription } from '@ringcentral/video-sdk';
import Avatar from '@src/pages/InMeeting/avatar';
import './index.less';

interface IGroupedTranscriptProps {
    groupedTranscriptData: ILiveTranscription[];
}

export function GroupedTranscript({ groupedTranscriptData }: IGroupedTranscriptProps) {
    if (groupedTranscriptData.length) {
        let startTime = '';
        if (groupedTranscriptData[0].words[0]) {
            startTime = new Date(groupedTranscriptData[0].words[0].startTime).toLocaleTimeString();
        }
        return (
            <div className={"groupedLT-Container"}>
                <div className={"groupedLT-AvatarContainer"}>
                    <Avatar participant={groupedTranscriptData[0].participant} displaySize={20} imgSize={20} />
                </div>
                <div className={"groupedLT-MainContent"}>
                    <div className={"groupedLT-Header"}>
                        <div className={"groupedLT-Name"}>
                            {groupedTranscriptData[0].participant.displayName}
                        </div>
                        <div className={"groupedLT-Time"}>{startTime}</div>
                    </div>
                    <div className={"groupedLT-TextContainer"}>
                        {groupedTranscriptData.map(transcript => {
                            return (
                                <span
                                    className={
                                        transcript.final
                                            ? "groupedLT-SingleFinalText"
                                            : "groupedLT-SingleText"
                                    }
                                    key={transcript.phraseId}>
                                    {transcript.text}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
    return null;
}
