/**
 * NoiseBox
 * templateOptions.js
 *
 * Middleware for adding a default template options object to the res object.
 */

var _ = require("underscore");
var constants = require("./../../public/js/const");
var server = require("./../../server");

module.exports = function () {

    return function (req,res,next) {

        res.templateOptions = {

            clientType : "",
            title : constants.APP_TITLE,
            host : server.env === constants.PROD ? "http://noisebox.wintermute.co.uk:"+server.port : "http://localhost:"+server.port,
            env : server.env,
            noiseBoxName : ""
        };

        res.extendTemplateOptions = function (o) {

            this.templateOptions = _.extend(this.templateOptions,o);
        };

        next();
    };
};