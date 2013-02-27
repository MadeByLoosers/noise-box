/*global module:false process*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    distDir: "../dist",
    srcDir: "../src",
    testPort: "7002",
    pkg: '<json:../src/package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },

    jshint: {
      build: [
        "./grunt.js",
        "./casperjs/*.js",
        "./tasks/*.js"
      ],
      site: [
        "<%= srcDir %>/public/js/*.js",
        "<%= srcDir %>/app/**/*.js"
      ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          $: true,
          _: true,
          define: true,
          require: true,
          module: true,
          console: true,
          io: true,
          Class: true,
          __dirname: true
        }
      }
    },

    ghost: {
      test: {
        filesSrc: ['test/casperjs/frontend.js'],
        options: {
          direct: true,
          printCommand: true,
          args: {
            port: 7002
          }
        }
      },
    },

    clean : {
      src: ["<%= distDir %>"]
    },

    rsync : {
      dist: {
        src: "<%= srcDir %>/",
        dest: "<%= distDir %>",
        recursive: true,
        args: ['--copy-links'],
        exclude: [
            "scss",
            ".DS_Store",
            ".idea",
            ".git",
            ".gitignore"
        ]
      },
      deploy: {
        src: "<%= distDir %>/",
        dest: "/var/node/noise-box/app",
        recursive: true,
        syncDest: true,
        host: "wintermute",
        exclude: [
          "node_modules"
        ]
      }
    },

    requirejs: {
      frontend: {
        options: {
          baseUrl: "<%= distDir %>/public/js",
          mainConfigFile: "<%= distDir %>/public/js/main.js",
          out: "<%= distDir %>/public/js/main.js",
          name: "main",
          optimize: "uglify",
          removeCombined: false
        }
      }
    },

    mincss: {
      frontend: {
        files: {
          "<%= distDir %>/public/css/style.css": ["<%= distDir %>/public/css/style.css"]
        }
      }
    },

    shell: {
      npmInstall: {
        command: "ssh wintermute 'cd /var/node/noise-box/app; npm install --production;'",
        stdout: true
      },
      monitRestart: {
        command: "ssh wintermute 'sudo monit restart noise-box'",
        stdout: true
      }
    },

    watch: {
      files: '<%= srcDir %>/public/less/*.less',
      tasks: 'less'
    },

    less: {
      development: {
        options: {
          paths: ["<%= srcDir %>/public/less/*.less"]
        },
        files: {
          "<%= srcDir %>/public/css/style.css": "<%= srcDir %>/public/less/*.less"
        }
      },

      uglify: {}
    }
  });

  // grunt.loadNpmTasks("grunt-contrib");
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks("grunt-rsync");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks('grunt-casperjs');
  grunt.loadNpmTasks('grunt-ghost');

  grunt.registerTask('spawn', 'Start app in the background', function () {
    var fs = require('fs'),
       spawn = require('child_process').spawn,
       out = fs.openSync('./out.log', 'a'),
       err = fs.openSync('./out.log', 'a'),
       env = process.env;

    env.NODE_ENV = 'testing';
    env.PORT = 7002;

    grunt.log.writeln('Starting app in the background');
    grunt.log.writeln('stdout and stderr will be logged to out.log');

    var child = spawn('node', ['../src/server.js'], {
     detached: true,
     stdio: [ 'ignore', out, err ],
     env: env
    });

    child.unref();
  });

  // Default task.
  // grunt.registerTask('default', 'lint:site lint:build qunit');
  grunt.registerTask('default', ['less:development', 'jshint:site', 'jshint:build', 'spawn', 'ghost']);

  // Test task.
  grunt.registerTask('test', 'less:development lint:site lint:build qunit spawn ghost');

  // Build task.
  grunt.registerTask('dist', 'test clean rsync:dist requirejs:frontend mincss:frontend');

  // Deploy task.
  grunt.registerTask('deploy', 'dist rsync:deploy shell:npmInstall shell:monitRestart');
};
