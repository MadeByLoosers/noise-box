/**
 * NoiseBox
 * const.js
 *
 * App constants. This JS file is used both on the client and the server, so we conditionally
 * export for either RequireJS or Node/CommonJS after detecting the environment.
 */

var Const = {

    // Environments

    PROD : "production",
    DEV : "development",
    TEST : "testing",

    // Default values

    DEFAULT_PORT : 1337,
    APP_TITLE : "NoiseBox",

    // NoiseBox client types

    TYPE_HOME : "home",
    TYPE_HOST : "host",
    TYPE_USER : "user",

    // Model events

    HOME_CLIENT_ADDED : "homeClientAdded",
    HOME_CLIENT_REMOVED : "homeClientRemoved",
    NOISEBOX_ADDED : "noiseBoxAdded",
    NOISEBOX_REMOVED : "noiseBoxRemoved",
    HOST_CLIENT_ADDED : "hostClientAdded",
    HOST_CLIENT_REMOVED : "hostClientRemoved",
    USER_CLIENT_ADDED : "userClientAdded",
    USER_CLIENT_REMOVED : "userClientRemoved",
    NOISEBOX_PLAYLIST_UPDATED : "noiseBoxPlaylistUpdated",

    // Socket.io events

    SERVER_SOCKET_CONNECT : "connect",
    CLIENT_SOCKET_CONNECTION : "connection",
    SOCKET_DISCONNECT : "disconnect",

    // Custom server > client socket events

    SERVER_PLAY_REQUEST : "serverPlayRequest",
    SERVER_APP_STATS_UPDATED : "serverAppStatsUpdated",
    SERVER_NOISE_BOX_STATS_UPDATED : "serverNoiseBoxStatsUpdated",

    // Custom client > server socket events

    HOME_CONNECT : "homeConnect",
    HOST_CONNECT : "hostConnect",
    HOST_TRACK_COMPLETE : "hostTrackComplete",
    USER_CONNECT : "userConnect",
    USER_TRACK_CLICKED : "userTrackClicked"
};

if ( typeof module !== "undefined" && module.exports ) {

    module.exports = Const;

} else if ( typeof define === "function" ) {

    define(Const);
}