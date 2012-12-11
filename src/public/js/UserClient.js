/**
 * NoiseBox
 * UserClient.js
 *
 * Host page NoiseBox client.
 */

define(["constants","AbstractClient","jquery","underscore"], function (Const,AbstractClient) {

    return AbstractClient.extend({

        usernameField : null,

        init : function () {

            this._super();

            $("#file-list").on("click","a",_.bind(this.onTrackClicked,this));

            $("#username-form").on("submit", _.bind(this.onUsernameUpdate,this));

            this.usernameField = $("#username");

            this.on(Const.USER_ADDED,this.updateUsernameField);
            this.on(Const.USER_UPDATED,this.updateUsernameField);
        },

        onTrackClicked : function (event) {

            event.preventDefault();

            this.emit(Const.USER_CLICKED_TRACK,{track:event.target.href});
        },

        updateUsernameField : function(data) {

            var username = data.username || "new user",
                changed = false;

            if (!!window.localStorage && !!window.localStorage.username) {
                username = window.localStorage.username;
                changed = true;
            }

            this.usernameField.val(username);

            if (!!data.cid) { $("#cid").val(data.cid); } //TEMP
            if (!!data.userid) { $("#userid").val(data.userid); } //TEMP

            if (changed) {
                $("#username-form").submit();
            }
        },

        onUsernameUpdate : function (event) {

            if (!!event) { event.preventDefault(); }

            this.emit(Const.USER_NAME_UPDATE,{
                username : this.usernameField.val(),
                id : id,
                cid : $("#cid").val(),
                userid: $("#userid").val()
            });

            if (!!window.localStorage) {
                window.localStorage.username = this.usernameField.val();
                console.log("onUsernameUpdate", this.usernameField.val());
            }
        },

        onConnect : function () {

            this._super();

            this.emit(Const.USER_CONNECT);
        }
    });
});