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

        onUsernameUpdate : function (event) {

            event.preventDefault();

            this.emit(Const.USER_NAME_UPDATE,{
                username : this.usernameField.val(),
                id : id,
                cid : $("#cid").val(),
                userid: $("#userid").val()
            });
        },

        updateUsernameField : function(data) {

            this.usernameField.val(data.username);

            $("#cid").val(data.cid); //TEMP
            $("#userid").val(data.userid); //TEMP
        },

        onConnect : function () {

            this._super();

            this.emit(Const.USER_CONNECT);
        }
    });
});