import type { ILiveTranscription } from '@sdk';

import { Grouping } from './grouping';
import {
    SAME_PARTICIPANT_NEW_GROUP_INTERVAL,
    SS_CONTINUATION_INTERVAL,
    SS_START_INTERVAL,
} from './utils';

type StoreCallback = (groupedTranscriptData: ILiveTranscription[][]) => void;

export class BackgroundGrouping {
    _callbacks: StoreCallback[] = [];
    _groupedTranscripts: ILiveTranscription[][] = [];
    _grouping?: Grouping = undefined;

    constructor() {
        this.flushState();
    }

    _sendStoreUpdates() {
        if (this._callbacks.length > 0) {
            this._callbacks.forEach(callback => {
                callback(this._groupedTranscripts);
            });
        }
    }

    resetGroupsByTranscriptHistories = (historyTranscriptList: ILiveTranscription[]) => {
        if (this._grouping) {
            this._groupedTranscripts =
                this._grouping.createGroupsByTranscriptList(historyTranscriptList);
            this._sendStoreUpdates();
        }
    };

    resetGroupsByGroupedTranscriptHistories = (historyTranscriptList: ILiveTranscription[]) => {
        if (this._grouping) {
            this._groupedTranscripts =
                this._grouping.createGroupsByGroupedTranscriptList(historyTranscriptList);
            this._sendStoreUpdates();
        }
    };

    addTranscript = transcript => {
        if (this._grouping) {
            this._groupedTranscripts = this._grouping?.addTranscript(
                this._groupedTranscripts,
                transcript
            );
            this._sendStoreUpdates();
        }
    };

    addGroupedTranscript = groupedTranscript => {
        if (this._grouping) {
            this._groupedTranscripts = this._grouping?.addGroupedTranscript(
                this._groupedTranscripts,
                groupedTranscript
            );
            this._sendStoreUpdates();
        }
    };

    flushState = () => {
        this._callbacks = [];
        this._groupedTranscripts = [];
        this._grouping = new Grouping({
            sameParticipantNewGroupInterval: SAME_PARTICIPANT_NEW_GROUP_INTERVAL,
            simultaneousSpeechContinuationInterval: SS_CONTINUATION_INTERVAL,
            simultaneousSpeechStartInterval: SS_START_INTERVAL,
        });
    };

    subscribe = callback => {
        this._callbacks.push(callback);

        return () => {
            const index = this._callbacks.indexOf(callback);
            if (index !== -1) {
                this._callbacks.splice(index, 1);
            }
        };
    };
}
