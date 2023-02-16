export class IndexStore {
    _indexByParticipantId: Map<
        string,
        {
            groupIndex: number;
            phraseIndex: number;
        }
    >;

    _indexByPhraseId: Map<
        string,
        {
            groupIndex: number;
            phraseIndex: number;
        }
    >;

    constructor() {
        this._indexByParticipantId = new Map();
        this._indexByPhraseId = new Map();
    }

    setTranscriptIndexes(phraseId: string, groupIndex: number, phraseIndex: number) {
        return this._indexByPhraseId.set(phraseId, { groupIndex, phraseIndex });
    }

    getTranscriptIndexesByPhraseId(phraseId: string) {
        return this._indexByPhraseId.get(phraseId);
    }

    deleteTranscriptIndexes(phraseId: string) {
        return this._indexByPhraseId.delete(phraseId);
    }

    setLastParticipantIndexes(participantId: string, groupIndex: number, phraseIndex: number) {
        return this._indexByParticipantId.set(participantId, {
            groupIndex,
            phraseIndex,
        });
    }

    getLastParticipantIndexes(participantId: string) {
        return this._indexByParticipantId.get(participantId);
    }

    deleteLastParticipantIndexes(participantId: string) {
        return this._indexByParticipantId.delete(participantId);
    }
}
