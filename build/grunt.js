/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    distDir: "../dist",
    srcDir: "../src",
    pkg: '<json:../src/package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },

    lint: {
      build: [
        "./grunt.js",
        "./tasks/*.js"
      ],
      site: [
        "<%= srcDir %>/public/js/*.js",
        "<%= srcDir %>/app/**/*.js"
      ]
    },

    qunit: {
      files: ['test/**/*.html']
    },

    casperjs: {
      files: ['test/casperjs/**/*.js']
    },

    clean : {
      src: ["<%= distDir %>"]
    },

    rsync : {
      dist: {
        src: "<%= srcDir %>/",
        dest: "<%= distDir %>",
        recursive: true,
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
        compareMode: "sizeOnly",
        args: ["--links"],
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
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
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
        browser: true
      },
      globals: {
        jQuery: true,
        $: true,
        _: true,
        define: true,
        require: true,
        module: true,
        console: true,
        io: true,
        Class: true
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks("grunt-contrib");
  grunt.loadNpmTasks("grunt-rsync");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks('grunt-casperjs');

  // Default task.
  grunt.registerTask('default', 'lint:site lint:build qunit');

  // Test task.
  grunt.registerTask('test', 'lint:site lint:build qunit casperjs');

  // Build task.
  grunt.registerTask('dist', 'test clean rsync:dist requirejs:frontend mincss:frontend');

  // Deploy task.
  grunt.registerTask('deploy', 'dist rsync:deploy shell:npmInstall shell:monitRestart');

};
