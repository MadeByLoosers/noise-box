/**
 * NoiseBox
 * routes.js
 *
 * Handles the rendering of the various app states. Contains a reference to the model so that it
 * can make simple queries before rendering.
 */

var _ = require("underscore");
var fh = require("../../lib/file-helper");

module.exports = function(app,model) {

    // Available views

    var HOME_VIEW = "home";
    var HOST_VIEW = "host";
    var USER_VIEW = "user";

    // Default template options

    var defaultTemplateOptions = {

        title : "NoiseBox",
        bodyid : ""
    };

    // Map GET routes to views

    app.get("/",homeView);
    app.get("/host/:name",hostView);
    app.get("/:name",userView);

    // Map POST actions to methods

    app.post("/host/",createNoiseBox);

    /**
     * Handle a request to view the app home page. This page allows a user to create a new
     * NoiseBox.
     */
    function homeView (req,res) {

        render(res,HOME_VIEW,{});
    }

    /**
     * Handle a request to access a NoiseBox's host page. The host page plays audio based on the
     * actions of the user's interacting with the NoiseBox's user page.
     */
    function hostView (req,res) {
        
        var name = req.params.name;
        var url = req.headers.host;

        var noiseBox = model.getNoiseBox(name);

        render(res,HOST_VIEW,{
            url : url,
            name : name,
            numHosts : typeof noiseBox !== "undefined" ? noiseBox.hosts.length : 0,
            numUsers : typeof noiseBox !== "undefined" ? noiseBox.users.length : 0
        });
    }

    /**
     * Handle a request to access a NoiseBox's user page. The user page allows users to add tracks
     * to a NoiseBox's playlist.
     */
    function userView (req,res) {

        var name = req.params.name;

        fh.listFiles("./public/sfx",function (err,files) {

            render(res,USER_VIEW,{
                files : files,
                name : name
            });
        });
    }

    /**
     * Handle a POST request from the "create new NoiseBox" form on the home page. Redirects to the
     * /host/name page for the requested NoiseBox.
     */
    function createNoiseBox (req,res) {

        var name = req.body.name;

        if ( name ) {
            res.redirect("/host/"+name);
        } else {
            res.redirect("/");
        }
    }

    /**
     * Template rendering helper function.
     * Template name and <body> id are deemed to be synonymous.
     *
     * @param res Node resource.
     * @param template EJS template name.
     * @param options Template options.
     */
    function render (res,template,options) {

        options = _.extend(defaultTemplateOptions,options);

        options.bodyid = template;

        res.render(template,options);
    }
};