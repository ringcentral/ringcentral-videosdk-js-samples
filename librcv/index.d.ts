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
    private _libsfuHelper;
    private _librctHelper;
    private readonly _streamManager;
    private readonly _initConfig;
    private _localStream;

    private get _librct();
    private get _sfu();
    private get _tapId();
    private _listenEvents;
    /**
     * Remove track on the sfu by tapId.
     * @param {string} tapId
     * @return {boolean}
     */
    private _stopSfuAudioTrackByTapId;
    private _mute;
    private _unmute;
    /**
     * Enable the audio session,create audio stream and publish.
     * @param {true | MediaTrackConstraints} spec parameters to create the Audio stream
     */
    enableAudio(spec: true | MediaTrackConstraints): Promise<ErrorCodeType>;
    /**
     * Disable the audio session, unpublish the audio stream.
     */
    disableAudio(): Promise<ErrorCodeType>;
    /**
     * Mute or unmute the local audio in meeting.
     * @param {boolean} mute true: mute; false: unmute
     */
    muteLocalAudioStream(mute: boolean): Promise<ErrorCodeType>;
    /**
     * Mute/unmute remote audio stream of a specified user (must have the host or moderator permission).
     * @param mute
     */
    muteRemoteAudioStream(uid: string, mute: boolean): Promise<void>;
    /**
     * Stops/Resumes subscribing to the audio stream of all users (must have the host or moderator permission).
     * @param mute
     */
    muteAllRemoteAudioStreams(mute: boolean): Promise<void>;
}

