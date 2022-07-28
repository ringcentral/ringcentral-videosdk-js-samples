import { IStream } from '@sdk';
import { TrackType, StreamType } from '../utils/constants'


export const sinkStreamElement = (
    stream: IStream,
    type: TrackType,
    container: HTMLDivElement | Element
): void => {
    if (!container) return;
    unSinkStreamElement(stream, container);
    const mediaElement = document.createElement(type);
    if (stream.type === StreamType.VIDEO_SCREENSHARING) {
        const h1 = document.createElement('h1');
        h1.innerText = 'SCREEN SHARING';
        h1.id = StreamType.VIDEO_SCREENSHARING;
        container.appendChild(h1);
    }
    container.appendChild(mediaElement);
    mediaElement.autoplay = true;
    mediaElement.muted = false;
    if (type === TrackType.VIDEO) {
        mediaElement.muted = true;
        mediaElement.style.cssText =
            'width: 100%; height:100%; object-fit: contain; position: absolute;';
    }
    mediaElement.id = stream.id;
    mediaElement.srcObject = stream.stream as unknown as MediaStream;
};

export const unSinkStreamElement = (stream: IStream, container: HTMLDivElement | Element) => {
    if (!container) return;
    const mediaElement = document.getElementById(stream.id) as HTMLAudioElement | HTMLVideoElement;
    if (stream.type === StreamType.VIDEO_SCREENSHARING) {
        const h1 = document.getElementById(StreamType.VIDEO_SCREENSHARING) as HTMLElement;
        if (h1) container.removeChild(h1);
    }
    if (mediaElement) {
        mediaElement.srcObject = null;
        container.removeChild(mediaElement);
    }
};