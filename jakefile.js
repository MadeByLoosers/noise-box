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
        lint.validateFileList(files.toArray(), nodeLintOptions(), {});
//        lint.validateFile('jakefile.js', options, {});
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