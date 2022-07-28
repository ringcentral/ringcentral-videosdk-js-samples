import { ControlClient } from 'libsfu';
import Librct from 'librct';

/** Indicates the status of the current attendee */
export declare enum AttendeeStatus {
    /** Not started */
    IDLE = 0,
    /** The attendee is disconnected from server */
    DISCONNECTED = 1,
    /** The remote attendee didn't accept the video call and the call timed out */
    NO_ANSWER = 2,
    /** The remote attendee rejected the video call */
    REJECTED = 3,
    /** Stop to call the remote attendee */
    CANCELED = 4,
    /** The remote attendee hasn't accepted the video, but it hasn't timed out yet */
    RINGING = 5,
    /** The attendee joined meeting */
    ACTIVE = 6,
    /** The attendee is in waiting room */
    IN_WAITING_ROOM = 7,
    /** The attendee is joining waiting room */
    WAITING_ROOM_JOINING = 8,
    /** The attendee left meeting */
    INVISIBLE = 9
}

export declare class AudioController extends EventEmitter<AudioEvent> {
    private readonly _sfu;
    private readonly _librct;
    private readonly _initConfig;
    private _streamManager;
    private _localStream;

    private _listenEvents;
    private get _tapId();
    /**
     * Remove track on the sfu by tapId.
     * @param {string} tapId
     * @return {boolean}
     */
    private _stopSfuAudioTrackByTapId;
    /**
     * Enable audio in meetings.
     * @param {true | MediaTrackConstraints} spec parameters to create the Audio stream
     */
    enableAudio(spec: true | MediaTrackConstraints): Promise<ErrorCodeType>;
    /**
     * Disable audio in meetings.
     */
    disableAudio(): Promise<ErrorCodeType>;
    /**
     * Mute or unmute the local audio in meeting.
     * @param {boolean} mute true: mute; false: unmute
     */
    muteLocalAudioStream(mute: boolean): Promise<ErrorCodeType>;
    private _mute;
    private _unmute;
    /**
     * The meeting hosts or moderators can invoke the API to mute/unmute the particular participant's audio.
     * @param mute
     */
    muteRemoteAudioStream(uid: string, mute: boolean): Promise<void>;
    /**
     * The meeting hosts or moderators can invoke the API to mute/unmute  all participant's audio.
     * @param mute
     */
    muteAllRemoteAudioStreams(mute: boolean): Promise<void>;
}

export declare class AudioDeviceManager extends DeviceManager<AudioDeviceManagerEvent> {
    private _removeDeviceListChangedListener;
    private _audioForTest;
    constructor();
    /**
     * Listen and emit callback.
     * @return {void}
     */
    private _handleDeviceListChanged;
    /**
     * Clear away side effect.
     * @return {void}
     */
    clear(): void;
    /**
     * Get all audio devices.
     * Whether to skip the permission check. If you set this parameter as true, the SDK does not trigger the request for media device permission.
     * In this case, the retrieved media device information may be inaccurate
     * @param {boolean} skipPermissionCheck true | false, default false.
     * true: Skip the permission check.
     * false: (Default) Do not skip the permission check.
     * @return {Promise<MediaDeviceInfo[]>}
     */
    enumerateAudioDevices(skipPermissionCheck?: boolean): Promise<MediaDeviceInfo[]>;
    /**
     * Get all audio playback devices.
     * The device list cannot be returned in Firefox.
     * @param {boolean} skipPermissionCheck true | false, default false.
     * @return Promise<MediaDeviceInfo[]>
     */
    enumeratePlaybackDevices(skipPermissionCheck?: boolean): Promise<MediaDeviceInfo[]>;
    /**
     * Get all audio recording devices.
     * @param {boolean} skipPermissionCheck true | false, default false.
     * @return Promise<MediaDeviceInfo[]>
     */
    enumerateRecordingDevices(skipPermissionCheck?: boolean): Promise<MediaDeviceInfo[]>;
    /**
     * Starts the audio playback device test
     * Ensure the user have interacted with the document first.
     * @param url
     */
    startPlaybackDeviceTest(url: string): Promise<void>;
    /**
     * Stops the audio playback device test.
     */
    stopPlaybackDeviceTest(): void;
    /**
     * @return stream Promise<MediaStream>
     * @description
     */
    startRecordingDeviceTest(): Promise<MediaStream>;
    stopRecordingDeviceTest(): void;
    /**
     * @description Sets the device for recording audio.
     * @param {string} deviceId The ID of the specified device. You can get the deviceId by calling enumerateRecordingDevices.
     * @return Promise<void>
     */
    setRecordingDevice(deviceId: string): Promise<void>;
}

/**
 * @desc events about AudioDeviceManager
 */
export declare enum AudioDeviceManagerEvent {
    /** Occurs when the recording device list updated */
    RECORDING_DEVICE_LIST_UPDATED = "recording-device-list-updated",
    /** Occurs when the playback device list updated */
    PLAYBACK_DEVICE_LIST_UPDATED = "playback-device-list-updated",
    /** Occurs when the current recording device changed */
    RECORDING_DEVICE_CHANGED = "recording-device-changed"
}

