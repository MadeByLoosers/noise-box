/**
 * NoiseBox
 * main.js
 *
 * Clientside JS entry point.
 */

(function () {

    "use strict";

    require.config({

        paths : {
            jquery : "lib/jquery",
            underscore : "lib/underscore",
            sji : "lib/sji",
            constants : "const"
        },
        shim : {
            jquery : {
                exports : "$"
            },
            sji : {
                exports : "Class"
            },
            underscore : {
                exports : "_"
            },
            constants : {
                exports : "Const"
            }
        }
    });

    require(["nb"],function (nb) {

        nb.init();
    });
}());