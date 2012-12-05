/**
 * NoiseBox
 * AbstractClient.js
 *
 * Abstract NoiseBox client. Contains shared functionality used across all types of client, but no
 * type specific implementations. All clients inherit from this object.
 */

define(["constants","jquery","underscore","socketio","sji"], function (Const) {

    return Class.extend({

        id : "",
        socket : {},
        clientType : "",
        host : "",
        env : "",

        /**
         * Constructor.
         */
        init : function () {

            this.clientType = $("body").attr("id");
            this.host = $("body").data("host");
            this.id = $("body").data("noise-box-id");
            this.env = $("body").data("env");
            this.socket = io.connect(this.host);

            console.log("****************");
            console.log("Client init",this.clientType,this.host,this.id===undefined?"":this.id);

            $("#flashMessage p:parent").parent().slideDown(250).delay(5000).slideUp(250);

            this.on(Const.SERVER_SOCKET_CONNECT,this.onConnect);
            this.on(Const.SOCKET_DISCONNECT,this.onDisconnect);
        },

        /**
         * Socket connection to server established.
         */
        onConnect : function () {

            console.log("Socket connected");
        },

        /**
         * Socket connection to server terminated.
         */
        onDisconnect : function () {

            console.log("Socket disconnected");
        },

        /**
         * Helper function for binding callbacks to socket events from the server.
         *
         * @param event Server event name string.
         * @param callback Callback function reference.
         */
        on : function (event,callback) {

            console.log("Listening for '"+event+"'");

            var self = this;

            this.socket.on(event,function (data) {

                console.log("Received '"+event+"'",typeof data === "undefined"?"":JSON.stringify(data));

                callback.call(self,data);
            });
        },

        /**
         * Helper function for sending socket events to the server.
         *
         * @param event Client event name string.
         */
        emit : function (event,data) {

            data = typeof data !== "undefined" ? data : {};

            data = _.extend(data,{
                id : this.id,
                clientType : this.clientType
            });

            console.log("Emitting '"+event+"'",typeof data === "undefined"?"":JSON.stringify(data));

            this.socket.emit(event,data);
        }
    });
});