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
            id : "",
            username : "",
            cid : "",
            userid : ""
        },

        init : function () {

            this._super();

            $("#file-list").on("click","a",_.bind(this.onTrackClicked,this));

            $("#username-form").on("submit", _.bind(this.onUsernameUpdate,this));

            $("#chat-form").on("submit", _.bind(this.onChatMessage,this));

            this.usernameField = $("#username");
            this.chatField = $("#chat-text");

            this.chatField.attr("disabled", "disabled");

            this.on(Const.USER_ADDED,this.updateUsernameField);
            this.on(Const.USER_UPDATED,this.updateUsernameField);
        },

        onTrackClicked : function (event) {

            event.preventDefault();

            this.emit(Const.USER_CLICKED_TRACK,{track:event.target.href});
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
        },


        onChatMessage : function (event) {

            if (!!event) { event.preventDefault(); }

            if (this.chatField.val().length > 0) {

                this.emit(Const.CHAT_MESSAGE_SENT, { message: this.chatField.val(), user: this.user});
                this.chatField.val("");
            }

        },


        onConnect : function () {

            this._super();

            this.emit(Const.USER_CONNECT);
        }
    });
});