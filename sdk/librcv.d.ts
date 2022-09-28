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

/**
 * The AudioController class is a managing class to control the audio-related functions and states in an active meeting session, such as mute or unmute local or remote audio.
 */
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
     * Enables the audio session.
     * @param {true | MediaTrackConstraints} spec parameters to create the Audio stream
     * @returns 0 means the API call is valid or fails otherwise
     */
    enableAudio(spec: true | MediaTrackConstraints): Promise<ErrorCodeType>;
    /**
     * Disables the audio session.
     * @returns 0 means the API call is valid or fails otherwise
     */
    disableAudio(): Promise<ErrorCodeType>;
    /**
     * Stops or resumes publishing the local audio stream.
     * @decription A successful call of muteLocalAudioStream triggers the {@link AudioEvent.LOCAL_AUDIO_MUTE_CHANGED} event callback to the local user.
     * @param {boolean} mute Sets whether to stop publishing the local audio stream. True means stop publishing, false means resume publishing
     * @returns 0 means the API call is valid or fails otherwise
     */
    muteLocalAudioStream(mute: boolean): Promise<ErrorCodeType>;
    /**
     * Stops or resumes subscribing to the audio stream of a remote user.
     * @description A successful call of muteRemoteAudioStream triggers the {@link AudioEvent.REMOTE_AUDIO_MUTE_CHANGED} event callback to the specified remote user.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {string} uid The unique id of the specified remote user
     * @param {boolean} mute Sets whether to stop subscribing to the audio stream. True means stop subscribing, false means resume subscribing
     * @returns 0 means the API call is valid or fails otherwise
     */
    muteRemoteAudioStream(uid: string, mute: boolean): Promise<ErrorCodeType>;
    /**
     * Stops or resumes subscribing to the audio stream of all meeting users.
     * @description A successful call of muteAllRemoteAudioStreams triggers the {@link AudioEvent.REMOTE_AUDIO_MUTE_CHANGED} event callback to all remote users.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {boolean} mute Sets whether to stop subscribing to the audio stream. True means stop subscribing, false means resume subscribing
     * @returns 0 means the API call is valid or fails otherwise
     */
    muteAllRemoteAudioStreams(mute: boolean): Promise<ErrorCodeType>;
}

/**
 * The AudioDeviceManager class is a managing class to manage the audio devices and test them out.
 */
