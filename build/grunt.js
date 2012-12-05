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
        "<%= srcDir %>/jpublic/js/*.js",
        "<%= srcDir %>/app/**/*.js"
      ]
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
        }
      },

    qunit: {
      files: ['test/**/*.html']
    },

    // concat: {
    //   dist: {
    //     src: ['<%= srcDir %>public/js/**/*.js'],
    //     dest: '<%= distDir %>/<%= pkg.name %>.js'
    //   }
    // },

    // min: {
    //   dist: {
    //     src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
    //     dest: 'dist/<%= pkg.name %>.min.js'
    //   }
    // },

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

  grunt.loadNpmTasks('grunt-clean');

  // Default task.
  grunt.registerTask('default', 'lint:site qunit');

  // Build task.
  grunt.registerTask('build', 'default clean rsync:dist');

  // Deploy task.
  grunt.registerTask('deploy', 'build');
};