export declare class AudioDeviceManager extends DeviceManager<AudioDeviceManagerEvent> {
    private _audioForTest;
    constructor();
    /**
     * Listen and emit callback.
     * @return {void}
     */
    private _handleDeviceListChanged;
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

declare enum BridgeWaitingRoomMode {
    /** Nobody need go to waiting room */
    Nobody = 0,
    /** EveryBody need go to waiting room */
    EveryBody = 1,
    /** Guests need go to waiting room */
    GuestsOnly = 2,
    /** Other account need go to waiting room (Other account usually are other company.)*/
    OtherAccount = 3
}

export declare class ChatController extends EventEmitter<ChatEvent> {
    private _librctHelper;
    private _meetingProvider;
    private _messageUniqueMarker;
    private _publicChatId;
    private _broadcastChatId;
    private _privateChatIdMap;
    private _breakoutChatIdMap;
    constructor();
    private get _librct();
    private get _meeting();
    private _listenEvents;
    private _onChatMessages;
    private _handleMessage;
    private _handleChatId;
    private _isChatDisabled;
    private _getLocalParticipantId;
    private _getPrivateChatLocalId;
    private _getPublicChatId;
    private _sendMessage;
    /**
     * Returns the current chat privilege.
     * ChatPrivilege:
     *   - ChatPrivilege.EVERYONE (Default value)
     *   - ChatPrivilege.HOST_MODERATOR
     */
    getCurrentChatPrivilege(): ChatPrivilege;
    /**
     * Set the meeting chat privilege.
     */
    setChatPrivilege(privilege: ChatPrivilege): Promise<ErrorCodeType>;
    /**
     * Sends a message to a particular meeting user in an active meeting.
     */
    sendMessageToUser(uid: any, msg: any): Promise<ErrorCodeType>;
    /**
     * Sends a message to all meeting users in an active meeting.
     */
    sendMessageToAll(msg: any): Promise<ErrorCodeType>;
}

export declare enum ChatEvent {
    /** Occurs when a new chat message is received */
    CHAT_MESSAGE_RECEIVED = "chat-message-received"
}

export declare enum ChatPrivilege {
    /** Everyone can send the chat message  */
    EVERYONE = "everyone",
    /** Only the meeting host and moderator can send the chat message */
    HOST_MODERATOR = "host_moderator"
}

/**
 * @desc type of chatMessage
 */
export declare enum ChatType {
    /** Type of message sent to everyone. In group mode, only the current room can see/send the message.  */
    PUBLIC = "public",
    /** Type of message sent to a user. */
    PRIVATE = "private",

}

declare enum COMMON_SS_SOURCES {
    SCREEN = "screen",
    WINDOW = "window",
    TAB = "tab",
    AUDIO = "audio"
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
     * Subtype stream
     * 'screen' | 'window' | 'tab'
     */
    subtype?: string;
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
    deleted?: boolean;
}

declare enum ConferenceWaitingRoomMode {
    NO = "Nobody",
    EVERY = "EveryBody",
    GUEST = "GuestsOnly",
    OTHER = "OtherAccount"
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
    static safeGetDisplayMedia(constraints?: DisplayMediaStreamConstraints): Promise<MediaStream>;
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
    MEETING_STATE_CHANGED = "meeting-state-changed",
    /** Occurs when scheduling a meeting action is finished, error code is 0 means the action succeeds, otherwise means the action is failed. */
    MEETING_SCHEDULE = "meeting-schedule"
}

/**
 * The config option in RcvEngine constructor.
 */
export declare interface EngineInitConfig {
    /**
     * Used to identify that whether the current user is a guest, default false
     */
    isGuest?: boolean;
    /**
     * The fetch http client, or you need call setAuthToken() before call any Api.
     */
    httpClient?: HttpClient;
    /**
     * The server url for meeting.
     */
    origin?: string;
    /**
     * The server url for discovery.
     */
    discoveryServer?: string;
    /**
     * Enable discovery or disable, default is true.
     */
    enableDiscovery?: boolean;
    /**
     * The application account identity number.
     */
    clientId?: string;
    /**
     * The application account identity secret.
     */
    clientSecret?: string;
    /**
     * Enable vcg or disable, default is true.
     */
    enableVcg?: boolean;
}

/**
 * Global error code for RCV SDK
 */
export declare enum ErrorCodeType {
    /** Success. No error occurs. */
    ERR_OK = 0,
    /** A general error occurs (no specified reason determined). Try calling the method again. */
    ERR_FAILED = 1,
    /** An invalid argument is used. For instance, the specified meeting ID or user name includes illegal characters. Please check and reset the argument. */
    ERR_INVALID_ARGUMENT = 2,
    /** A required parameter is missed. */
    ERR_PARAMETER_MISS = 3,
    /** A specific function does not support by the client SDK. */
    ERR_FUNCTION_NOT_SUPPORTED = 4,
    /** A user does not have permission to invoke some specified APIs. For instance, an audience to invoke the lock meeting interface. */
    ERR_NO_PERMISSION = 5,
    /** The user is unauthorized. */
    ERR_UNAUTHORIZED = 6,
    /** The access token is expired. Normally, it happens when the automatic refresh auth token option is disabled. */
    ERR_AUTH_TOKEN_EXPIRED = 7,
    /** The access token is invalid.  */
    ERR_INVALID_AUTH_TOKEN = 8,
    /** The refresh token is expired and the application has to get the new auth token pair by invoking the authorization REST API. */
    ERR_REFRESH_TOKEN_EXPIRED = 9,
    /** TThe audio device access is denied, either the device is not ready or it has been occupied by other applications. */
    ERR_AUDIO_DEVICE_ACCESS_DENIED = 10,
    /** The video device access is denied, either the device is not ready or it has been occupied by other applications.  */
    ERR_VIDEO_DEVICE_ACCESS_DENIED = 11,
    /** No audio device was found and can be used.  */
    ERR_NO_AUDIO_DEVICE_AVAILABLE = 12,
    /** No video device was found and can be used..  */
    ERR_NO_VIDEO_DEVICE_AVAILABLE = 13,
    /** A specific request has been aborted due to too many requests. */
    ERR_REQUEST_ABORTED = 14,
    /** The application used too much of the system resources and the client SDK fails to allocate the resources. */
    ERR_RESOURCE_LIMITED = 15,
    /** The application does not have an available network that can be used to conduct a meeting request. */
    ERR_NO_NETWORK_CONNECTION = 16,
    /** The remote meeting server encounters an internal error. The retry may help. */
    ERR_SERVER_INTERNAL_ERROR = 17,
    /** The response includes some invalid data caused can not be parsed. The retry may help. */
    ERR_SERVER_INVALID_RESPONSE = 18,
    /** The remote meeting server can not be reached. The retry may help. */
    ERR_SERVER_UNREACHABLE = 19,
    /** Request to the remote meeting server has timed out. The retry may help. */
    ERR_SERVER_TIMEOUT = 20,
    /** A base error code for the meetings category. */
    ERR_MEETING_BASE = 10000,
    /** The meeting ID must be present when joining a meeting. */
    ERR_MEETING_ID_REQUIRED = 10001,
    /** The meeting ID includes illegal characters. */
    ERR_INVALID_MEETING_ID = 10002,
    /** Can not join the meeting due to a specified meeting ID is not found. */
    ERR_MEETING_NOT_FOUND = 10003,
    /** The user name must be present when joining a meeting as a guest user. */
    ERR_MEETING_USER_NAME_REQUIRED = 10004,
    /** The user name includes illegal characters. */
    ERR_INVALID_MEETING_USER_NAME = 10005,
    /** The meeting requires a password to join. */
    ERR_MEETING_PASSWORD_REQUIRED = 10006,
    /** The input password does not match the meeting password. The user needs to check it and try joining again. */
    ERR_INVALID_MEETING_PASSWORD = 10007,
    /** The application can not join a meeting as a guest due to the "Guest Type" is not granted. */
    ERR_GUEST_TYPE_NOT_GRANTED = 10008,
    /** The user has been denied to join the meeting. */
    ERR_JOIN_MEETING_DENIED = 10009,
    /** A specified meeting only allows the authorized user to join. */
    ERR_AUTHORIZED_USER_REQUIRED = 10010,
    /** A specified meeting only allows the authorized coworkers to join. */
    ERR_AUTHORIZED_COWORKER_REQUIRED = 10011,
    /** A specified meeting does not support joining before the host, waiting for the host to join first. */
    ERR_WAITING_FOR_HOST = 10012,
    /** The waiting room mode has been enabled by the meeting host, the user will join the meeting once the meeting host admits. */
    ERR_IN_WAITING_ROOM = 10013,
    /**
     * A specified meeting has been locked by the meeting host or moderator.
     * To continue to join this meeting, ask the meeting host or moderator to unlock the meeting first.
     * */
    ERR_MEETING_IS_LOCKED = 10014,
    /** A specified meeting has reached its capacity, a new user can not join this meeting. */
    ERR_MEETING_CAPACITY_IS_FULL = 10015,
    /** A specified user's concurrent meeting limit has been exceeded. To start or join a new meeting, users must leave or end an existing meeting. */
    ERR_CONCURRENT_MEETING_LIMIT_EXCEEDED = 10016,
    /** A base error code for the meeting user category.  */
    ERR_MEETING_USER_BASE = 11000,
    /** A base error code for the meeting chat category. */
    ERR_MEETING_CHAT_BASE = 12000,
    /** A base error code for the meeting recording category. */
    ERR_MEETING_RECORDING_BASE = 13000,
    /** A base error code for the meeting live-transcription category. */
    ERR_LIVE_TRANSCRIPTION_BASE = 14000,
    /** A base error code for the meeting closed captions category. */
    ERR_CLOSED_CAPTIONS_BASE = 15000,
    /** A base error code for the meeting breakout room category. */
    ERR_MEETING_BREAKOUT_BASE = 16000,
    /** A base error code for the meeting annotation category. */
    ERR_MEETING_ANNOTATION_BASE = 17000,
    /** A base error code for the audio category. */
    ERR_AUDIO_BASE = 30000,
    /** A base error code for the video category. */
    ERR_VIDEO_BASE = 50000,
    /** A base error code for the sharing category. */
    ERR_SHARING_BASE = 70000,
    /** The meeting sharing function has been locked by the meeting host or moderator, only the meeting host or moderator allows to start a new sharing session. */
    ERR_SHARING_IS_LOCKED = 70001
}

declare class EventEmitter<T extends string> {
    private _eventListeners;
    on(eventName: T, listener: TEventCB): TUnsubscribeFunction;
    off(eventName: T, listener: TEventCB): void;



}

export declare type HttpClient = {
    /**
     * send request
     * just the same as sdk.platform().send
     * for more information, pls check https://github.com/ringcentral/ringcentral-js/tree/master/sdk#api-calls
     * @param options
     */
    send(options: SendOptions): Promise<Response>;
};

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
    /** Password for this instant meeting, length is up to 10 */
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

declare interface IOptions_2 {
    recordings?: IRecording[];
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
     * @return attendee's network quality, @see NQIState
     */
    nqiStatus?: NQIState;
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
        waitingRoomRequired: ConferenceWaitingRoomMode;
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

export declare interface IRecording {
    id: string;
    started: boolean;
    paused?: boolean;
    startTime: string;
    recordingEvents: IRecordingEvent[];
}

export declare interface IRecordingEvent {
    type: RecordingEventType;
    initiator?: string;
    time: string;
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

export declare class MeetingContextController {
    private _existPersonalMeetingNames;
    private _freePhoneNumbers;

