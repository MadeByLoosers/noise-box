/*global _gaq*/
/**
 * NoiseBox
 * UserClient.js
 *
 * Host page NoiseBox client.
 */

define(["constants","AbstractClient","jquery","underscore"], function (Const,AbstractClient) {

    return AbstractClient.extend({

        usernameField : null,
        chatField : null,
        user : {
            id : "", // room id
            username : "",
            cid : "",
            userid : ""
        },
        broadcastMode: true, // false for preview
        audioElement : null,

        init : function () {

            this._super();

            $("#track-list a").on("click", _.bind(this.onTrackClicked,this));

            $("#username-form").on("submit", _.bind(this.onUsernameUpdate,this));

            $("#chat-form").on("submit", _.bind(this.onChatMessage,this));

            $("#play-mode-form input[name=play-mode]").on("change", _.bind(this.onPlayModeChange,this));

            this.usernameField = $("#username");
            this.chatField = $("#chat-text");

            this.chatField.attr("disabled", "disabled");

            this.on(Const.USER_ADDED,this.updateUsernameField);
            this.on(Const.USER_UPDATED,this.updateUsernameField);
        },

        onTrackClicked : function (event) {

            event.preventDefault();

            var track = event.target.href;

            if (this.broadcastMode) {
                this.emit(Const.USER_CLICKED_TRACK,{track:track});
            } else {
                this.previewTrack(track);
            }
        },

        onPlayModeChange : function(event) {
            if (event.target.value === "broadcast") {
                this.broadcastMode = true;
            } else if (event.target.value === "preview") {
                this.broadcastMode = false;
            }
        },

        previewTrack : function(track) {

            // need to create a new audio element each time
            // can't just change the src of an existing element
            if (!!this.audioElement) {
                this.audioElement.remove();
            }

            this.audioElement = $("<audio />")
                .attr("id", "audio-player")
                .attr("preload", "auto")
                .attr("src", track)
                .appendTo("body");

            this.audioElement[0].play();
        },

        updateUsernameField : function(data) {

            this.user.username = data.username || "new user";
            var changed = false;

            if (!!window.localStorage && !!window.localStorage.username) {
                this.user.username = window.localStorage.username;
                changed = true;
            }

            this.usernameField.val(this.user.username);


            if (!!data.id) {
                this.user.id = data.id;
            }
            if (!!data.cid) {
                $("#cid").val(data.cid); //TEMP
                this.user.cid = data.cid;
            }
            if (!!data.userid) {
                $("#userid").val(data.userid); //TEMP
                this.user.userid = data.userid;
            }

            if (changed) {
                $("#username-form").submit();
            }
        },

        onUsernameUpdate : function (event) {

            if (!!event) { event.preventDefault(); }

            this.user.username = this.usernameField.val();

            this.emit(Const.USER_NAME_UPDATE,this.user);

            if (!!window.localStorage) {
                window.localStorage.username = this.user.username;
            }

            this.chatField.removeAttr("disabled");
            $("#chat-text-label").text("Chat");

            _gaq.push(['_trackEvent','user','login', this.noiseBoxID]);
        },


        onChatMessage : function (event) {

            if (!!event) { event.preventDefault(); }

            if (this.chatField.val().length > 0) {

                this.emit(Const.CHAT_MESSAGE_SENT, { message: this.chatField.val(), user: this.user});
                this.chatField.val("");

                _gaq.push(['_trackEvent','chat', 'talking', this.noiseBoxID]);
            }

        },


        onConnect : function () {

            this._super();

            this.emit(Const.USER_CONNECT);
        }
    });
});