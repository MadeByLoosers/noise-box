var server = require("../../server");
var log = require("./log");

var reapInterval = 1000*60*60*12;   // Reap empty boxes every 12 hours
var staleness = 1000*60*60*6;       // Spare a box from a reaping if its had activity within the last 6 hours

module.exports = function () {
    setInterval(function () {
        var toRemove = [];
        server.model.noiseBoxes.each(function (noiseBox) {
            if ( Date.now() > (noiseBox.activityTimestamp+staleness) ) {
                toRemove.push(noiseBox);
            }
        });
        if ( toRemove.length > 0 ) log.info("now reaping "+toRemove.length+" stale boxes");
        toRemove.forEach(function (noiseBox) {
            server.model.noiseBoxes.remove(noiseBox);
        });
    },reapInterval);
};