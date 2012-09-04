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
            host : "http://"+req.headers.host,
            env : server.env,
            noiseBoxName : "",
            flashMessage : typeof req.session.flashMessage === "undefined"  ? "" : req.session.flashMessage
        };

        req.session.flashMessage = undefined;

        res.extendTemplateOptions = function (o) {

            this.templateOptions = _.extend(this.templateOptions,o);
        };

        next();
    };
};