    constructor(librct: any);
    private _getPersonalBridge;
    private _getBridgeUpdatePromise;
    private _getMeetingInfo;
    private _getPersonalMeetingNames;
    private _getFreePhoneNumbers;
    /**
     * Schedules a meeting with customized meeting settings. A successful call of scheduleMeeting triggers the onMeetingSchedule callback.
     * @param {ScheduleMeetingSettings} params
     * @return {boolean}
     */
    scheduleMeeting(params: ScheduleMeetingSettings): Promise<ErrorCodeType>;
    /**
     * Load the personal meeting settings.
     */
    loadPersonalMeetingSettings(): Promise<PersonalMeetingSettings>;
    /**
     * Update the personal meeting settings and it will be applied to the next meeting.
     */
    updatePersonalMeetingSettings(personalMeetingSettings: PersonalMeetingSettings): Promise<void>;
}

/**
 * MeetingController is used to control the state in the meeting
 * such as switching recording and acquiring the video and audio controllers used to mute/unmute the video and audio of local and remote attendees.
 */
export declare class MeetingController extends EventEmitter<MeetingEvent> {
    private _libsfuHelper;
    private _librct;
    private _nqi;
    /**
     * internal
     */
    private _bridge;
    /**
     * internal
     */
    private _joinData;
    private _initConfig;
    private _userController?;
    private _audioController?;
    private _videoController?;
    private _sharingController?;
    private _recordingController;
    private _chatController;
    private _sfu?;
    private _streamManager;
    private _meetingProvider;
    get isWaitingRoomEnabled(): boolean;




