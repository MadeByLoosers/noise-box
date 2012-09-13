/**
 * NoiseBox
 * error.js
 *
 * Custom error handling middleware.
 */

var fs = require("fs");
var constants = require("./../../public/js/constants");

module.exports = function () {

    return function (err,req,res,next) {

        // Sanity check the supplied error object:

        err = typeof err !== "undefined" ? err : {};
        err = typeof err !== "object" ? {name:err.toString()} : err;

        // Set default properties in case of missing information:

        err.statusCode = typeof err.status !== "undefined" ? err.status : err.statusCode;
        err.statusCode = typeof err.statusCode !== "undefined" ? err.statusCode : 500;
        err.stack = typeof err.stack !== "undefined" ? err.stack : "";
        err.name = typeof err.name !== "undefined" ? err.name : "NoiseBoxError";
        err.message = typeof err.message !== "undefined" ? err.message : "No details";

        // Set information to be rendered depending on the environment.
        // A production environment just cases a non-specific error message to be displayed
        // while any other environment (testing/development).

        var env = process.env.NODE_ENV || constants.DEV;

        var error;
        var stack;

        if ( env === constants.PROD ) {

            error = "Something went wrong.";
            stack = "";

        } else {

            error = err.name+" ("+err.statusCode+")";

            // Clean up and format the stack output:

            stack = err.stack.split("\n").map(function (element) {
                if ( element.indexOf("|") > -1 || element === "" )
                {
                    return "";
                } else {
                    return "<li>"+htmlEscape(element)+"</li>";
                }
            }).join("");
        }

        // Implement light-weight template rendering. The reason we can't use res.render() here is
        // because we can't be sure where the error is bubbling up from (it could be in the template
        // code) so we have to have as few depandancies on app code as possible for robust error
        // rendering.

        fs.readFile(__dirname + "/../../public/html/error.html", "utf8", function(e,html) {

            html = html.replace(/\{title\}/g,constants.APP_TITLE);
            html = html.replace("{error}",htmlEscape(error));
            html = html.replace("{stack}",stack);

            res.writeHead(err.statusCode,{"Content-Type":"text/html; charset=utf-8"});
            res.end(html);
        });

        console.error("(%d) %s",err.statusCode,err.stack);
    };

    function htmlEscape (text) {

        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};