/**
 * @desc events about AudioController
 */
export declare enum AudioEvent {
    /** Occurs when the local audio state changes. */
    LOCAL_AUDIO_MUTE_CHANGED = "local-audio-mute-changed",
    /** Occurs when the remote audio mute changes. */
    REMOTE_AUDIO_MUTE_CHANGED = "remote-audio-mute-changed",
    /** Occurs when the host or moderator wants you to unmute your audio. This is a demand request, the app can decide whether to unmute. */
    AUDIO_UNMUTE_DEMAND = "audio-unmute-demand"
}

/**
 * The stream object type in conference streams
 * @ignore
 */
export declare interface ConferenceStream {
    /**
     * TapId for stream
     */
    id: string;
    /**
     * [isActiveIn] - The activity flag of the client inbound connection from the media server.
     * [isActiveOut] - The activity flag of the client outbound connection from the media server.;
     */
    audio: {
        isActiveIn: boolean;
        isActiveOut: boolean;
    };
    /**
     * Participant id
     */
    participantId: string;
    /**
     * Session id
     */
    sessionId: string;
    /**
     * The conference start time (when the very first session is attached to a meeting, or both participants of a call are joined)
     */
    startTime: string;
    /**
     * Type stream
     * "video/main" | "video/screensharing" | "video/whiteboard" | "audio/main"
     */
    type: string;
    /**
     * [isActiveIn] - The activity flag of the client inbound connection from the media server.
     * [isActiveOut] - The activity flag of the client outbound connection from the media server.;
     */
    video: {
        isActiveIn: boolean;
        isActiveOut: boolean;
    };
    /**
     * Array<"annotations" | "rdc">|"annotations" | "rdc"
     * A list of client-side features implemented for this stream. Also you can change possible enum values via service configuration;
     */
    features: [];
    /**
     * Flag for session is inactive
     */
    isSessionInactive: boolean;
    /**
     * Code user client agent. Pattern: project&#x2F;client&#x2F;version. Example: rcv&#x2F;web&#x2F;1.1
     */
    userAgent: string | null;
    /**
     * Whether the stream is inactive
     */
    deleted: boolean;
}

declare class DeviceManager<T extends string> extends EventEmitter<T> {
    protected _currentDeviceId: string | undefined;
    protected _forTestStream: MediaStream | null;
    private static _handleDeviceListChanged;
    private _cachedDevices;
    constructor();
    /**
     * Listen devicechange emit callback.
     * @return {void}
     */
    private _updateDeviceList;
    /**
     * Clear away side effect.
     * @return {void}
     */
    static clear(): void;
    /**
     * Prompts the user for permission to use a media input which produces a MediaStream with tracks containing the requested types of media.
     * @return {MediaStream}
     */
    static safeGetUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
    /**
     * @param constraints: {MediaStreamConstraints}
     * @description A compatibility static method to request system api for ask device permission
     */
    protected static _safeRequestPermission(constraints: MediaStreamConstraints): Promise<void>;
    /**
     * @description A compatibility static method to call system api for enumerate device
     */
    protected static _safeEnumerateDevices(): Promise<MediaDeviceInfo[]>;
    /**
     * @param mediaInfos : {MediaDeviceInfo[]}
     * @protected
     * @description Filter camera device
     */
    protected _gotCameras(mediaInfos: MediaDeviceInfo[]): Promise<MediaDeviceInfo[]>;
    /**
     * @param {MediaDeviceInfo[]} devices
     * @param {MediaStreamConstraints} constraints Declare the type of device that needs to be obtained
     * @return {boolean}
     */
    private static _checkMediaDeviceAvailabilities;
    /**
     * @param {boolean} skipPermissionCheck true | false, default false.
     * true: Skip the permission check.
     * false: (Default) Do not skip the permission check.
     * @param {MediaStreamConstraints} constraints Declare the type of device that needs to be obtained
     * @return Promise<MediaDeviceInfo[]>
     */
    protected static _enumerateDevices(skipPermissionCheck: boolean | undefined, constraints: MediaStreamConstraints): Promise<MediaDeviceInfo[]>;
    /**
     * @description replace stream track
     * @param {MediaStream} originStream
     * @param {MediaStream} targetStream
     */
    static replaceStreamTrack(originStream: MediaStream, targetStream: MediaStream): void;
}

export declare enum EngineEvent {
    /**Occurs when joining a meeting action is finished, error code is 0 means the action succeeds, otherwise means the action is failed.*/
    MEETING_JOINED = "meeting-joined",
    /**Occurs when leaving a meeting action is finished, error code is 0 means the action succeeds, otherwise means the action is failed.*/
    MEETING_LEFT = "meeting-left",
    /**Occurs when the meeting state is changed. */
    MEETING_STATE_CHANGED = "meeting-state-changed"
}

/**
 * The config option in RcvEngine constructor.
 */
export declare interface EngineInitConfig {
    /**
     * Used to identify that whether the current user is a guest, default false
     */
    isGuest?: boolean;
}

