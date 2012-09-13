/*global desc, task, jake, fail, complete */

task("default", ["lint"], function(){
    console.log("default");
});

desc("lint everything");
task("lint", [], function () {
    console.log("Linting files");
    var lint = require("./build/lint/lint_runner.js");

    var files = new jake.FileList();
    files.include("**/*.js");
    files.exclude("node_modules");
    files.exclude("public/js/lib");
    files.exclude("build");

    var options = {
        node: true
    };

    lint.validateFileList(files.toArray(), {}, {});
});