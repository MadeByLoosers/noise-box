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
            constants : "const",
            scrollspy: "lib/bootstrap-scrollspy",
            tabs: "lib/bootstrap-tabs",
            stickyheaders: "lib/jquery.stickysectionheaders",
            timeago: "lib/timeago"
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

    require(["nb","sji"],function (nb) {
        nb.init();
    });
}());