/** Global error code for RCV SDK */
export declare enum ErrorCodeType {
    /** No Errors */
    ERR_OK = 0,
    /** A general error occurs (no specified reason). */
    ERR_FAILED = 1,
    /** An invalid parameter is used. For example, the specific meeting ID includes illegal characters. */
    ERR_INVALID_ARGUMENT = 2,
    /**
     * The SDK module is not ready. Possible solutions:
     * - Check the audio device.
     * - Check the completeness of the application.
     * - Re-initialize the RCV engine.
     */
    ERR_NOT_READY = 3,
    /** The SDK does not support this function. */
    ERR_NOT_SUPPORTED = 4,
    /** The request is rejected. */
    ERR_REFUSED = 5,
    /** The SDK is not initialized before calling this method. */
    ERR_NOT_INITIALIZED = 6,
    /** No permission exists. Check if the user has granted access to the audio or video device. */
    ERR_NO_PERMISSION = 7,
    /**
     * The request to join the meeting is rejected.
     * - This error usually occurs when the user is already in the meeting, and still calls the method to join the meeting, for example, INativeEngine::joinMeeting
     * - The user tries to join the meeting with a token that is expired.
     */
    ERR_JOIN_MEETING_REJECTED = 8,
    /**
     * The request to leave the meeting is rejected.
     * This error usually occurs:
     * - When the user has left the meeting and still calls INativeEngine::leaveMeeting to leave the meeting. In this case, stop calling INativeEngine::leaveMeeting.
     * - When the user has not joined the meeting and still calls INativeEngine::leaveMeeting to leave the meeting. In this case, no extra operation is needed.
     */
    ERR_LEAVE_MEETING_REJECTED = 9,
    /** The SDK gives up the request due to too many requests. */
    ERR_ABORTED = 10,
    /** The application uses too much of the system resources and the SDK fails to allocate the resources. */
    ERR_RESOURCE_LIMITED = 11,
    /** The specified meeting ID is invalid. Please try to rejoin the meeting with a valid meeting ID. */
    ERR_INVALID_MEETING_ID = 12,
    /**
     * The token expired due to one of the following reasons:
     * - Authorized Timestamp expired: The timestamp is represented by the number of seconds elapsed since 1/1/1970. The user can use the Token to access the RCV SDK within 24 hours after the Token is generated. If the user does not access the RCV SDK after 24 hours, this Token is no longer valid.
     */
    ERR_TOKEN_EXPIRED = 13,
    /**
     * The token is invalid due to one of the following reasons:
     * - The App Certificate for the project is enabled in Console, but the user is still using the App ID. Once the App Certificate is enabled, the user must use a token.
     * - The uid is mandatory, and users must set the same uid as the one set in the INativeEngine::joinMeeting method.
     */
    ERR_INVALID_TOKEN = 14,
    /** SDK internal error */
    ERR_INTERNAL_ERROR = 15,
    /** You're making a transition between breakout rooms */
    ERR_BREAKOUT_ROOM_TRANSITION = 18,
    /** The user is unauthorized */
    ERROR_UNAUTHORIZED = 20,
    /** The meeting doesn't support guest to join */
    ERROR_GUEST_TYPE_NOT_GRANTED = 21,
    /** Only authorized users could join meeting*/
    ERROR_AUTHORIZED_USER_REQUIRED = 22,
    /** Only authorized co-workers could join meeting*/
    ERROR_AUTHORIZED_COWORKER_REQUIRED = 23,
    /** The meeting is not found*/
    ERROR_MEETING_NOT_FOUND = 24,
    /** The meeting requires password for joining */
    ERROR_MEETING_PASSWORD_REQUIRED = 25,
    /** The provided password is invalid for this meeting */
    ERROR_MEETING_PASSWORD_INVALID = 26,
    /** The user joined meeting is move to waiting room*/
    ERROR_IN_WAITING_ROOM = 27,
    /** The user is denied for joining this meeting.*/
    ERROR_JOIN_MEETING_DENIED = 28,
    /**Waiting host join first */
    ERROR_WAITING_FOR_HOST = 29,
    /** The meeting has locked */
    ERROR_MEETING_HAS_LOCKED = 30,
    /** The meeting capacity is full */
    ERROR_MEETING_CAPACITY_IS_FULL = 31,
    /** The user hit the simultaneous meeting limit */
    ERROR_EXCEEDED_CONCURRENT_MAX_COUNT = 32,
    /** The device is disabled by the browser or the user has denied permission of using the device */
    ERR_PERMISSION_DENIED = 33,
    /** The specified capture device cannot be found. */
    ERR_DEVICE_NOT_FOUND = 34
}

declare class EventEmitter<T extends string> {
    private _eventListeners;
    on(eventName: T, listener: TEventCB): TUnsubscribeFunction;
    off(eventName: T, listener: TEventCB): void;

    once(eventName: T, listener: TEventCB): void;
    removeAllListeners(): void;
}

export declare type HttpClient = {
    /**
     * origin of http client
     */
    origin: string;
    /**
     * send request
     * just the same as sdk.platform().send
     * for more information, pls check https://github.com/ringcentral/ringcentral-js/tree/master/sdk#api-calls
     * @param options
     */
    send(options: SendOptions): Promise<Response>;
};

