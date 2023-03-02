import type { ILiveTranscription } from '@ringcentral/video-sdk';

import { IndexStore } from './index-store';
import {
    deleteTranscriptFromGroups,
    findLastParticipantIndexes,
    getComparisonKeysByGroup,
    getComparisonKeysByTranscript,
    getParticipantIdByPhraseId,
    isStartsWithDotOrComma,
    isTranscriptionEmpty,
    pushGroupToGroups,
    pushTranscriptToGroup,
    SAME_PARTICIPANT_SOFT_LIMIT,
    updateTranscriptInGroups,
} from './utils';

// The code groups the transcript by parameters
// example
// Input data: [{ ..., text: "Hello" }, { ..., text: "World"}, ...]
// Output data: [[{ ..., text: "Hello" }, { ..., text: "World" }], ...]
export class Grouping {
    _sameParticipantNewGroupInterval: number;
    _simultaneousSpeechStartInterval: number;
    _simultaneousSpeechContinuationInterval: number;
    _sameParticipantSoftLimit: number;
    _indexStore: IndexStore;

    constructor({
        sameParticipantNewGroupInterval,
        simultaneousSpeechStartInterval,
        simultaneousSpeechContinuationInterval,
        sameParticipantSoftLimit = SAME_PARTICIPANT_SOFT_LIMIT,
    }) {
        this._sameParticipantNewGroupInterval = sameParticipantNewGroupInterval;
        this._simultaneousSpeechStartInterval = simultaneousSpeechStartInterval;
        this._simultaneousSpeechContinuationInterval = simultaneousSpeechContinuationInterval;
        this._sameParticipantSoftLimit = sameParticipantSoftLimit;
        this._indexStore = new IndexStore();
    }

    _getTranscriptIndex(transcript: ILiveTranscription) {
        return this._indexStore.getTranscriptIndexesByPhraseId(transcript.phraseId);
    }

    _getLastParticipantIndexes(transcript: ILiveTranscription) {
        return this._indexStore.getLastParticipantIndexes(
            getParticipantIdByPhraseId(transcript.phraseId)
        );
    }

    _setLastParticipantIndexes(
        transcript: ILiveTranscription,
        groupIndex: number,
        phraseIndex: number
    ) {
        return this._indexStore.setLastParticipantIndexes(
            getParticipantIdByPhraseId(transcript.phraseId),
            groupIndex,
            phraseIndex
        );
    }

    _setTranscriptIndexes(transcript: ILiveTranscription, groupIndex: number, phraseIndex: number) {
        return this._indexStore.setTranscriptIndexes(transcript.phraseId, groupIndex, phraseIndex);
    }

    _deleteIndexes(transcript: ILiveTranscription) {
        this._indexStore.deleteLastParticipantIndexes(
            getParticipantIdByPhraseId(transcript.phraseId)
        );
        this._indexStore.deleteTranscriptIndexes(transcript.phraseId);
    }

    _isTranscriptInGroups(transcript: ILiveTranscription) {
        return !!this._getTranscriptIndex(transcript);
    }

    _isParticipantInGroups(transcript: ILiveTranscription) {
        return !!this._getLastParticipantIndexes(transcript);
    }

    _getLastGroup(groups) {
        return groups[groups.length - 1];
    }

    _getLastParticipantGroup(groups: ILiveTranscription[][], transcript: ILiveTranscription) {
        const res = this._getLastParticipantIndexes(transcript);
        if (res) {
            const { groupIndex } = res;
            return groups[groupIndex];
        }
        return null;
    }

    _sameParticipantHasSplitting(lastGroupKeys, participantGroupKeys, currentPhraseKeys) {
        const fullText = `${participantGroupKeys.text} ${currentPhraseKeys.text}`;
        const splittingByInterval =
            currentPhraseKeys.firstWordTime - lastGroupKeys.lastWordTime >
            this._sameParticipantNewGroupInterval;
        const splittingBySoftLimit = fullText.length > this._sameParticipantSoftLimit;
        const isLanguageChanged = currentPhraseKeys.language !== lastGroupKeys.language;
        return isLanguageChanged || splittingByInterval || splittingBySoftLimit;
    }

    _groupHasUpdating(groups, phrase) {
        // Workaround to prevent message grouping on resume event.
        if (phrase.text.startsWith('...')) return false;
        if (isStartsWithDotOrComma(phrase.text)) return true;

        const currentPhraseKeys = getComparisonKeysByTranscript(phrase);
        const lastGroupKeys = getComparisonKeysByGroup(this._getLastGroup(groups));
        const participantGroupKeys = getComparisonKeysByGroup(
            this._getLastParticipantGroup(groups, phrase)
        );

        if (currentPhraseKeys.participantId === lastGroupKeys.participantId) {
            return !this._sameParticipantHasSplitting(
                lastGroupKeys,
                participantGroupKeys,
                currentPhraseKeys
            );
        }

        if (
            currentPhraseKeys.firstWordTime - participantGroupKeys.lastWordTime >
            this._simultaneousSpeechContinuationInterval
        ) {
            return false;
        }

        return (
            lastGroupKeys.language === participantGroupKeys.language &&
            lastGroupKeys.firstWordTime - participantGroupKeys.firstWordTime <
                this._simultaneousSpeechStartInterval &&
            currentPhraseKeys.firstWordTime - lastGroupKeys.lastWordTime <
                this._simultaneousSpeechContinuationInterval
        );
    }

