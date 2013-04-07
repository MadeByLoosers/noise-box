/**
 * NoiseBox
 * HomeClient.js
 *
 * Home page.
 */

define(function (require) {

    var $ = require("jquery");

    return Class.extend({
        init : function () {
            $(".flash-message p:parent").parent().slideDown(250).delay(5000).slideUp(250);
            $("#id").focus();
        }
    });
});