declare interface IAccountInfo {
    uri?: string;
    accountId?: string;
    extensionId?: string;
    displayName?: string;
    type?: string;
    regionalSettings?: IRegionalSettings;
}

export declare interface IBridge {
    /** Unique bridge identifier */
    id: string;
    host: IHost;
    pins: IPins;
    security: ISecurity;
    discovery: IDiscovery;
    preferences: IPreferences;
}

/**
 * @interface ICountry
 */
export declare interface ICountry {
    id: string;
    name: string;
    isoCode: string;
    callingCode: string;
}

/**
 * @interface IDialInfo
 */
export declare interface IDialInfo {
    phoneNumber: string;
    location: string;
    password?: string;
    accessCode: string;
    country: ICountry;
}

declare interface IDiscovery {
    /** URI that can be used to join to the meeting */
    web: string;
}

declare interface IHomeCountry {
    uri: string;
    id: string;
    name: string;
    isoCode: string;
    callingCode: string;
}

/**
 * @interface IHost
 * @property {string} [accountId]
 * @property {string} [extensionId]
 */
declare interface IHost {
    accountId: string;
    extensionId: string;
}

/**
 * MeetingController.getMeetingInfo() response interface
 */
export declare interface IMeetingInfo {
    /**
     *  Meeting name
     */
    meetingName: string;
    /**
     *  Meeting host name example: John Doe
     */
    hostName: string;
    /**
     *  Unique meeting id
     */
    meetingId: string;
    /**
     * Meeting password
     */
    meetingPassword?: IPassword;
    /**
     *  Meeting link url
     */
    meetingLink: string;
    /**
     * Array of dial information
     */
    dialInfo: Array<IDialInfo>;
    /**
     * Sip information for users to access meeting
     */
    sip?: ISip;
}

export declare interface InstantMeetingSettings {
    /** Meeting name for this instant meeting */
    meetingName: string;
    /** Configure whether users are allowed to join the meeting room before joining the meeting host, default true */
    allowJoinBeforeHost?: boolean;
    /** Force users to turn off audio when entering a meeting, default false*/
    muteAudioForParticipant?: boolean;
    /** Force users to turn off video when entering a meeting, default true*/
    muteVideoForParticipant?: boolean;
    /** Configure whether users are allowed to join the meeting room before joining the meeting host, default true */
    requirePassword?: boolean;
    /** Password for this instant meeting */
    meetingPassword?: string;
    /** Configure whether to turn on waiting room for this meeting , default is false*/
    isWaitingRoomEnabled?: boolean;
    /** The waiting room mode*/
    waitingRoomMode?: WaitingRoomMode;
    /** Configure whether to allow users other than host/moderator to share the screen, default is true */
    allowScreenSharing?: boolean;
    /** Configure that only logged in users can join the meeting, default is false */
    onlyAuthUserCanJoin?: boolean;
    /** Configure that only coworkers can join the meeting, default is false */
    onlyCoworkersCanJoin?: boolean;
    /** Enable End-to-End Encryption for meeting .(e2ee feature land in the future , so is forced to false)*/
    enableE2ee?: boolean;
}

/**
 * model of participant in UserController
 */
export declare interface IParticipant {
    /**
     * The unique ID to identify the attendee in the meeting
     * @return The unique ID of attendee
     */
    uid: string;
    /**
     * The display name of the attendee in the meeting
     * @return The display name of the attendee
     */
    displayName: string;
    /**
     * The status of the attendee in the meeting
     * @return The status of the attendee
     */
    status: AttendeeStatus;
    /**
     * Used to identify whether the attendee is local user
     * @return
     * - true, it's local attendee
     * - false, it's remote attendee
     */
    isMe: boolean;
    /**
     * Used to identify whether the attendee is the meeting host
     * @return
     * - true, local attendee is the meeting host
     * - false, remote attendee is the meeting host
     */
    isHost: boolean;
    /**
     * Used to identify whether the attendee is the meeting moderator
     * @return
     * - true, local attendee is the meeting moderator
     * - false, remote attendee is the meeting moderator
     */
    isModerator: boolean;
    /**
     * Used to identify the video status of attendee
     * @return
     * - true, attendee's video is muted
     * - false, attendee's video is unmuted
     */
    isVideoMuted: boolean;
    /**
     * Used to identify the audio status of attendee
     * @return
     * - true, attendee's audio is muted
     * - false, attendee's audio is unmuted
     */
    isAudioMuted: boolean;
    /**
     * Used to identify whether the attendee is currently speaking
     * @return
     * - true, attendee is speaking
     * - false, attendee is silent
     */
    isSpeaking: boolean;
    /**
     * Used to identify whether the attendee is sharing screen
     * @return
     * - true, attendee is sharing the screen
     * - false, attendee isn't sharing the screen
     */
    isScreenSharing: boolean;
    /**
     * Used to identify whether the attendee left the meeting
     * @return
     * - true, attendee has left the meeting
     * - false, attendee is in meeting
     */
    isDeleted: boolean;
    /**
     * Indicate the network quality of attendee
     * @return attendee's network quality, @see NqiStatus
     */
    nqiStatus: NqiStatus;
    /**
     * Used to identify whether the attendee joined the audio
     * @return
     * - true, audio is enabled
     * - false, audio is disabled
     */
    isAudioJoined: boolean;
}

