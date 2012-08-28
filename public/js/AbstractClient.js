/**
 * NoiseBox
 * AbstractClient.js
 *
 * Class definition for an abstract NoiseBox client.
 */

define(["constants","zepto","underscore","socketio","sji"], function (Const) {

    return Class.extend({

        noiseBoxName : "",
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
            this.noiseBoxName = $("body").data("noise-box-name");
            this.env = $("body").data("env");
            this.socket = io.connect(this.host);

            console.log("AbstractClient.init",this.host,this.noiseBoxName===undefined?"":this.noiseBoxName);
        },

        /**
         * Helper function for binding callbacks to socket events from the server.
         *
         * @param event Server event name string.
         * @param callback Callback function reference.
         */
        on : function (event,callback) {

            console.log("AbstractClient.on",event);

            this.socket.on(event,callback);
        },

        /**
         * Helper function for sending socket events to the server.
         *
         * @param event Client event name string.
         */
        emit : function (event,obj) {

            obj = typeof obj !== "undefined" ? obj : {};
            obj = _.extend(obj,{
                noiseBoxName : this.noiseBoxName,
                clientType : this.clientType
            });

            console.log("AbstractClient.emit",event,obj);

            this.socket.emit(event,obj);
        }
    });
});