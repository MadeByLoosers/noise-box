var model = require("../../server").model;

var reapInterval = 1000*60*60*12;   // Reap empty boxes every 12 hours
var staleness = 1000*60*60*6;       // Spare a box from a reaping if its had activity within the last 6 hours

module.exports = function () {
    setInterval(function () {
        var toRemove = [];
        model.noiseBoxes.each(function (noiseBox) {
            if ( Date.now() > (noiseBox.activityTimestamp+staleness) ) {
                toRemove.push(noiseBox);
            }
        });
        toRemove.forEach(function (noiseBox) {
            model.noiseBoxes.remove(noiseBox);
        });
    },reapInterval);
}