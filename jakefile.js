/*global desc, task, jake, fail, complete */
(function(){
    "use strict";

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("lint everything");
    task("lint", [], function () {
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        files.exclude("public/js/lib");
        var options = nodeLintOptions();
        var passed = lint.validateFileList(files.toArray(), nodeLintOptions(), {});
//        var passed = lint.validateFile('app/controllers/home.js');
        if (!passed) { fail('Lint failed'); }
    });

    desc("Test everything");
    task("test", [], function(){
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(["_server-test.js"], null, function(failures){
          console.log("tests done");
          complete();
        });
    }, {async: true});

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