export declare class AudioDeviceManager extends DeviceManager<AudioDeviceManagerEvent> {
    private _audioForTest;
    constructor();
    /**
     * Listen and emit callback.
     */
    private _handleDeviceListChanged;
    /**
     * Get all audio devices.
     * Whether to skip the permission check. If you set this parameter as true, the SDK does not trigger the request for media device permission.
     * In this case, the retrieved media device information may be inaccurate
     * @param {boolean} skipPermissionCheck true | false, default false.
     * true: Skip the permission check.
     * false: (Default) Do not skip the permission check.
     */
    private _enumerateAudioDevices;
    /**
     * Enumerates the audio playback devices.
     * @param {boolean} skipPermissionCheck true | false, default false.
     * @return The audio playback device list
     */
    enumeratePlaybackDevices(skipPermissionCheck?: boolean): Promise<MediaDeviceInfo[]>;
    /**
     * Enumerates the audio recording devices.
     * @param {boolean} skipPermissionCheck true | false, default false.
     * @return The audio recording device list
     */
    enumerateRecordingDevices(skipPermissionCheck?: boolean): Promise<MediaDeviceInfo[]>;
    /**
     * Starts the audio playback device test.
     * @description A successful call of startPlaybackDeviceTest triggers playing an audio file specified by the user. If the user can hear the voice that means the playback device works properly.
     * @param {string} audioFilePath The path of the audio file for the audio playback device test
     * @return 0 means success or fails otherwise
     */
    startPlaybackDeviceTest(audioFilePath: string): Promise<ErrorCodeType>;
    /**
     * Stops the audio playback device test.
     * @return  0 means success or fails otherwise
     */
    stopPlaybackDeviceTest(): ErrorCodeType;
    /**
     * Starts the audio capturing device test. This method tests whether the audio capturing device works properly.
     * @return The audio media stream or fails otherwise
     */
    startRecordingDeviceTest(): Promise<ErrorCodeType | MediaStream>;
    /**
     * Stops the camera test.
     * @return 0 means success or fails otherwise
     */
    stopRecordingDeviceTest(): ErrorCodeType;
    /**
     * Sets the current audio recording device by the device id.
     * @description A successful call of setRecordingDevice triggers the {@link DeviceEvent.RECORDING_DEVICE_CHANGED} event notification.
     * @param {string} deviceId The unique id of the audio recording device
     * @return 0 means success or fails otherwise
     */
    setRecordingDevice(deviceId: string): Promise<ErrorCodeType>;
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

/**
 * The ChatController class is a managing class to control the in-meeting chat related functions and states in an active meeting.
 */
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
     * Gets the current chat privilege.
     * @returns The current chat privilege
     */
    getCurrentChatPrivilege(): ChatPrivilege;
    /**
     * Sets the meeting chat privilege.
     * @param {ChatPrivilege} privilege The privilege of the meeting chat
     * @returns 0 means the API call is valid or fails otherwise
     */
    setChatPrivilege(privilege: ChatPrivilege): Promise<ErrorCodeType>;
    /**
     * Sends a chat message to a specific meeting user in an active meeting.
     * @description A successful call of sendMessageToUser triggers the {@link ChatEvent.CHAT_MESSAGE_RECEIVED} event callback for the local and remote users.
     * @param {string} uid The unique id of the specific meeting user
     * @param {string} msg The chat message to be sent
     * @returns 0 means the API call is valid or fails otherwise
     */
    sendMessageToUser(uid: any, msg: any): Promise<ErrorCodeType>;
    /**
     * Send a chat message to all meeting users in an active meeting.
     * @description A successful call of sendMessageToAll triggers the {@link ChatEvent.CHAT_MESSAGE_RECEIVED} event callback for the local and remote users.
     * @param {string} msg The chat message to be sent
     * @returns 0 means the API call is valid or fails otherwise
     */
    sendMessageToAll(msg: string): Promise<ErrorCodeType>;
}

/**
 * @desc events about ChatController
 */
export declare enum ChatEvent {
    /** Occurs when a new chat message is received */
    CHAT_MESSAGE_RECEIVED = "chat-message-received"
}

/**
 * The enumeration class for the meeting chat privilege.
 */
export declare enum ChatPrivilege {
    /** Indicates that everyone in the meeting can send the chat message  */
    EVERYONE = "everyone",
    /** Indicates that only host or moderator can send the chat message */
    HOST_MODERATOR = "host_moderator"
}

/**
 * The enumeration class for the meeting chat type.
 */
export declare enum ChatType {
    /** The chat message will be sent to everyone */
    PUBLIC = "public",
    /** The private chat and mainly for 1v1 chat */
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
    /** A specific function does not support in E2EE mode. */
    ERR_FUNCTION_NOT_SUPPORTED_IN_E2EE = 10017,
    /** A base error code for the meeting user category.  */
    ERR_MEETING_USER_BASE = 11000,
    /** Not allowed to delete yourself.  */
    ERR_MEETING_USER_NOT_REMOVE_SELF = 11001,
    /** A base error code for the meeting chat category. */
    ERR_MEETING_CHAT_BASE = 12000,
    /** A base error code for the meeting recording category. */
    ERR_MEETING_RECORDING_BASE = 13000,
    /** Serve does not allow recording */
    ERR_MEETING_RECORDING_SERVER_NOT_ENABLE = 13001,
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
    /** No active video stream. */
    ERR_VIDEO_NO_STREAM_ACTIVE = 50001,
    /** The video status is not enable, so it dose not allow to unmute. */
    ERR_VIDEO_NOT_ENABLE = 50002,
    /** A base error code for the sharing category. */
    ERR_SHARING_BASE = 70000,
    /** The meeting sharing function has been locked by the meeting host or moderator, only the meeting host or moderator allows to start a new sharing session. */
    ERR_SHARING_IS_LOCKED = 70001,
    /** A base error code for the browser. */
    ERR_BROWSER_NOT_SUPPORTED = 9000,
    /** navigator.mediaDevices.enumerateDevices not supported. */
    ERR_BROWSER_ENUMERATE_DEVICES_NOT_SUPPORTED = 90001,
    /** navigator.mediaDevices.getUserMedia not supported. */
    ERR_BROWSER_GET_USER_MEDIA_NOT_SUPPORTED = 90002,
    /** navigator.mediaDevices.getDisplayMedia not supported. */
    ERR_BROWSER_GET_DISPLAY_MEDIA_NOT_SUPPORTED = 90003
}

