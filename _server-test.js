"use strict";

var server = require('./server.js');

exports.testNothing = function(test){
    test.equals(3, 3, "number");
    test.done();
};