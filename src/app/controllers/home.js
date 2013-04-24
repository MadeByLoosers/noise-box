/**
 * NoiseBox
 * home.js
 *
 * Home route controller.
 */

var server = require("./../../server");
var app = server.app;
var io = server.io;
var model = server.model;
var constants = server.constants;
var templateOptions = require("./../middleware/template-options");
var stats = require("./../middleware/stats");
var log = require("../lib/log");

module.exports = function () {

    // Map route to middleware and rendering function:

    app.get("/",templateOptions(),stats(),function (req,res) {

        res.extendTemplateOptions({

            clientType:constants.TYPE_HOME,
            bg: selectRandomBg()
        });

        res.render(constants.TYPE_HOME,res.templateOptions);
    });


    /*
     * Select a bg image from those available in the folder
     */
    function selectRandomBg () {
        var homeModel = model.getHomeModel();
        return homeModel.selectRandomBg();
    }
};