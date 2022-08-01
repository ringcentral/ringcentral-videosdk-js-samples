import { IStream } from '@sdk';

export enum TrackType {
    VIDEO = 'video',
    AUDIO = 'audio',
}

/**
 *
 * @param stream {MediaStream}
 * @param type {TrackType}
 * @param container {Element}
 * @description sink stream to element add append into container
 */
export const sinkStreamElement = (
    stream: IStream,
    type: TrackType,
    container: HTMLDivElement | Element
): void => {
    if (!container) return;
    unSinkStreamElement(stream, container);
    const mediaElement = document.createElement(type);
    container.appendChild(mediaElement);
    mediaElement.autoplay = true;
    mediaElement.muted = false;
    if (type === TrackType.VIDEO) {
        mediaElement.muted = true;
        mediaElement.style.cssText = 'width: 100%; height:100%; object-fit: contain;';
    }
    mediaElement.id = stream.id;
    mediaElement.srcObject = stream.stream as unknown as MediaStream;
};

export const unSinkStreamElement = (stream: IStream, container: HTMLDivElement | Element) => {
    if (!container) return;
    const mediaElement = document.getElementById(stream.id) as HTMLAudioElement | HTMLVideoElement;
    if (mediaElement) {
        mediaElement.srcObject = null;
        container.removeChild(mediaElement);
    }
};
