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
var fs = require("fs");

module.exports = function () {

    // Map route to middleware and rendering function:

    app.get("/",templateOptions(),stats(),function (req,res) {

        res.extendTemplateOptions({

            clientType:constants.TYPE_HOME,
            bg: selectRandomBg()
        });

        res.render(constants.TYPE_HOME,res.templateOptions);
    });

    // prove we own the domain for Gandi SSL cert
    var ssl_confirm_file = 'CBD1F10D3FD257184D2D96073BFF07E7.txt';
    app.get('/' + ssl_confirm_file, function (req,res) {
        fs.readFile('./' + ssl_confirm_file, function(err, data) {
            if (err) throw err;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(data);
        });
    });


    /*
     * Select a bg image from those available in the folder
     */
    function selectRandomBg () {
        var homeModel = model.getHomeModel();
        return homeModel.selectRandomBg();
    }
};