export declare interface IPassword {
    /**
     *  Meeting password.
     */
    plainText: string;
    /**
     *  Meeting password for PSTN users.
     */
    pstn: string;
    /**
     *  eeting password hash
     */
    joinQuery: string;
}

declare interface IPins {
    pstn: IPstn;
    /**
     * Bridge short identifier (Web PIN)
     */
    web: string;
}

declare interface IPreferences {
    join: {
        audioMuted: boolean;
        videoMuted: boolean;
        waitingRoomRequired: WaitingRoomMode;
        pstn: {
            promptAnnouncement: boolean;
            promptParticipants: boolean;
        };
    };
    joinBeforeHost: boolean;
    musicOnHold: boolean;
    playTones: string;
    recordingsMode: string;
    screenSharing: boolean;
    transcriptionsMode: string;
}

declare interface IPstn {
    /** Host PSTN PIN. If it is not specified while creation, then a PIN will be generated. */
    host: string;
    /** Participant PSTN PIN. If it is not specified while creation, then a PIN will be generated. */
    participant: string;
}

export declare interface IRegionalSettings {
    homeCountry: IHomeCountry;
}

declare interface ISecurity {
    passwordProtected: boolean;
    password?: IPassword;
    /**If true, only authenticated users can join to a meeting. */
    noGuests: boolean;
    /**If true, only users have the same account can join to a meeting. */
    sameAccount: boolean;
    e2ee?: boolean;
}

/**
 * @interface ISip
 */
export declare interface ISip {
    password?: string;
    url: string;
}

export declare interface IStream extends ConferenceStream {
    /**
     * Real MediaStream for participant
     */
    stream?: MediaStream;
}

/**
 * Indicates the reason  of leaving the current meeting
 */
export declare enum LeaveReason {
    /** Host or moderator ends the meeting. */
    END_BY_HOST = 0,
    /** Meeting ends for SDK disconnects. */
    END_BY_SDK_CONNECTION_BROKEN = 1,
    /** User leaves meeting */
    END_BY_SELF = 2,
    /** Meeting ends when the maximum duration (24 hours) is over.*/
    END_FOR_EXCEED_MAX_DURATION = 3,
    /** Meeting ends for there is no attendee comes in. */
    END_FOR_NO_ATTENDEE = 4,
    /** Remove from the meeting by host or moderator */
    REMOVE_BY_HOST = 5
}

/**
 * log level of rwc logs
 */
export declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}

export declare enum MediaStatus {
    MUTE = "mute",
    UNMUTE = "unmute"
}

/**
 * MeetingController is used to control the state in the meeting
 * such as switching recording and acquiring the video and audio controllers used to mute/unmute the video and audio of local and remote attendees.
 */
export declare class MeetingController extends EventEmitter<MeetingEvent> {
    private readonly _librct;
    /**
     * internal
     */
    private readonly _account;
    /**
     * internal
     */
    private readonly _bridge;
    /**
     * internal
     */
    private readonly _joinData;
    private readonly _initConfig;
    private readonly _userController;
    private _audioController?;
    private _videoController?;
    private _sfu?;
    private _streamManager?;
    get isWaitingRoomEnabled(): boolean;

    init(): Promise<void>;
    protected createLibSfu(): Promise<any>;
    getAudioController(): AudioController | undefined;
    getStreamManager(): StreamManager | undefined;
    getVideoController(): VideoController | undefined;
    /**
     * listen meeting change, trigger MeetingEvent
     */
    private listenMeetingChanged;
    /**
     * @Description: This function is used to get meeting information
     * @tech-sol https://wiki.ringcentral.com/display/VMT/%5BSol%5D+Get+Meeting+Info
     * @return Promise<IMeetingInfo>
     */
    getMeetingInfo(): Promise<IMeetingInfo>;
    /**
     * End Call for a meeting
     */
    endMeeting(): Promise<ErrorCodeType>;
    /**
     * Lock or unlock meetings.
     * @param {boolean} lock true: lock; false: unlock
     */
    lockMeeting(lock: boolean): Promise<ErrorCodeType>;
    /**
     * Indicates whether the meeting is locked.
     * @return {boolean} true: lock; false: unlock
     */
    isMeetingLocked(): boolean;
    /**
     * Leaves a meeting
     */
    leaveMeeting(): Promise<ErrorCodeType>;
    getUserController(): UserController;
}

