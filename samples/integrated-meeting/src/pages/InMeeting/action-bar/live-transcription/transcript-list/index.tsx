import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useGlobalContext } from '@src/store/global';
import { ILiveTranscription, LiveTranscriptionEvent } from '@ringcentral/video-sdk';
import { GroupedTranscript } from './grouped-transcript';
import { BackgroundGrouping } from './data/background-grouping';

const LiveTranscriptList = ({ isConnect = false }) => {
    const grouping = useRef<BackgroundGrouping>(new BackgroundGrouping());

    const { rcvEngine } = useGlobalContext();
    const [transcriptionData, setTranscriptionData] = useState<ILiveTranscription[][]>([]);

    useEffect(() => {
        if (isConnect) {
            grouping.current.subscribe(setTranscriptionData);
            handleGetHistory();
            const historyChanged = getLiveTranscriptionController().on(
                LiveTranscriptionEvent.LIVE_TRANSCRIPTION_HISTORY_CHANGED,
                liveTranscriptionHistoryHandler
            );
            const dataChanges = getLiveTranscriptionController().on(
                LiveTranscriptionEvent.LIVE_TRANSCRIPTION_DATA_CHANGED,
                grouping.current.addTranscript
            );
            return () => {
                historyChanged();
                dataChanges();
            }
        }
    }, [isConnect]);

    const handleGetHistory = useCallback(async () => {
        try {
            await getLiveTranscriptionController().getLiveTranscriptionHistory();
        } catch (error) {
            console.info(`getLiveTranscriptionHistory error: ${error.message}`);
        }
    }, []);

    const liveTranscriptionHistoryHandler = (historyTranscriptList: ILiveTranscription[]) => {
        console.info('LIVE_TRANSCRIPTION_HISTORY_CHANGED', historyTranscriptList);
        grouping.current.resetGroupsByTranscriptHistories(historyTranscriptList);
    };

    const getLiveTranscriptionController = () => {
        return rcvEngine.getMeetingController().getLiveTranscriptionController();
    }

    return (
        <div className={"lt-list-wrapper"}>
            {transcriptionData.map(groupedTranscriptData => {
                if (groupedTranscriptData.length) {
                    const firstTranscriptData = groupedTranscriptData[0];
                    return (
                        <GroupedTranscript
                            groupedTranscriptData={groupedTranscriptData}
                            key={firstTranscriptData.phraseId}
                        />
                    );
                }
                return null;
            })}
        </div>
    );
}

export default LiveTranscriptList;
