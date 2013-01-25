/*global process*/
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
var AbstractController = require("./abstract.js");
var _ = require("underscore");

module.exports = function () {
  // Only active in the test environment
  console.log('test env is killing the server');
  console.log('goodbye...');
  process.exit();
};