export declare enum MeetingEvent {
    /** Occurs when a new user joins a meeting */
    USER_JOINED = "user-joined",
    /** Occurs when a user's state changed */
    USER_UPDATED = "user-updated",
    /** Occurs when a user leaves or disconnects from a meeting */
    USER_LEFT = "user-left",
    /** Occurs when the meeting recording state is changed */
    RECORDING_STATE_CHANGED = "recording-state-changed",
    /** Occurs when the current host assigns the host role to another */
    MEETING_HOST_CHANGED = "meeting-host-changed",
    /** Occurs when a new chat message is received */
    CHAT_MESSAGE_RECEIVED = "chat-message-received",
    /** Occurs when the meeting lock state is changed */
    MEETING_LOCK_STATE_CHANGED = "meeting-lock-state-changed",
    /** Occurs when the meeting sharing state is changed */
    SHARING_STATE_CHANGED = "sharing-state-changed",
    /** Occurs when the meeting sharing user is changed */
    SHARING_USER_CHANGED = "sharing-user-changed",
    /** Occurs when the meeting sharing settings is changed */
    SHARING_SETTINGS_CHANGED = "sharing-settings-changed",
    /** Occurs when a meeting API request is executed */
    MEETING_API_EXECUTED = "meeting-api-executed",
    /** Reports the statistics of the local audio stream */
    LOCAL_AUDIO_STATS_REPORTED = "local-audio-stats-reported",
    /** Reports the statistics of the uploading local video stream */
    LOCAL_VIDEO_STATS_REPORTED = "local-video-stats-reported",
    /** Reports the statistics of the audio stream from each remote user */
    REMOTE_AUDIO_STATS_REPORTED = "remote-audio-stats-reported",
    /** Reports the statistics of the video stream from each remote user */
    REMOTE_VIDEO_STATS_REPORTED = "remote-video-stats-reported"
}

export declare interface MeetingOptions {
    /** The display name for participant */
    userName?: string;
    /** The password for joining the meeting*/
    password?: string;
}

/** Indicates the network quality of the current meeting */
export declare enum NqiStatus {
    /**
     * current network is disconnected
     */
    DISCONNECTED = 0,
    /**
     * current network quality is poor
     */
    POOR = 1,
    /**
     * current network quality is medium
     */
    MEDIUM = 2,
    /**
     * current network quality is good
     */
    GOOD = 3,
    /**
     * current network quality is unknown
     */
    UNKNOWN = 4,
    /**
     * current network quality is stable
     */
    STABLE = 5
}

/**
 * The main class of RCV SDK.
 */
export declare class RcvEngine extends EventEmitter<EngineEvent> {

    private _meetingController;
    private readonly _config;
    private readonly _httpClient;
    private _audioDeviceManager;
    private _videoDeviceManager;
    constructor(httpClient: HttpClient, config?: EngineInitConfig);
    /**
     * Destroy the SDK resources
     * note: Once you call `destroy` to destroy the created `INativeEngine` instance, you cannot use any method or callback in the SDK any more.
     * @return
     *  - true success
     *  - false failure
     */
    destroy(): boolean;
    /**
     * Starts an instant meeting with default meeting settings.
     */
    startInstantMeeting(settings?: InstantMeetingSettings): Promise<MeetingController>;
    /**
     * Join an existing meeting with meeting ID
     * @param meetingId The ID of the meeting we want to join
     * @param options Setting options for meeting @see MeetingOptions
     */
    joinMeeting(meetingId: string, options: MeetingOptions): Promise<MeetingController>;
    /**
     * Get a meeting controller with meeting ID, Meeting controller can be used to control the meeting status likes start/stop recording, get attendee list etc
     * note: You cannot get an available meeting controller until you successfully join the meeting
     * @return
     *  - not null Available meeting controller instance
     *  - null failure
     */
    getMeetingController(): MeetingController | null;
    /**
     * Get current token is guest or authorized user.
     */
    private _isGuestMode;
    private _createMeetingController;

    /**
     * When leaves a meeting all meeting data need be reset.
     */
    private _resetMeetingData;
    /**
     * Common join action function ,used in joinMeeting or startInstantMeeting
     */
    private _joinAction;
    getAudioDeviceManager(): AudioDeviceManager;
    getVideoDeviceManager(): VideoDeviceManager;
    private _clearManagerEffect;
    /**
     * download logs from rcvEngine
     * @param levels download log levels
     */
    static downloadLogs(levels?: LogLevel[]): Promise<void>;
}

/**
 * Indicates the state of the current meeting
 */
export declare enum RcvMeetingState {
    /**Connecting meeting*/
    MEETING_STATE_CONNECTING = 0,
    /**Disconnecting */
    MEETING_STATE_DISCONNECTING = 1,
    /**Get meeting state failed */
    MEETING_STATE_FAILED = 2,
    /**User is moved to waiting room */
    MEETING_STATE_IN_WAITING_ROOM = 3,
    /**User is move to meeting from waiting room */
    MEETING_STATE_IN_MEETING = 4,
    /**Reconnecting */
    MEETING_STATE_RECONNECTING = 5,
    /**Wait for host join first */
    MEETING_STATE_WAITING_FOR_HOST = 6,
    /**Unknown */
    MEETING_STATE_UNKNOWN = 7,
    /**The meeting is locked */
    MEETING_STATE_LOCKED = 8
}

/**
 * options of http client send method
 */