    getAudioController(): AudioController | undefined;
    getStreamManager(): StreamManager;
    getVideoController(): VideoController | undefined;
    getSharingController(): SharingController | undefined;
    getRecordingController(): RecordingController;
    getUserController(): UserController | undefined;
    getChatController(): ChatController;
    /**
     * listen meeting change, trigger MeetingEvent
     */
    private _listenMeetingChanged;
    private get _meeting();
    /**
     * @Description: This function is used to get meeting information
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
}

export declare enum MeetingEvent {
    /** Occurs when the current host assigns the host role to another */
    MEETING_HOST_CHANGED = "meeting-host-changed",
    /** Occurs when the meeting lock state is changed */
    MEETING_LOCK_STATE_CHANGED = "meeting-lock-state-changed",
    /** Occurs when a meeting API request is executed */
    MEETING_API_EXECUTED = "meeting-api-executed",
    /** Reports the statistics of the local audio stream */
    LOCAL_AUDIO_STATS_REPORTED = "local-audio-stats-reported",
    /** Reports the statistics of the uploading local video stream */
    LOCAL_VIDEO_STATS_REPORTED = "local-video-stats-reported",
    /** Reports the statistics of the audio stream from each remote user */
    REMOTE_AUDIO_STATS_REPORTED = "remote-audio-stats-reported",
    /** Reports the statistics of the video stream from each remote user */
    REMOTE_VIDEO_STATS_REPORTED = "remote-video-stats-reported",
    /** Reports the network quality of the local user. */
    LOCAL_NETWORK_QUALITY = "local-network-quality",
    /** Reports the network quality of the remote user. */
    REMOTE_NETWORK_QUALITY = "remote-network-quality"
}

export declare interface MeetingOptions {
    /** The display name for participant */
    userName?: string;
    /** The password for joining the meeting*/
    password?: string;
}

export declare interface Message {
    /** User ID who sends message */
    from: string;
    /** User ID who receives message */
    to: string;
    timestamp: number;
    message: string;
    chatType: ChatType;
}

/** Indicates the network quality of the current meeting */
export declare enum NQIState {
    GOOD = "GOOD",
    MEDIUM = "MEDIUM",
    POOR = "POOR",
    DISCONNECT = "DISCONNECT",
    UNKNOWN = "UNKNOWN"
}

declare type Participant = Omit<IParticipant, 'nqiStatus'>;

export declare interface PersonalMeetingSettings {
    /** Configure whether users are allowed to join the meeting room before joining the meeting host, default true */
    allowJoinBeforeHost?: boolean;
    /** Force users to turn off audio when entering a meeting, default false*/
    muteAudio?: boolean;
    /** Force users to turn off video when entering a meeting, default true*/
    muteVideo?: boolean;
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
    /** Configure personal meeting id */
    shortId?: string;
    /** Configure personal meeting name */
    personalRoomName?: string;
    /** Get the code for participant to enter a meeting */
    participantCode?: string;
    /** Get the code for host to enter a meeting */
    hostCode?: string;
    /** Get dial-in number for users to enter the meeting */
    phoneNumber?: string;
    /** Get link for users to enter the meeting */
    link?: string;
}

/**
 * The main class of RCV SDK.
 */
export declare class RcvEngine extends EventEmitter<EngineEvent> {
    private static _instance;
    private _librctHelper;

