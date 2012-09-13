/**
 * NoiseBox
 * stats.js
 *
 * Middleware for adding app stats to the res object.
 */

var server = require("./../../server");
var model = server.model;

module.exports = function () {
    "use strict";

    return function (req,res,next) {

        var numNoiseBoxes = model.noiseBoxes.length;
        var numClients = model.getNumConnectedClients();

        var numHosts = 0;
        var numUsers = 0;

        if ( typeof req.params.id !== "undefined") {

            model.noiseBoxes.each(function (nb) {

                if ( req.params.id === nb.get("id") ) {

                    numHosts = nb.hosts.length;
                    numUsers = nb.users.length;
                }
            });
        }

        res.extendTemplateOptions({

            numNoiseBoxes : numNoiseBoxes,
            numClients : numClients,
            numHosts : numHosts,
            numUsers : numUsers
        });

        next();
    };
};