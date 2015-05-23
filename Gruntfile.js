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
      scsslint: {
        files: 'source/_scss/**/*.scss',
        tasks: ['scsslint', 'autoprefixer']
      },
      css: {
        files: 'source/_scss/**/*.scss',
        tasks: 'sass'
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
    scsslint: {
      allFiles: 'source/_scss/**/*.scss',
      options: {
        config: 'source/_scss/.scss-lint.yml'
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
  grunt.registerTask('default', ['sass', 'scsslint', 'browserSync', 'watch']);
  grunt.registerTask('sans-lint', ['sass', 'browserSync', 'watch:css']);
};