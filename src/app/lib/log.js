var winston = require("winston");
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
 */

var consoleTransport = new (winston.transports.Console)({
    level: "info",
    timestamp: true
});

var transports = [consoleTransport];

module.exports = new (winston.Logger)({transports:transports});
