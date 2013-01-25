var winston = require("winston");
var Loggly = require("winston-loggly");
var config = require("../../config");
var server = require("../../server.js");

/**
 * Usage:
 *
 * var log = require("./app/lib/log");
 *
 * var meta = {};
 *
 * log.info("Some informational message",meta);
 * log.warn("Some warning message",meta);
 * log.error("Some error message",meta);
 *
 * "meta" parameter is any object you'd like to inspect/print out along with the
 * log message string (uses util.inspect).
 *
 * Loggly transport is only added when in production mode (i.e. NODE_ENV set to
 * the string "production").
 */

var consoleTransport = new (winston.transports.Console)({
    level: "info",
    timestamp: true
});

var logglyTransport = new winston.transports.Loggly({
    level: "info",
    subdomain: "seisaku",
    inputToken: config.logglyInputToken
});

var transports = [consoleTransport];

if ( server.env === "production" ) {
    transports.push(logglyTransport);
}

module.exports = new (winston.Logger)({transports:transports});