/**
 * The EventEmitter is a managing class to manage events subscribe and unsubscribe.
 */
declare class EventEmitter<T extends string> {
    private _eventListeners;
    /**
     * Adds the listener function to the end of the listeners array for the event named eventName.
     * @param eventName
     * @param listener
     * @returns off function handler
     */
    on(eventName: T, listener: TEventCB): TUnsubscribeFunction;
    /**
     * Removes the specified listener from the listener array for the event named eventName.
     * @param eventName
     * @param listener
     */
    off(eventName: T, listener: TEventCB): void;
    /**
     * Adds a one-time listener function for the event named eventName. The next time eventName is triggered, this listener is removed and then invoked.
     * @param eventName
     * @param listener
     */
    once(eventName: T, listener: TEventCB): void;


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
     * @return attendee's network quality, {@link NQIState}
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
     *  Meeting password hash
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
    /** Ends by the bad connection. */
    END_BY_SDK_CONNECTION_BROKEN = 1,
    /** Leaves by user self. */
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

/**
 * The MeetingContextController class is a helper class for managing pre-meeting and post-meeting data, the application can use it to load and update the personal meeting settings and retrieve the recordings.
 */
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
     * Schedules a meeting with customized meeting settings.
     * A successful call of scheduleMeeting triggers the onMeetingSchedule callback.
     * @param {ScheduleMeetingSettings} settings
     * @return 0 means the action succeeds or fails otherwise
     */
    scheduleMeeting(settings: ScheduleMeetingSettings): Promise<ErrorCodeType>;
    /**
     * Loads the present personal meeting settings.
     * @return The personal meeting settings or fails otherwise
     */
    loadPersonalMeetingSettings(): Promise<PersonalMeetingSettings>;
    /**
     * Updates the personal meeting settings.
     * Note: The new settings will take effect in the next meeting.
     * @param {PersonalMeetingSettings} settings
     * @return 0 means the action succeeds or fails otherwise
     */
    updatePersonalMeetingSettings(settings: PersonalMeetingSettings): Promise<ErrorCodeType>;
}

