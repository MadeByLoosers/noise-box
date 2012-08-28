/**
 * NoiseBox
 * stats.js
 *
 * Middleware for adding stats to the res object.
 */

var server = require("./../../server");
var model = server.model;

module.exports = function () {

    return function (req,res,next) {

        var numNoiseBoxes = model.noiseBoxes.length;
        var numClients = model.getNumConnectedClients();

        var numHosts = 0;
        var numUsers = 0;

        model.noiseBoxes.each(function (noiseBox) {

            if ( typeof req.params.name !== "undefined") {

                if ( req.params.name === noiseBox.name ) {

                    numHosts = noiseBox.hosts.length;
                    numUsers = noiseBox.clients.length;
                }
            }
        });


        res.extendTemplateOptions({
            numNoiseBoxes : numNoiseBoxes,
            numClients : numClients,
            numHosts : numHosts,
            numUsers : numUsers
        });

        next();
    };
};