// THIS FILE NO LONGER IN USE DELETE WHEN FUNCTIONALITY FULLY PORTED

/**
 * NoiseBox
 * noise-box-client.js
 *
 * Clientside JavaScript module. Sets up page interactivity for all the difference application states
 * and communicates with the socket server.
 */

var NoiseBox = (function($,_,io,constants) {

    "use strict";

    var noiseBoxName;
    var socket;
    var clientType;
    var audioElement;
    var host;

    /**
     * Initialise the module.
     */
    function init () {

        if ( !$ || !io || !_ || !constants) {

            throw new Error("Error: module depandancies are missing");
        }

        clientType = $("body").attr("id");
        host = $("body").data("host");
        noiseBoxName = $("body").data("noise-box-name");

        socket = io.connect(host);

        console.log("NoiseBox.init",clientType,noiseBoxName===undefined?"":noiseBoxName);

        // Setup for different types of page:

        switch ( clientType ) {

            case constants.TYPE_HOME:
                setupForHome();
                break;
            case constants.TYPE_HOST:
                setupForHost();
                break;
            case constants.TYPE_USER:
                setupForUser();
                break;
        }
    }

    /**
     * Setup for home. This page allows a user to create a new NoiseBox.
     */
    function setupForHome () {

        console.log("NoiseBox.setupForHome");

        bind(constants.SERVER_SOCKET_CONNECT,onHomeSocketConnect);
        bind(constants.SERVER_APP_STATS_UPDATED,onServerStatsUpdated);
    }

    /**
     * Socket connection successfull callback for the home page. Notifies the server that a home
     * page client has connected.
     */
    function onHomeSocketConnect () {

        console.log("NoiseBox.onHomeSocketConnect");

        emit(constants.HOME_CONNECT);
    }

    /**
     * Setup a host page. This page plays NoiseBox audio based on events sent from the server.
     */
    function setupForHost () {

        console.log("NoiseBox.setupForHost");

        audioElement = document.getElementById("audio-player");
        audioElement.addEventListener("ended",onTrackComplete);

        bind(constants.SERVER_SOCKET_CONNECT,onHostSocketConnect);
        bind(constants.SERVER_PLAY_REQUEST,onServerPlayRequest);
        bind(constants.SERVER_NOISE_BOX_STATS_UPDATED,onServerStatsUpdated);
    }

    /**
     * Play an audio track.
     *
     * @param track Audio track path.
     */
    function playTrack (track) {

        console.log("NoiseBox.playTrack",track);

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

        emit(constants.HOST_TRACK_COMPLETE,{track:audioElement.src});
    }

    /**
     * Setup a user page. This page allows a user to interact with a given NoiseBox.
     */
    function setupForUser () {

        console.log("NoiseBox.setupForUser");

        $("#file-list").on("click","a",onTrackClicked);

        bind(constants.SERVER_SOCKET_CONNECT,onUserSocketConnect);
    }

    /**
     * Track click callback. Notify the server that a track was clicked.
     */
    function onTrackClicked (event) {

        console.log("NoiseBox.onUserTrackClicked");

        event.preventDefault();

        emit(constants.USER_TRACK_CLICKED,{track:$(this).attr("href")});
    }

    /**
     * Socket connection successfull callback for the user page. Notifies the server that a user
     * has connected.
     */
    function onUserSocketConnect () {

        console.log("NoiseBox.onUserSocketConnect");

        emit(constants.USER_CONNECT);
    }

    /**
     * Socket connection successfull callback for the host page. Notifies the server that a host
     * has connected.
     */
    function onHostSocketConnect () {

        console.log("NoiseBox.onHostSocketConnect");

        emit(constants.HOST_CONNECT);
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
    function bind (event,listener) {

        socket.on(event,listener);
    }

    /**
     * Helper function for emitting socket events back to the server.
     */
    function emit (event,obj) {

        obj = typeof obj !== "undefined" ? obj : {};
        obj = _.extend(obj,{
            noiseBoxName : noiseBoxName,
            clientType : clientType
        });

        console.log("NoiseBox.emit",event,obj);

        socket.emit(event,obj);
    }

    // Expose the module API

    return {
        init : init
    };
})($,_,io,NoiseBoxConstants);