/**
 * The MeetingController class is the main class for managing in-meeting actions, the application can use it to lock or leave/end the meeting and obtains sub-controllers to do more in-meeting actions.
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




    /**
     * listen meeting change, trigger MeetingEvent
     */
    private _listenMeetingChanged;
    private get _meeting();
    /**
     * Gets the AudioController instance.
     * @description AudioController instance listens for some events if initialized successfully, related events:
     * - {@link AudioEvent.AUDIO_UNMUTE_DEMAND}
     * - {@link AudioEvent.LOCAL_AUDIO_MUTE_CHANGED}
     * @returns The AudioController instance or undefined otherwise
     */
    getAudioController(): AudioController | undefined;
    /**
     * Gets the StreamManager instance.
     * @description StreamManager instance listens for some events if initialized successfully, related events:
     * - {@link StreamEvent.LOCAL_AUDIO_TRACK_REMOVED}
     * - {@link StreamEvent.LOCAL_AUDIO_TRACK_ADDED}
     * - {@link StreamEvent.LOCAL_VIDEO_TRACK_REMOVED}
     * - {@link StreamEvent.LOCAL_VIDEO_TRACK_ADDED}
     * - {@link StreamEvent.REMOTE_AUDIO_TRACK_REMOVED}
     * - {@link StreamEvent.REMOTE_AUDIO_TRACK_ADDED}
     * - {@link StreamEvent.REMOTE_VIDEO_TRACK_REMOVED}
     * - {@link StreamEvent.REMOTE_VIDEO_TRACK_ADDED}
     * @returns The StreamManager instance
     */
    getStreamManager(): StreamManager;
    /**
     * Gets the VideoController instance.
     * @description VideoController instance listens for some events if initialized successfully, related events:
     * - {@link VideoEvent.LOCAL_VIDEO_MUTE_CHANGED}
     * - {@link VideoEvent.REMOTE_VIDEO_MUTE_CHANGED}
     * @returns The VideoController instance or undefined otherwise
     */
    getVideoController(): VideoController | undefined;
    /**
     * Gets the SharingController instance.
     * @description SharingController instance listens for some events if initialized successfully, related events:
     * - {@link SharingEvent.SHARING_USER_CHANGED}
     * - {@link SharingEvent.SHARING_SETTINGS_CHANGED}
     * @returns The SharingController instance or undefined otherwise
     */
    getSharingController(): SharingController | undefined;
    /**
     * Gets the UserController instance.
     * @description UserController instance listens for some events if initialized successfully, related to events:
     * - {@link UserEvent.ACTIVE_SPEAKER_USER_CHANGED}
     * - {@link UserEvent.ACTIVE_VIDEO_USER_CHANGED}
     * - {@link UserEvent.USER_ROLE_CHANGED}
     * - {@link UserEvent.USER_LEFT}
     * - {@link UserEvent.USER_UPDATED}
     * - {@link UserEvent.USER_JOINED}
     * @returns The UserController instance or undefined otherwise
     */
    getUserController(): UserController | undefined;
    /**
     * Gets the RecordingController instance.
     * @returns The RecordingController instance
     */
    getRecordingController(): RecordingController;
    /**
     * Gets the ChatController instance.
     * @returns The ChatController instance
     */
    getChatController(): ChatController;
    /**
     * Gets the current active meeting details.
     * @return The meeting information object or error code 10000
     */
    getMeetingInfo(): Promise<IMeetingInfo>;
    /**
     * Ends the current meeting.
     * @description A successful call of endMeeting triggers the {@link RcvEngine.on(EngineEvent.MEETING_LEFT)} event callback for all meeting users.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @return 0 means the action succeeds or fails otherwise
     */
    endMeeting(): Promise<ErrorCodeType>;
    /**
     * Locks or unlocks meetings.
     * @descriptionA successful call of lockMeeting triggers the {@link MeetingEvent.MEETING_LOCK_STATE_CHANGED} event callback to all meeting participants.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {boolean} locked	True means to lock the meeting, otherwise unlock the meeting
     * @return 0 means the action succeeds or fails otherwise
     */
    lockMeeting(locked: boolean): Promise<ErrorCodeType>;
    /**
     * Indicates whether the meeting is locked.
     * @return True means the meeting is locked or otherwise
     */
    isMeetingLocked(): boolean;
    /**
     * Leaves the current meeting.
     * @description A successful call of leaveMeeting triggers the {@link RcvEngine.on(EngineEvent.MEETING_LEFT)} event callback.
     * @return 0 means the action succeeds or fails otherwise
     */
    leaveMeeting(): Promise<ErrorCodeType>;
}

