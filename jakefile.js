task("default", ["lint"], function(){
    console.log("default");
});

desc("lint everything");
task("lint", [], function () {
    console.log("Linting files");

    var lint = require("./build/lint/lint_runner.js");
    lint.validateFile("jakefile.js", {});
});

desc("Example!");
task("example", ["dependency"], function(){
    console.log("example task");
});

task("dependency", function(){
    console.log("dependency");
});