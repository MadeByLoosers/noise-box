/**
 * NoiseBox
 * noise-box-client.js
 *
 * Clientside JavaScript module. Sets up page interactivity for all the difference application states
 * and communicates with the socket server.
 */

var NoiseBox = (function($,_,io) {

    "use strict";

    var TYPE_HOME = "home";
    var TYPE_HOST = "host";
    var TYPE_USER = "user";

    var SOCKET_CONNECT = "connect";
    var SOCKET_DISCONNECT = "disconnect";

    var SERVER_PLAYLIST_UPDATED = "serverPlaylistUpdated";
    var SERVER_PLAY_REQUEST = "serverPlayRequest";
    var SERVER_PAUSE_REQUEST = "serverPauseRequest";
    var SERVER_SKIP_REQUEST = "serverSkipRequest";
    var SERVER_STATS_UPDATED = "serverStatsUpdated";

    var HOST_CONNECT = "hostConnect";
    var HOST_DISCONNECT = "hostDisconnect";
    var HOST_TRACK_COMPLETE = "hostTrackComplete";

    var USER_CONNECT = "userConnect";
    var USER_TRACK_CLICKED = "userTrackClicked";

    var name;
    var socket;
    var type;
    var player;
    var audioElement;

    /**
     * Initialise the module.
     */
    function init () {

        if ( !$ || !io || !_ ) {

            throw new Error("NoiseBox.init: error required module parameters are missing");
        }

        socket = io.connect("http://"+window.location.hostname+":3000");
        type = $("body").attr("id");
        name = $("#room-name").data("room-name");

        console.log("NoiseBox.init",type,name===undefined?"":name);

        // Bind generic events:

        bind(SOCKET_DISCONNECT,onSocketDisconnect);

        // Setup for different types of page:

        switch ( type ) {

            case TYPE_HOME:
                setupForHome();
                break;
            case TYPE_HOST:
                setupForHost();
                break;
            case TYPE_USER:
                setupForUser();
                break;
        }
    }

    /**
     * Setup a host page. This page plays NoiseBox audio based on events sent from the server.
     */
    function setupForHost () {

        console.log("NoiseBox.setupForHost");

        audioElement = document.getElementById("audio-player");
        audioElement.addEventListener("ended",onTrackComplete);

        bind(SOCKET_CONNECT,onHostSocketConnect);
        bind(SERVER_PLAY_REQUEST,onServerPlayRequest);
        bind(SERVER_STATS_UPDATED,onServerStatsUpdated);
    }

    /**
     * Play an audio track.
     *
     * @param track Audio track path.
     */
    function playTrack (track) {

        audioElement.src = track;
        audioElement.play();
    }

    /**
     * Pause the current audio track.
     */
    function pauseTrack () {

        audioElement.pause();
    }

    /**
     * Audio track complete callback. Notify the server that this host has finished playing a track.
     */
    function onTrackComplete () {

        var event = getDefaultEventObject();

        emit(HOST_TRACK_COMPLETE,{track:audioElement.src});
    }

    /**
     * Setup a user page. This page allows a user to interact with a given NoiseBox.
     */
    function setupForUser () {

        console.log("NoiseBox.setupForUser");

        $("#file-list").on("click","a",onTrackClicked);

        bind(SOCKET_CONNECT,onUserSocketConnect);
    }

    /**
     * Track click callback. Notify the server that a track was clicked.
     */
    function onTrackClicked (event) {

        console.log("NoiseBox.onUserTrackClicked");

        event.preventDefault();

        emit(USER_TRACK_CLICKED,{track:$(this).attr("href")});
    }

    /**
     * Setup for home. This page allows a user to create a new NoiseBox.
     */
    function setupForHome () {

        console.log("NoiseBox.setupForHome");
    }

    /**
     * Socket connection successfull callback for the user page. Notifies the server that a user
     * has connected.
     */
    function onUserSocketConnect () {

        console.log("NoiseBox.onUserSocketConnect");

        emit(USER_CONNECT);
    }

    /**
     * Socket connection successfull callback for the host page. Notifies the server that a host
     * has connected.
     */
    function onHostSocketConnect () {

        console.log("NoiseBox.onHostSocketConnect");

        emit(HOST_CONNECT);
    }

    /**
     * Generic socket disconnected callback.
     */
    function onSocketDisconnect () {

        console.log("NoiseBox.onSocketDisconnect");
    }

    /**
     * Callback for the SERVER_STATS_UPDATED socket event. Notifies interested clients that the
     * number of hosts/users connected to the current NoiseBox has changed.
     */
    function onServerStatsUpdated (data) {

        console.log("NoiseBox.onServerStatsUpdated");

        $(".hosts-stats-value").text(data.numHosts);
        $(".users-stats-value").text(data.numUsers);
    }

    /**
     * Callback for the SERVER_PLAY_REQUEST socket event. Notifies hosts that the server wants them
     * to play a track.
     */
    function onServerPlayRequest (data) {

        console.log("NoiseBox.onServerPlayRequest",data.track);

        playTrack(data.track);
    }

    /**
     * Helper function for binding callbacks to the socket.
     */
    function bind (type,callback) {

        socket.on(type,callback);
    }

    /**
     * Helper function for emitting socket events back to the server.
     */
    function emit (type,event) {

        event = typeof event !== "undefined" ? event : {};
        event = _.extend(event,{name:name,type:type});

        console.log("NoiseBox.emit",type,event);

        socket.emit(type,event);
    }

    /**
     * Generate a default client event object for sending to the server.
     */
    function getDefaultEventObject () {

        return {
            name : name,
            type : type
        };
    }

    // Expose the module API

    return {
        init : init
    };
})($,_,io);