export declare enum MeetingEvent {
    /** Occurs when the meeting lock state is changed */
    MEETING_LOCK_STATE_CHANGED = "meeting-lock-state-changed",
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

/** The enumeration class for the user network quality indicator. */
export declare enum NQIState {
    /** Indicates the network quality is quite good */
    GOOD = "GOOD",
    /** Indicates the network quality is okay but users can feel the communication is slightly impaired */
    MEDIUM = "MEDIUM",
    /** Indicates the network quality is poor and users can communicate only not very smoothly */
    POOR = "POOR",
    /** Indicates the network is disconnected and users cannot communicate at all */
    DISCONNECT = "DISCONNECT",
    /** Indicates the network quality is unknown */
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
 * The RcvEngine class is the entry point of the RingCentral video client SDK that empowers the applications to easily and quickly build real-time audio and video communication.
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
     * @returns The engine instance if success or undefined otherwise
     */
    static instance(): RcvEngine | undefined;
    private constructor();
    /**
     * Destroys the RcvEngine instance and releases all resources used by the client SDK.
     * @description Once you called destory method, you cannot use any method or callback in the client SDK anymore. If you want to do the real-time communication again, you must call create method to create a new RcvEngine instance.
     */
    destroy(): void;
    /**
     * Starts an instant meeting with customized meeting-level settings for the participants and user-level meeting options.
     * @description Users must have a valid authentication token to invoke this method.
     * @param {InstantMeetingSettings} settings The custom meeting settings, the default settings will be applied if it's null.
     * @returns The MeetingController instance
     */
    startInstantMeeting(settings?: InstantMeetingSettings): Promise<MeetingController>;
    /**
     * Joins a meeting with a specific meeting id.
     * @description Users must have a valid authentication token to invoke this method.
     * @param {string} meetingId The meeting short id
     * @param {MeetingOptions} options The user-level meeting options, it only applied if the user is the meeting host.
     * @returns The MeetingController instance
     */
    joinMeeting(meetingId: string, options?: MeetingOptions): Promise<MeetingController>;
    private _createMeetingController;
    /**
     * When leaves a meeting all meeting data need be reset.
     */
    private _resetMeetingData;
    /**
     * Common join action function ,used in joinMeeting or startInstantMeeting
     */
    private _joinAction;
    /**
     * Get the audio device manager
     * @description AudioDeviceManager instance listens for some events if initialized successfully, related to events:
     * - {@link AudioDeviceManagerEvent.RECORDING_DEVICE_LIST_UPDATED}
     * - {@link AudioDeviceManagerEvent.PLAYBACK_DEVICE_LIST_UPDATED}
     * @returns The AudioDeviceManager instance if success
     */
    getAudioDeviceManager(): AudioDeviceManager;
    /**
     * Get the video device manager.
     * @description VideoDeviceManager instance listens for some events if initialized successfully, related to events:
     * - {@link VideoDeviceManagerEvent.VIDEO_DEVICE_LIST_UPDATED}
     * @returns The VideoDeviceManager instance if success
     */
    getVideoDeviceManager(): VideoDeviceManager;
    /**
     * Gets an active meeting controller with a specific meeting id.
     * @description The RcvMeetingController instance only returns when you joined a meeting successfully. By using this instance, the app can invoke the meeting methods, such as gets the meeting information, lock and unlock the meeting if you are the meeting host or moderator.
     * @returns The MeetingController instance if success
     */
    getMeetingController(): MeetingController;
    /**
     * Gets the meeting context controller.
     * @returns The RcvMeetingContextController instance
     */
    getMeetingContextController(): MeetingContextController;
    private _clearManagers;
    /**
     * download logs from rcvEngine
     * @param levels download log levels
     */
    static downloadLogs(levels?: LogLevel[]): Promise<void>;
    /**
     * Sets the token pair string in the SDK.
     * @param {string} tokenJsonStr The authentication access token and refresh token pair JSON string
     * @param {boolean} autoRefresh Default value is TRUE. If it's TRUE, the access token will be refreshed automatically once it expired
     * @return 0 means the action succeeds or fails otherwise
     */
    setAuthToken(tokenJsonStr: string, autoRefresh?: boolean): Promise<ErrorCodeType>;
    /**
     * Refreshes the auth token pair immediately.
     * @param refreshToken The authentication refresh token string.
     * @return 0 means the action succeeds or fails otherwise
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

/**
 * The RecordingController class is a managing class to control the recording functions and states in an active meeting, such as starting or pausing the recording.
 */
export declare class RecordingController extends EventEmitter<RecordingEvent> {
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
    private _validatePermission;
    /**
     * Get current meeting recording state
     * @return The current recording status
     */
    getRecordingState(): RecordingStatus;
    /**
     * Indicates whether the local user has permission to control the recording functions.
     * @returns True means has permission or otherwise
     */
    isRecordingAllowed(): boolean;
    /**
     * Gets the current recording duration (seconds).
     * @returns The recording duration
     */
    getRecordingDuration(): number;
    /**
     * Starts recording the meeting session.
     * @description A successful call of pauseRecording triggers the {@link RecordingEvent.RECORDING_STATE_CHANGED} event callback for all meeting users.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @return 0 means the action succeeds or fails otherwise
     */
    startRecording(): Promise<ErrorCodeType>;
    /**
     * Pauses recording the meeting session.
     * @description A successful call of pauseRecording triggers the {@link RecordingEvent.RECORDING_STATE_CHANGED} event callback for all meeting users.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @return 0 means the action succeeds or fails otherwise
     */
    pauseRecording(): Promise<ErrorCodeType>;
}

/**
 * @desc events about RecordingController
 */
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

/**
 * Indicates the recording status of the current meeting
 */
export declare enum RecordingStatus {
    /** Indicates the meeting recording is not activated. */
    UNACTIVATED = 0,
    /** Indicates the meeting recording is started and running. */
    RUNNING = 1,
    /** Indicates the meeting recording is paused. */
    PAUSED = 2
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

/**
 * The SharingController class is a managing class to control the sharing-related functions and states in an active meeting, such as starts or stops the sharing.
 */
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
     * Indicates whether the sharing is being locked.
     * @returns True means locked, False means not
     */
    isSharingLocked(): boolean;
    /**
     * Starts sharing the device screen in an active meeting.
     * @param {DisplayMediaStreamConstraints} spec
     * @returns 0 means the action succeeds or fails otherwise
     */
    startSharing(spec?: DisplayMediaStreamConstraints): Promise<ErrorCodeType>;
    /**
     * Indicates whether the current sharing is started by the local user.
     * @returns True means the local user or otherwise
     */
    isLocalSharing(): boolean;
    /**
     * Indicates whether the current sharing is started by the remote user.
     * @returns True means the remote user or otherwise
     */
    isRemoteSharing(): boolean;
    /**
     * Locks sharing function.
     * @description If the sharing function is locked and a participant is sharing, then the current sharing will stop right away and participants unable to start the sharing again. However, the host or moderator is still able to start the sharing.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {boolean} locked Sets whether locks the sharing function. True means lock it, False means not
     * @returns 0 means the action succeeds or fails otherwise
     */
    lockSharing(locked: boolean): Promise<ErrorCodeType>;
    /**
     * Stops sharing.
     * @return 0 means success or fails otherwise
     */
    stopSharing(): Promise<ErrorCodeType>;
    /**
     * Stops the current sharing session of the remote user.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {string} uid The unique id of the specific meeting user
     * @return 0 means success or fails otherwise
     */
    stopRemoteSharing(uid: string): Promise<ErrorCodeType>;
}

/**
 * @desc events about ShareController
 */
export declare enum SharingEvent {
    /** Occurs when the meeting sharing settings is changed */
    SHARING_SETTINGS_CHANGED = "sharing-settings-changed",
    /** Occurs when the meeting sharing state is changed */
    SHARING_STATE_CHANGED = "sharing-state-changed",
    /** Occurs when the meeting sharing user is changed */
    SHARING_USER_CHANGED = "sharing-user-changed"
}

/**
 * The enumeration class for the meeting sharing setting.
 */
export declare enum SharingSettings {
    /** Indicates the meeting sharing has been locked by the host or moderator */
    LOCKED = 0,
    /** Indicates the meeting sharing has been unlocked by the host or moderator */
    UNLOCKED = 1
}

/**
 * The enumeration class for the meeting sharing state.
 */
export declare enum SharingState {
    /** Indicates the meeting sharing starts by the current user. */
    SELF_SHARING_BEGIN = 0,
    /** Indicates the meeting sharing ends which starts by the current user. */
    SELF_SHARING_END = 1,
    /** Indicates the meeting sharing starts by other meeting participants. */
    OTHER_SHARING_BEGIN = 2,
    /** Indicates the meeting sharing ends which starts by other meeting participants. */
    OTHER_SHARING_END = 3,
    /** Indicates the meeting sharing is paused. */
    SHARING_PAUSED = 4,
    /** Indicates the meeting sharing is resumed. */
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

/**
 * The StreamManager class is a managing class to manage the media stream and test them added and removed.
 */
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






}

export declare enum StreamType {
    VIDEO_MAIN = "video/main",
    VIDEO_SCREENSHARING = "video/screensharing"
}

export declare type TEventCB = (...args: any[]) => void;

export declare type TUnsubscribeFunction = () => void;

/**
 * The UserController class is a managing class to control the meeting user related functions and states in an active meeting, such as admitting or denying the participants who are in the waiting room and assigning moderators, etc.
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
     * Gets all meeting user object map.
     * @description The local user object is also included in the map
     * @returns The user object map or empty otherwise
     */
    getMeetingUsers(): Record<string, Participant>;
    /**
     * Gets a specific meeting user object.
     * @param {string} uid The unique id of the meeting user
     * @returns The user object or undefined otherwise
     */
    getMeetingUserById(uid: string): Participant | undefined;
    /**
     * Gets the local user object.
     * @returns The local user object
     */
    getMyself(): Participant;
    /**
     * Assigns the moderator role to the meeting user(s).
     * @description A successful call of assignModerators triggers the {@link UserEvent.USER_ROLE_CHANGED} event callback for all meeting users.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {string[]} uids The user id list, one user id at least must be provided
     * @returns 0 means the action succeeds or fails otherwise
     */
    assignModerators(uids: string[]): Promise<ErrorCodeType>;
    /**
     * Revokes the moderator role from the meeting user(s).
     * @description A successful call of revokeModerators triggers the {@link UserEvent.USER_ROLE_CHANGED} event callback for all meeting users.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {string[]} uids The user id list, one user id at least must be provided
     * @returns 0 means the action succeeds or fails otherwise
     */
    revokeModerators(uids: string[]): Promise<ErrorCodeType>;
    /**
     * Removes a specific meeting user from an active meeting.
     * @decription A successful call of removeUser triggers the {@link UserEvent.USER_LEFT} event notification for remote users.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {string} uid The unique id of the meeting user
     * @returns 0 means the action succeeds or fails otherwise
     */
    removeUser(uid: string): Promise<ErrorCodeType>;
    /**
     * Admits all currently in the waiting room users to join the meeting.
     * @description A successful call of admitUser triggers the {@link UserEvent.USER_JOINED} event for remote user.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {string} uid The unique id of the user
     * @returns 0 means the action succeeds or fails otherwise
     */
    admitUser(uid: string): Promise<ErrorCodeType>;
    /**
     * Admits all currently in the waiting room users to join the meeting.
     * @description A successful call of admitAll triggers the {@link UserEvent.USER_JOINED} event for remote user.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @returns 0 means the action succeeds or fails otherwise
     */
    admitAll(): Promise<ErrorCodeType>;
    /**
     * Denies a specific waiting room user to join the meeting.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param {string} uid The unique id of the user
     * @returns 0 means the action succeeds or fails otherwise
     */
    denyUser(uid: string): Promise<ErrorCodeType>;
    /**
     * Moves a specific meeting user into the waiting room.
     * @description A successful call of putUserInWaitingRoom triggers the {@link UserEvent.USER_LEFT} event callback for that specific user.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param  {string} uid The unique id of the meeting user
     * @returns 0 means the action succeeds or fails otherwise
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

/**
 * The VideoController class is a managing class to control the video-related functions and states in an active meeting, such as mute or unmute local or remote video.
 */
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
     * Binds the video view and starts the local camera preview.
     * @param {boolean | MediaTrackConstraints} constraints
     */
    startPreview(constraints: boolean | MediaTrackConstraints): Promise<MediaStream>;
    /**
     * Unbinds the video view and stops the video camera preview.
     * @return 0 means the action succeeds or fails otherwise
     */
    stopPreview(): Promise<ErrorCodeType>;
    /**
     * Stops or resumes publishing the local video stream.
     * @description A successful call of muteLocalVideoStream triggers the {@link VideoEvent.LOCAL_VIDEO_MUTE_CHANGED} event callback to the local user.
     * @param {boolean} mute Sets whether to stop publishing the local video stream. True means stop publishing, false means resume publishing
     * @param {MediaTrackConstraints} options
     * @return 0 means the action succeeds or fails otherwise
     */
    muteLocalVideoStream(mute: boolean, options?: MediaTrackConstraints): Promise<ErrorCodeType>;
    /**
     * Stops or resumes subscribing to the video stream of a remote user.
     * @description A successful call of muteRemoteVideoStream triggers the {@link VideoEvent.REMOTE_VIDEO_MUTE_CHANGED} event callback to the specified remote user.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param uid The unique id of the specified remote user
     * @param mute Sets whether to stop subscribing to the video stream. True means stop subscribing, false means resume subscribing
     * @return 0 means the action succeeds or fails otherwise
     */
    muteRemoteVideoStream(uid: string, mute: boolean): Promise<ErrorCodeType>;
    /**
     * Stops or resumes subscribing to the video stream of all meeting users.
     * @description Only the meeting host or moderator has permission to invoke this method.
     * @param mute Sets whether to stop subscribing to the video stream. True means stop subscribing, false means resume subscribing
     * @return 0 means the action succeeds or fails otherwise
     */
    muteAllRemoteVideoStreams(mute: boolean): Promise<ErrorCodeType>;
}

/**
 * The VideoDeviceManager class is a managing class to manage the video devices and test them out.
 */
export declare class VideoDeviceManager extends DeviceManager<VideoDeviceManagerEvent> {
    constructor();
    private _handleDeviceListChanged;
    /**
     * Get the device info by deviceId
     */
    private _getDeviceInfo;
    /**
     * Enumerates the video devices.
     * @param {boolean} skipPermissionCheck
     * @return The video device list
     */
    enumerateVideoDevices(skipPermissionCheck?: boolean): Promise<MediaDeviceInfo[]>;
    /**
     * Starts the camera test.
     * @description A successful call of startDeviceTest triggers capturing the video frames from the camera and displaying them in the video view. If the user can see their video that means the camera works properly.
     * @return The video media stream or fails otherwise
     */
    startVideoDeviceTest(): Promise<ErrorCodeType | MediaStream>;
    /**
     * @description Stop video test stream
     * @return 0 means success or fails otherwise
     */
    stopVideoDeviceTest(): ErrorCodeType;
    /**
     * Sets the current video device by the device id.
     * @description A successful call of setVideoDevice triggers the {@link VideoDeviceManagerEvent.VIDEO_DEVICE_CHANGED} event notification.
     * @param {string} deviceId The unique id of the video device
     * @return 0 means success or fails otherwise
     */
    setVideoDevice(deviceId: string): Promise<ErrorCodeType>;
    /**
     * Gets the video-capture device list that is in use.
     * @return The media device info or fails otherwise
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

/**
 * The enumeration class for the waiting room mode of the meeting.
 */
export declare enum WaitingRoomMode {
    /** When the waiting room option is enabled and this mode is elected, everyone will enter the waiting room and wait for the host's admissio */
    EVERYONE = 0,
    /** When the waiting room option is enabled and this mode is elected, anyone not signed in will enter the waiting room and wait for the host's admission */
    NOT_AUTH_USER = 1,
    /** When the waiting room option is enabled and this mode is elected, anyone outside of the meeting host company will enter the waiting room and wait for the host's admission */
    NOT_COWORKERS = 2
}

declare enum WaitingRoomStatus {
    DENIED = "0",
    ALLOW = "1",
    WAITING = "2",
    LEFT = "3"
}

export { }