    private readonly _config;
    private _audioDeviceManager;
    private _videoDeviceManager;
    private _meetingContextController;
    private _meetingController;
    /**
     * Creates an RcvEngine object and returns the instance.
     * @param config
     * @returns
     */
    static create(config?: EngineInitConfig): RcvEngine;
    /**
     * Returns the RcvEngine singleton instance.
     * @returns
     */
    static instance(): RcvEngine | undefined;
    private constructor();
    /**
     * Destroys the RcvEngine instance and releases all resources used by the RingCentral video client SDK.
     */
    destroy(): void;
    /**
     * Starts an instant meeting with default meeting settings.
     */
    startInstantMeeting(settings?: InstantMeetingSettings): Promise<MeetingController>;
    /**
     * Join an existing meeting with meeting ID
     * @param meetingId The ID of the meeting we want to join
     * @param options Setting options for meeting @see MeetingOptions
     */
    joinMeeting(meetingId: string, options?: MeetingOptions): Promise<MeetingController>;
    /**
     * Get a meeting controller with meeting ID, Meeting controller can be used to control the meeting status likes start/stop recording, get attendee list etc
     * note: You cannot get an available meeting controller until you successfully join the meeting
     * @return
     *  - not null Available meeting controller instance
     *  - null failure
     */
    getMeetingController(): MeetingController;
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
    getMeetingContextController(): MeetingContextController;
    private _clearManagers;
    /**
     * download logs from rcvEngine
     * @param levels download log levels
     */
    static downloadLogs(levels?: LogLevel[]): Promise<void>;
    /**
     * Set token pair string in the SDK.
     * @param tokenPair the access token and refresh token pair json.
     * @param autoRefresh If it's TRUE, the access token will be refreshed automatically once it expired.
     */
    setAuthToken(tokenPair: string, autoRefresh?: boolean): Promise<ErrorCodeType>;
    /**
     * Refreshes the auth token pair immediately. A successful call of renewAuthToken triggers the onAuthTokenRenew callback which includes the new token pair.
     * @param refreshToken optional, the refresh token string.
     */
    renewAuthToken(refreshToken?: string): Promise<ErrorCodeType>;
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

declare class RecordingController extends EventEmitter<RecordingEvent> {
    private _librctHelper;
    private _meetingProvider;
    private _recordings;
    constructor(options: IOptions_2);
    private _initialEventListener;
    private get _librct();
    private get _meeting();
    private _getRecording;
    private _getStartRecordEventIndex;
    private _getEndRecordEventIndexAndAutoTime;
    private _computeDurationTime;
    private _isRecordingStart;
    private _isRecordingPause;
    private _getCloudRecordingsEnabled;
    private _getIsE2EE;
    /**
     * Get current meeting recording state
     * @return RecordingStatus
     */
    getRecordingState(): RecordingStatus;
    /**
     * Indicates whether the meeting recording is allowed.
     * @returns boolean
     */
    isRecordingAllowed(): boolean;
    /**
     * Returns the current recording duration (seconds)
     * @returns number
     */
    getRecordingDuration(): number;
    /**
     * Starts/Resume the recording in an active meeting. Only the meeting host or moderator has permission to invoke this method.
     * This function conflicts with E2EE. Do not enable E2EE if recording is in progress.
     * If E2EE is enabled, do not start or unpause recording.
     * @return {Promise<ErrorCodeType>}
     */
    startRecording(): Promise<ErrorCodeType>;
    /**
     * Pause the recording of an active meeting.
     * Only the meeting host or moderator has permission to invoke this method.
     * @return {Promise<ErrorCodeType>}
     */
    pauseRecording(): Promise<ErrorCodeType>;
}

export declare enum RecordingEvent {
    /** Occurs when the meeting recording state is changed */
    RECORDING_STATE_CHANGED = "recording-state-changed"
}

declare enum RecordingEventType {
    RECORDING_START = "recordingStart",
    RECORDING_MANUAL_PAUSE_END = "recordingManualPauseEnd",
    RECORDING_MANUAL_PAUSE_START = "recordingManualPauseStart",
    RECORDING_PAUSE_START = "recordingPauseStart",
    RECORDING_PAUSE_END = "recordingPauseEnd",
    RECORDING_AUTO_PAUSE_START = "recordingAutoPauseStart",
    RECORDING_AUTO_PAUSE_END = "recordingAutoPauseEnd"
}

export declare interface ScheduleMeetingSettings extends Omit<InstantMeetingSettings, 'requirePassword'> {
    /** Use Personal Meeting */
    usePersonalMeetingId?: boolean;
    isMeetingSecret?: boolean;
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
    headers?: Record<string, string> | Headers;
    userAgent?: string;
    skipAuthCheck?: boolean;
    skipDiscoveryCheck?: boolean;
    handleRateLimit?: boolean | number;
    retry?: boolean;
    vcgSupported?: boolean;
};

export declare class SharingController extends EventEmitter<SharingEvent> {
    private _cachedMeeting;
    private _libsfuHelper;
    private _librctHelper;
    private _meetingProvider;
    private readonly _streamManager;
    private _currentSharingStream;
    private _curSharingStats;
    constructor();
    private get _librct();
    private get _sfu();
    /**
     * Check stream stats from sfu.
     */
    private _checkStatsIsBad;
    private get _tapId();
    private _initialEventListener;
    /**
     * Use newest localStreams to check if there exits new sharing stream, or current sharing stream is end.
     */
    private _checkEventForLocalStreams;
    /**
     * Use newest streams to check if there exists new sharing stream, or current sharing stream is end.
     */
    private _checkEventForStreams;
    private _onSharingSettingsChanged;
    private _currentSharingEnded;
    private _registerSfu;
    /**
     * Indicates whether the sharing is being locked. If TRUE, means only the host or moderator can start the sharing.
     * @returns boolean
     */
    isSharingLocked(): boolean;
    /**
     * Enable the sharing session,create sharing stream and publish
     * @param spec
     * @returns Promise<ErrorCodeType>
     */
    startSharing(spec?: DisplayMediaStreamConstraints): Promise<ErrorCodeType>;
    /**
     * Indicates whether local user is sharing.
     * @returns boolean
     */
    isLocalSharing(): boolean;
    /**
     * Indicates whether other user is sharing.
     * @returns boolean
     */
    isRemoteSharing(): boolean;
    /**
     * The host or moderator can use this function to lock/unlock the current meeting sharing.
     * If it is locked and a participant is sharing, then the present sharing will stop right away and participants unable to start the sharing again.
     * The host or moderator is still able to start the sharing.
     * @param locked
     * @returns Promise<ErrorCodeType>
     */
    lockSharing(locked: boolean): Promise<ErrorCodeType>;
    /**
     * Disable the sharing session, unpublish the sharing stream.
     * @return {Promise<ErrorCodeType>}
     */
    stopSharing(): Promise<ErrorCodeType>;
    /**
     * Stops the remote participant's sharing (must have the host or moderator permission).
     * @param {string} uid
     * @return {Promise<ErrorCodeType>}
     */
    stopRemoteSharing(uid: string): Promise<ErrorCodeType>;
}

export declare enum SharingEvent {
    /** Occurs when the meeting sharing settings is changed */
    SHARING_SETTINGS_CHANGED = "sharing-settings-changed",
    /** Occurs when the meeting sharing state is changed */
    SHARING_STATE_CHANGED = "sharing-state-changed",
    /** Occurs when the meeting sharing user is changed */
    SHARING_USER_CHANGED = "sharing-user-changed"
}

/**
 * Indicates the sharing state of the current meeting
 */
export declare enum SharingState {
    /**Occurs when self sharing is begin. */
    SELF_SHARING_BEGIN = 0,
    /**Occurs when self sharing is end. */
    SELF_SHARING_END = 1,
    /**Occurs when others sharing is begin. */
    OTHER_SHARING_BEGIN = 2,
    /**Occurs when others sharing is end. */
    OTHER_SHARING_END = 3,
    /**Occurs when current sharing is paused. */
    SHARING_PAUSED = 4,
    /**Occurs when current sharing is resumed. */
    SHARING_RESUMED = 5
}

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
    private _librctHelper;
    private _localStreams;
    private _remoteStreams;
    private _tapIdStreamMap;
    private get _librct();
    private _eventQueueSet;


