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

    DEFAULT_PORT : 7001,
    APP_TITLE : "NoiseBox",

    // NoiseBox client types

    TYPE_HOME : "home",
    TYPE_HOST : "host",
    TYPE_USER : "user",

    // Model events

    NOISEBOX_ADDED : "noiseBoxAdded",
    NOISEBOX_REMOVED : "noiseBoxRemoved",
    HOME_ADDED : "homeAdded",
    HOME_REMOVED : "homeRemoved",
    HOST_ADDED : "hostAdded",
    HOST_REMOVED : "hostRemoved",
    USER_ADDED : "userAdded",
    USER_UPDATED : "userUpdated",
    USER_REMOVED : "userRemoved",
    TRACK_ADDED : "trackAdded",
    TRACK_REMOVED : "trackRemoved",
    LOG_UPDATED : "logUpdated",

    // Socket.io events

    SERVER_SOCKET_CONNECT : "connect",
    CLIENT_SOCKET_CONNECTION : "connection",
    SOCKET_DISCONNECT : "disconnect",

    // Custom server > client socket events

    SERVER_APP_STATS_UPDATED : "appStatsUpdated",
    SERVER_NOISE_BOX_STATS_UPDATED : "noiseBoxStatsUpdated",
    SERVER_ADD_TRACK : "addTrack",
    SERVER_REMOVE_TRACK : "removeTrack",

    // Custom client > server socket events

    HOME_CONNECT : "homeConnect",
    HOST_CONNECT : "hostConnect",
    USER_CONNECT : "userConnect",
    USER_CLICKED_TRACK : "userClickedTrack",
    USER_NAME_UPDATE : "userNameUpdate"
};

if ( typeof module !== "undefined" && module.exports ) {

    module.exports = Const;

} else if ( typeof define === "function" ) {

    define(Const);
}