    _getLastIndexOfPhrase(groups, groupIndex) {
        return groups[groupIndex].length - 1;
    }

    addTranscript(groups: ILiveTranscription[][], transcript: ILiveTranscription) {
        // if transcript is empty
        if (isTranscriptionEmpty(transcript)) {
            // it should delete the same-phrase-id trasctiption when current transcript is empty
            if (this._isTranscriptInGroups(transcript)) {
                const res = this._getTranscriptIndex(transcript);
                if (res) {
                    const { groupIndex, phraseIndex } = res;
                    const newGroups = deleteTranscriptFromGroups(groups, groupIndex, phraseIndex);

                    this._deleteIndexes(transcript);
                    const lastParticipantIndex = findLastParticipantIndexes(newGroups, transcript);

                    if (lastParticipantIndex) {
                        const { groupIndex, phraseIndex } = lastParticipantIndex;
                        this._setLastParticipantIndexes(transcript, groupIndex, phraseIndex);
                    }

                    return newGroups;
                }
            }

            return groups;
        }
        // if transcript is not empty and
        // it should update the same-phrase-id trasctiption
        if (this._isTranscriptInGroups(transcript)) {
            const res = this._getTranscriptIndex(transcript);
            if (res) {
                const { groupIndex, phraseIndex } = res;
                return updateTranscriptInGroups(groups, groupIndex, phraseIndex, transcript);
            }
        }
        // if transcript is not empty and
        // it should add append a new trasctiption by same-participant-id in existed group
        if (this._isParticipantInGroups(transcript) && this._groupHasUpdating(groups, transcript)) {
            const res = this._getLastParticipantIndexes(transcript);
            if (res) {
                const { groupIndex } = res;
                const nextGroups = pushTranscriptToGroup(groups, groupIndex, transcript);
                const phraseIndex = this._getLastIndexOfPhrase(nextGroups, groupIndex);

                this._setLastParticipantIndexes(transcript, groupIndex, phraseIndex);
                this._setTranscriptIndexes(transcript, groupIndex, phraseIndex);

                return nextGroups;
            }
        }

        // if transcript is not empty and
        // it should add a new trasctiption group
        const nextGroups = pushGroupToGroups(groups, [transcript]);
        const groupIndex = nextGroups.length - 1;
        const phraseIndex = this._getLastIndexOfPhrase(nextGroups, groupIndex);

        this._setLastParticipantIndexes(transcript, groupIndex, phraseIndex);
        this._setTranscriptIndexes(transcript, groupIndex, phraseIndex);

        return nextGroups;
    }

    addGroupedTranscript(groups: ILiveTranscription[][], groupedTranscript: ILiveTranscription) {
        // if transcript is not empty and
        // it should update the same-phrase-id trasctiption
        if (this._isTranscriptInGroups(groupedTranscript)) {
            const res = this._getTranscriptIndex(groupedTranscript);
            if (res) {
                const { groupIndex, phraseIndex } = res;
                return updateTranscriptInGroups(groups, groupIndex, phraseIndex, groupedTranscript);
            }
        }

        // if transcript is not empty and
        // it should add a new trasctiption group
        const nextGroups = pushGroupToGroups(groups, [groupedTranscript]);
        const groupIndex = nextGroups.length - 1;
        const phraseIndex = this._getLastIndexOfPhrase(nextGroups, groupIndex);

        this._setLastParticipantIndexes(groupedTranscript, groupIndex, phraseIndex);
        this._setTranscriptIndexes(groupedTranscript, groupIndex, phraseIndex);

        return nextGroups;
    }

    createGroupsByTranscriptList(transcriptList: ILiveTranscription[]) {
        this._indexStore = new IndexStore();
        let groups: ILiveTranscription[][] = [];
        for (const transcript of transcriptList) {
            groups = this.addTranscript(groups, transcript);
        }
        return groups;
    }

    createGroupsByGroupedTranscriptList(transcriptList: ILiveTranscription[]) {
        this._indexStore = new IndexStore();
        let groups: ILiveTranscription[][] = [];
        for (const transcript of transcriptList) {
            groups = this.addGroupedTranscript(groups, transcript);
        }
        return groups;
    }
}