    /**
     * @description
     * @param stream {MediaStream}
     * @private
     */
    private static _getStreamSplitTracks;
    private _deleteTapIdStreamMap;
    private _addTapIdStreamMap;
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
    /** librct conference event handler start **/
    private _handleConferenceStreamChanged;
    private _handleConferenceLocalStreamChanged;
    /** librct conference event handler end **/
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
    getRemoteStreamByTapId(tapId: string): Partial<IStream> | null;
    getRemoteStreamBySessionId(sessionId: string): Partial<IStream> | null;
    getLocalStreamByTapId(tapId: string): Partial<IStream> | null;
    getLocalStreams(): Partial<IStream>[];
    getLocalActiveStreamInSFU(): Partial<IStream> | undefined;
    /**
     * Used for 'video/screensharing' stream
     * @param stream
     * @returns
     */
    static getSubtypeByStream(stream: any): void | COMMON_SS_SOURCES;
}

export declare enum StreamType {
    VIDEO_MAIN = "video/main",
    VIDEO_SCREENSHARING = "video/screensharing"
}

export declare type TEventCB = (...args: any[]) => void;

export declare type TUnsubscribeFunction = () => void;

/**
 * The class to control participants of the current meetings
 */
export declare class UserController extends EventEmitter<UserEvent> {
    private _libsfuHelper;
    private _librctHelper;
    private _cachedLocalParticipant;
    private _cachedRemoteParticipants;
    private _streamManager;