export declare type SendOptions = {
    /**
     * url of send request
     */
    url: string;
    /**
     * body of request
     */
    body?: string | object;
    /**
     * method of request, 'GET' | 'POST', default 'GET'
     */
    method?: string;
    /**
     * query of request
     */
    query?: object;
    /**
     * headers of request
     */
    headers?: object;
    userAgent?: string;
    skipAuthCheck?: boolean;
    skipDiscoveryCheck?: boolean;
    handleRateLimit?: boolean | number;
    retry?: boolean;
};

/**
 * @desc events about StreamManager
 */
export declare enum StreamEvent {
    /** Occurs when the local audio stream removed. */
    LOCAL_AUDIO_TRACK_REMOVED = "local-audio-track-removed",
    /** Occurs when the local audio stream added. */
    LOCAL_AUDIO_TRACK_ADDED = "local-audio-track-added",
    /** Occurs when the local video stream removed. */
    LOCAL_VIDEO_TRACK_REMOVED = "local-video-track-removed",
    /** Occurs when the local video stream added. */
    LOCAL_VIDEO_TRACK_ADDED = "local-video-track-added",
    /** Occurs when the remote audio stream removed. */
    REMOTE_AUDIO_TRACK_REMOVED = "remote-audio-track-removed",
    /** Occurs when the remote audio stream added. */
    REMOTE_AUDIO_TRACK_ADDED = "remote-audio-track-added",
    /** Occurs when the remote video stream removed. */
    REMOTE_VIDEO_TRACK_REMOVED = "remote-video-track-removed",
    /** Occurs when the remote video stream added. */
    REMOTE_VIDEO_TRACK_ADDED = "remote-video-track-added"
}

export declare class StreamManager extends EventEmitter<StreamEvent> {
    private _sfu;
    private _librct;
    private _localStreams;
    private _remoteStreams;
    private _tapIdStreamMap;

    /**
     * @description
     * @param stream {MediaStream}
     * @private
     */
    private static _getStreamSplitTracks;
    private _deleteTapIdStreamMapForRemote;
    private _initialEventListener;
    /** wrapped emit start **/
    private _emitLocalVideoTrackAdded;
    private _emitLocalAudioTrackAdded;
    private _emitLocalVideoTrackRemoved;
    private _emitLocalAudioTrackRemoved;
    private _emitRemoteVideoTrackAdded;
    private _emitRemoteAudioTrackAdded;
    private _emitRemoteVideoTrackRemoved;
    private _emitRemoteAudioTrackRemoved;
    /** wrapped emit end **/
    /** conference event handler start **/
    private _handleConferenceStreamChanged;
    /** conference event handler end **/
    /** sfu event handler start **/
    /**
     *
     * @param stream {MediaStream}
     * @param msid {string} MediaStream.id
     * @param tapId {string}
     * @param isMixedAudio {boolean}
     * @private
     * @description ControlClient.event.REMOTE_STREAM_ADDED Event Handler
     */
    private _handleRemoteStreamAdded;
    /**
     *
     * @param stream {MediaStream}
     * @param streamId {string}
     * @param tapId {string}
     * @private
     * @description ControlClient.event.REMOTE_STREAM_REMOVED Event Handler
     */
    private _handleRemoteStreamRemoved;
    /**
     *
     * @param type {string} Event type
     * @param stream {MediaStream}
     * @param msid {string} MediaStream.id
     * @param tapId {string}
     * @private
     * @description ControlClient.event.LOCAL_STREAM_ADDED & ControlClient.event.LOCAL_STREAM_REPLACED Event Handler
     * @description Because when first addLocalStream the stream maybe have no video track and user will not sink
     * element so there will always emit add event let user sink stream into element.
     */
    private _handleLocalStreamChanged;
    /**
     *
     * @param stream {MediaStream}
     * @param streamId {string}
     * @param tapId {string}
     * @private
     */
    private _handleLocalStreamRemoved;
    private _handleRemoteStreamReplaced;
    /** sfu event handler end **/
    getLocalStreamByTapId(tapId: string): IStream | null;
    getLocalStreams(): IStream[];
}

export declare type TEventCB = (...args: any[]) => void;

export declare type TUnsubscribeFunction = () => void;

/**
 * The class to control participants of the current meetings
 */
export declare class UserController extends EventEmitter<UserEvent> {
    private readonly _librct;
    private _cachedLocalParticipant;
    private _cachedRemoteParticipants;

    getMeetingUsers(): Record<string, IParticipant>;
    getMeetingUserById(uid: string): IParticipant | undefined;
    getMyself(): IParticipant;
    assignModerator(participantId: string): Promise<ErrorCodeType>;
    revokeModerator(participantId: string): Promise<ErrorCodeType>;
    private _getLocalParticipant;
    private _getRemoteParticipants;
    private _handleRemoteParticipantsChanged;
    private _handleLocalParticipantChanged;
    isMySelfHostOrModerator(): boolean;
    removeUser(uid: string): Promise<void>;
    /**
     * Admit user in waiting room to meeting.
     * @param uid {string}
     */
    admitUser(uid: string): Promise<ErrorCodeType>;
    /**
     * Admits all users who are currently in the waiting room into the meeting .
     */
    admitAllUser(): Promise<ErrorCodeType>;
    /**
     * Deny user in waiting room to meeting.
     * @param uid {string}
     */
    denyUser(uid: string): Promise<ErrorCodeType>;
    /**
     * Put in-meeting user in waiting room
     * @param uid {string}
     */
    putUserInWaitingRoom(uid: string): Promise<ErrorCodeType>;

}

