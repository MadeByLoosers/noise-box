/*global desc, task, jake, fail, complete */
(function(){
    "use strict";

    task("default", ["lint"], function(){
        console.log("running default tasks");
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
        var options = nodeLintOptions();
        var passed = lint.validateFileList(files.toArray(), nodeLintOptions(), {});
        if (!passed) { fail('Lint failed'); }
    });

    desc("Integrate");
    task("integrate", ["default"], function () {
        // write a manual integration server
        console.log("1. Make sure 'git status' is clean.");
        console.log("2. Build on the integration box");
        console.log("   a. Walk over to the integration box.");
        console.log("   b. 'git pull'");
        console.log("   c. 'jake'");
        console.log("   d. If jake fails, stop! Try again after fixing the issue.");
        console.log("3. 'git checkout integration'");
        console.log("4. 'git merge master --no-ff --log'");
        console.log("4. 'git checkout master'");
    });

    function nodeLintOptions() {
        return {
            bitwise:true,
            curly:false,
            eqeqeq:true,
            forin:true,
            immed:true,
            latedef:true,
            newcap:true,
            noarg:true,
            noempty:true,
            nonew:true,
            regexp:true,
            undef:true,
            strict:true,
            trailing:true,
            node:true
        };
    }
}());