    private get _librct();
    private get _sfu();
    private _initRemoteParticipants;
    private _init;
    private _getRemoteStreams;
    private _reportStats;
    private _reportLoudestStream;
    private _handleModeratorActions;
    private _getLocalParticipant;
    private _getRemoteParticipants;
    private _handleLocalStreamChanges;
    private _handleStreamChanges;
    private _handleRemoteParticipantsChanged;
    private _handleLocalParticipantChanged;

    /**
     * Get the meeting user object list of an active meeting.
     * @returns Map<string, IParticipant participant>
     */
    getMeetingUsers(): Record<string, Participant>;
    /**
     * Get a particular meeting user object by id.
     * @param uid
     * @returns IParticipant | undefined
     */
    getMeetingUserById(uid: string): Participant | undefined;
    /**
     * Get the current meeting user object
     * @returns IParticipant
     */
    getMyself(): Participant;
    /**
     * Assign moderator role to the meeting user(s).
     * Only the meeting host or moderator has permission to invoke this method.
     */
    assignModerators(uids: string[]): Promise<ErrorCodeType>;
    /**
     * Revokes moderator role from the meeting user(s).
     * Only the meeting host or moderator has permission to invoke this method.
     */
    revokeModerators(uids: string[]): Promise<ErrorCodeType>;
    /**
     * Removes a particular meeting user from an active meeting.
     * Only the meeting host or moderator has permission to invoke this method.
     * @param uid
     */
    removeUser(uid: string): Promise<void>;
    /**
     * Admits a particular user into the meeting.
     * Only the meeting host or moderator has permission to invoke this method.
     * @param uid {string}
     */
    admitUser(uid: string): Promise<ErrorCodeType>;
    /**
     * Admits all users who are currently in the waiting room into the meeting.
     * Only the meeting host or moderator has permission to invoke this method.
     */
    admitAll(): Promise<ErrorCodeType>;
    /**
     * Deny a user in the waiting room from joining the meeting.
     * Only the meeting host or moderator has permission to invoke this method.
     * @param uid {string}
     */
    denyUser(uid: string): Promise<ErrorCodeType>;
    /**
     * Removes a particular meeting user from the current meeting session and puts this user in the waiting room.
     * Only the meeting host or moderator has permission to invoke this method.
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
    USER_LEFT = "user-left",
    /**Occurs when a user role has changed, such as, user assigned to moderator. */
    USER_ROLE_CHANGED = "user-role-changed",
    /**Occurs when the active video user is changed. */
    ACTIVE_VIDEO_USER_CHANGED = "active-video-user-changed",
    /**Occurs when the active speaker user is changed. */
    ACTIVE_SPEAKER_USER_CHANGED = "active-speaker-user-changed"
}

export declare class VideoController extends EventEmitter<VideoEvent> {
    private _libsfuHelper;
    private _librctHelper;
    private readonly _streamManager;
    private _tapId;
    private _forPreviewStream;
    private _videoEnabled;

