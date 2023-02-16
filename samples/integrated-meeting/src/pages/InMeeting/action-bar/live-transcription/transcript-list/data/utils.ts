import type { ILiveTranscription } from '@sdk';

export const FINALIZE_PHRASES_TIMEOUT = 5000;
export const SAME_PARTICIPANT_NEW_GROUP_INTERVAL = 5000;
export const SAME_PARTICIPANT_SOFT_LIMIT = 750;
export const SS_CONTINUATION_INTERVAL = 2000;
export const SS_START_INTERVAL = 1000;

export const isStartsWithDotOrComma = (string = '') => {
    const trimmedString = string.trim();
    return trimmedString.startsWith('.') || trimmedString.startsWith(',');
};

const isFinal = phrase => phrase.final;

const getParticipantId = phrase => phrase.phraseId.participantId;

const capitalizeFirstLetter = text => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const areNotAllPhrasesOfParticipantFinal = (participantId, transcript) => {
    return transcript.filter(p => getParticipantId(p) === participantId).every(p => !p.final);
};

const finalizePhrase = phrase => {
    return {
        ...phrase,
        final: true,
        text: addDot(capitalizeFirstLetter(phrase.text)),
    };
};

const getEndTime = ({ words }) => words[words.length - 1].endTime;

const isPhraseOld = phrase => Date.now() - getEndTime(phrase) > FINALIZE_PHRASES_TIMEOUT;

const addDot = text => `${text}.`;

export const finalizeOldPhrases = transcript => {
    return transcript.map((phrase, index, arr) => {
        if (
            isFinal(phrase) ||
            (areNotAllPhrasesOfParticipantFinal(getParticipantId(phrase), arr.slice(index)) &&
                !isPhraseOld(phrase))
        )
            return phrase;

        return finalizePhrase(phrase);
    });
};

export const finalizeAllGroupPhrases = groups => {
    return groups.map(group =>
        group.map(phrase => (isFinal(phrase) ? phrase : finalizePhrase(phrase)))
    );
};

export function isTranscriptionEmpty(phrase: ILiveTranscription) {
    return phrase.text.trim() === '';
}

export function getParticipantIdByPhraseId(phraseId: string) {
    const phraseIdList = phraseId.split('.');
    return phraseIdList[2];
}

export function getFirstAndLastTimestampsOfPhrase(phrase: ILiveTranscription) {
    const { words } = phrase;

    return {
        firstWordTime: words[0].startTime,
        lastWordTime: words[words.length - 1].endTime,
    };
}

export function getComparisonKeysByTranscript(transcription: ILiveTranscription) {
    const { firstWordTime, lastWordTime } = getFirstAndLastTimestampsOfPhrase(transcription);

    return {
        firstWordTime,
        lastWordTime,
        participantId: getParticipantIdByPhraseId(transcription.phraseId),
        text: transcription.text,
        language: transcription.currentLanguage,
    };
}

export function findLastParticipantIndexes(groups, phrase) {
    for (let a = groups.length - 1; a >= 0; --a) {
        const group = groups[a];

        for (let b = group.length - 1; b >= 0; --b) {
            const { participantId } = group[b].phraseId;

            if (participantId === phrase.phraseId.participantId) {
                return {
                    groupIndex: a,
                    phraseIndex: b,
                };
            }
        }
    }
    return null;
}

export function getAllGroupText(group) {
    return group.map(({ text }) => text).join(' ');
}

export function getComparisonKeysByGroup(group) {
    let firstWordTime;
    let lastWordTime;

    if (group.length === 1) {
        const firstPhraseTimestamp = getFirstAndLastTimestampsOfPhrase(group[0]);
        firstWordTime = firstPhraseTimestamp.firstWordTime;
        lastWordTime = firstPhraseTimestamp.lastWordTime;
    } else {
        const firstPhraseTimestamp = getFirstAndLastTimestampsOfPhrase(group[0]);
        const lastPhraseTimestamp = getFirstAndLastTimestampsOfPhrase(group[group.length - 1]);
        firstWordTime = firstPhraseTimestamp.firstWordTime;
        lastWordTime = lastPhraseTimestamp.lastWordTime;
    }

    return {
        firstWordTime,
        lastWordTime,
        participantId: getParticipantIdByPhraseId(group[0].phraseId),
        text: getAllGroupText(group),
        language: group[group.length - 1].currentLanguage,
    };
}

export function pushGroupToGroups(groups: ILiveTranscription[][], group: ILiveTranscription[]) {
    const groupsCopy = [...groups];
    groupsCopy.push(group);

    return groupsCopy;
}

export function updateGroupInGroups(
    groups: ILiveTranscription[][],
    groupIndex: number,
    newGroup: ILiveTranscription[]
) {
    const groupsCopy = [...groups];
    groupsCopy.splice(groupIndex, 1, newGroup);

    return groupsCopy;
}

export function pushTranscriptToGroup(
    groups: ILiveTranscription[][],
    groupIndex: number,
    transcript: ILiveTranscription
) {
    const newGroup = [...groups[groupIndex]];
    newGroup.push(transcript);

    return updateGroupInGroups(groups, groupIndex, newGroup);
}

export function updateTranscriptInGroups(
    groups: ILiveTranscription[][],
    groupIndex: number,
    transcriptIndex: number,
    transcript: ILiveTranscription
) {
    const groupCopy = [...groups[groupIndex]];
    groupCopy.splice(transcriptIndex, 1, transcript);

    return updateGroupInGroups(groups, groupIndex, groupCopy);
}

export function deleteTranscriptFromGroups(
    groups: ILiveTranscription[][],
    groupIndex: number,
    transcriptIndex: number
): ILiveTranscription[][] {
    if (groups[groupIndex].length === 1) {
        const res = [...groups];
        res.splice(groupIndex, 1);
        return res;
    } else {
        const res = [...groups];
        const groupAtIndex = [...groups[groupIndex]];

        groupAtIndex.splice(transcriptIndex, 1);
        res.splice(groupIndex, 1, groupAtIndex);

        return res;
    }
}