export declare enum UserEvent {
    /** Occurs when a new user joins a meeting */
    USER_JOINED = "user-joined",
    /** Occurs when a user's state changed */
    USER_UPDATED = "user-updated",
    /** Occurs when a user leaves or disconnects from a meeting */
    USER_LEFT = "user-left"
}

export declare class VideoController extends EventEmitter<VideoEvent> {
    private readonly _sfu;
    private readonly _librct;
    private readonly _streamManager;
    private _localStream;
    private _tapId;
    private _forPreviewStream;

    private _participantChangeHandler;
    /**
     * Starts/Stops publishing the local video stream.(muteLocalVideoStream)
     * @param {boolean} mute
     * @param {MediaTrackConstraints} options
     * @return Promise<boolean>
     */
    muteLocalVideoStream(mute: boolean, options?: MediaTrackConstraints): Promise<ErrorCodeType>;
    /**
     * Enable video
     * @param {MediaTrackConstraints} options
     * @return Promise<Number>
     */
    enableVideo(options?: MediaTrackConstraints): Promise<ErrorCodeType>;
    /**
     * disable video, both remote and local video stream will be stopped.
     * @return Promise<Number>
     */
    disableVideo(): Promise<ErrorCodeType>;
    /**
     * Clear useless video tracks in sfu
     */
    private _stopSfuVideoTrack;
    private _unmuteLocalVideoStream;
    private _muteLocalVideoStream;
    private _registerStateUpdate;
    private _registerUserAction;
    private _getLocalActiveStreamInSFU;
    private _getLocalParticipant;
    private _listenEvents;
    /**
     * Starts the local video preview.
     * @param constraints
     */
    startPreview(constraints: boolean | MediaTrackConstraints): Promise<MediaStream>;
    /**
     * Stop the local video preview.
     */
    stopPreview(): Promise<void>;
    /**
     * Stops/Resumes subscribing to the video stream of a specified user (must have the host or moderator permission).
     * @param uid
     * @param mute
     */
    muteRemoteVideoStream(uid: string, mute: boolean): Promise<void>;
    /**
     * Stops/Resumes subscribing to the video stream of all users (must have the host or moderator permission).
     * @param mute
     */
    muteAllRemoteVideoStreams(mute: boolean): Promise<void>;
    private _handleLocalVideoMuteChanged;
    private _handleRemoteVideoMuteChanged;
}

/**
 * @Description: VideoDeviceManager
 * @author Lynch Ye
 * @date 2022/5/6
 */
export declare class VideoDeviceManager extends DeviceManager<VideoDeviceManagerEvent> {
    constructor();
    private _handleDeviceListChanged;
    /**
     * Clear away side effect.
     * @return {void}
     */
    clear(): void;
    /**
     * Get the device info by deviceId
     */
    private _getDeviceInfo;
    /**
     * @param skipPermissionCheck
     * @description Api enumerateVideoDevices
     * @return Promise<MediaDeviceInfo[]>
     */
    enumerateVideoDevices(skipPermissionCheck?: boolean): Promise<MediaDeviceInfo[]>;
    /**
     * @description If video element doesn't set autoPlay attr, need to be play() manual
     * @return Promise<MediaStream>
     */
    startVideoDeviceTest(): Promise<MediaStream>;
    /**
     * @description Stop video test stream
     * @return void
     */
    stopVideoDeviceTest(): void;
    /**
     * @param deviceId Device id for video test
     * @return void
     */
    setVideoDevice(deviceId: string): Promise<void>;
    /**
     * @return Promise<MediaDeviceInfo>
     */
    getVideoDevice(): Promise<MediaDeviceInfo>;
}

/**
 * @desc events about VideoDeviceManager
 */
export declare enum VideoDeviceManagerEvent {
    /** Occurs when the camera device list updated */
    VIDEO_DEVICE_LIST_UPDATED = "video-device-list-updated",
    /** Occurs when the current camera device changed */
    VIDEO_DEVICE_CHANGED = "video-device-changed"
}

/**
 * @desc events about VideoController
 */
export declare enum VideoEvent {
    /** Occurs when the local video state changes. */
    LOCAL_VIDEO_MUTE_CHANGED = "local-video-mute-changed",
    /** Occurs when the remote video mute changes. */
    REMOTE_VIDEO_MUTE_CHANGED = "remote-video-mute-changed",
    /** Occurs when the host or moderator wants you to unmute your video. This is a demand request, the app can decide whether to unmute. */
    VIDEO_UNMUTE_DEMAND = "video-unmute-demand"
}

export declare enum WaitingRoomMode {
    NO = "Nobody",
    EVERY = "EveryBody",
    GUEST = "GuestsOnly",
    OTHER = "OtherAccount"
}

export { }
