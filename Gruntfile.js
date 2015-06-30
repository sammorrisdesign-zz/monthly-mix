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
      css: {
        files: 'source/_scss/**/*.scss',
        tasks: ['sass', 'autoprefixer', 'cssmin']
      },
      js: {
        files: 'source/_js/**/*.js',
        tasks: 'requirejs'
      },
      jekyll: {
        files: ['source/**/*', '!source/_site/**/*'],
        tasks: 'shell'
      }
    },
    sass: {
      dist: {
        files: {
            'source/assets/css/style.css' : 'source/_scss/style.scss'
        }
      }
    },
    autoprefixer: {
      dist: {
        src: 'source/assets/css/style.css'
      }
    },
    cssmin: {
      target: {
        files: [{
          'source/assets/css/style.min.css' : 'source/assets/css/style.css'
        }]
      }
    },
    shell: {
      run: {
        command: 'cd source && jekyll build',
        options: {
          nospawn: true
        }
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
    },
    browserSync: {
      bsFiles: {
        src : ['source/_site/**/*.html', 'source/_site/**/*.css', 'source/_site/**/*.js']
      },
      options: {
        watchTask: true,
        server: {
          baseDir: "source/_site"
        }
      }
    }
  });

  // Tasks
  grunt.registerTask('default', ['sass', 'browserSync', 'watch']);
};