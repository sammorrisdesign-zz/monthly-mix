/*global module:false*/
module.exports = function(grunt) {
  require('jit-grunt')(grunt);
  grunt.loadNpmTasks('grunt-scss-lint');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    watch: {
      js: {
        files: 'source/_js/**/*.js',
        tasks: 'requirejs'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'source/_js/',
          config: 'source/_js/config.js',
          name: 'main',
          paths: {
            "sc": 'http://connect.soundcloud.com/sdk'
          },
          out: 'source/assets/js/main.min.js',
          findNestedDependencies: true
        }
      }
    }
  });

  // Tasks
  grunt.registerTask('default', ['watch']);
};