    private get _librct();
    private get _sfu();
    private _participantChangeHandler;
    /**
     * Enable video
     * @return Promise<Number>
     */
    private _enableVideo;
    /**
     * disable video, both remote and local video stream will be stopped.
     * @return Promise<Number>
     */
    private _disableVideo;
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
    private _handleLocalVideoMuteChanged;
    private _handleRemoteVideoMuteChanged;
    /**
     * Starts the local video preview before sending out.
     * @param constraints
     */
    startPreview(constraints: boolean | MediaTrackConstraints): Promise<MediaStream>;
    /**
     * Stop the local video preview.
     */
    stopPreview(): Promise<void>;
    /**
     * Starts/Stops publishing the local video stream.
     * @param {boolean} mute
     * @param {MediaTrackConstraints} options
     * @return Promise<ErrorCodeType>
     */
    muteLocalVideoStream(mute: boolean, options?: MediaTrackConstraints): Promise<ErrorCodeType>;
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
    /** When you open the waiting room, everyone will enter the waiting room first and wait for the host's permission to enter the meeting */
    EVERYONE = 0,
    /** When you open the waiting room, not logged in user will enter the waiting room first and wait for the host's permission to enter the meeting */
    NOT_AUTH_USER = 1,
    /** When you open the waiting room, not coworkers will enter the waiting room first and wait for the host's permission to enter the meeting */
    NOT_COWORKERS = 2
}

declare enum WaitingRoomStatus {
    DENIED = "0",
    ALLOW = "1",
    WAITING = "2",
    LEFT = "3"
}

export { }