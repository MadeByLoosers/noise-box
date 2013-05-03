/**
 * NoiseBox
 * boot.js
 *
 * Boot route controller, allows the client side code to redirect with a 
 * flash message displayed after the redirect
 */

var server = require("./../../server");
var app = server.app;
var templateOptions = require("./../middleware/template-options");

app.get('/boot', templateOptions(), function(req, res, next){
    req.session.flashMessage = req.query.m;
    res.redirect("/");
    return;
});
