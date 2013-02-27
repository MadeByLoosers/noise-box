/**
 * NoiseBox
 * templateOptions.js
 *
 * Middleware for adding a default template options object to the res object. Also exposes a
 * flashMessage property which can be used to pass one-time messages to the next request via
 * sessions.
 */

var _ = require("underscore");
var server = require("./../../server");
var constants = server.constants;
var config = require("./../../config");


module.exports = function () {

    return function (req,res,next) {

        res.templateOptions = {

            clientType : "",
            title : constants.APP_TITLE,
            heading : constants.APP_TITLE,
            host : 'http://' + req.headers.host,
            env : server.env,
            id : "",
            flashMessage : typeof req.session.flashMessage === "undefined"  ? "" : req.session.flashMessage
        };

        req.session.flashMessage = undefined;

        res.extendTemplateOptions = function (o) {

            this.templateOptions = _.extend(this.templateOptions,o);
        };

        next();
    };
};