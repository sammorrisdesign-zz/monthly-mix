/*global module:false*/
module.exports = function(grunt) {

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
        tasks: 'scsslint'
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
        src : 'source/_site/**/*'
      },
      options: {
        watchTask: true,
        server: {
          baseDir: "source/_site"
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-shell');

  // Tasks
  grunt.registerTask('default', ['sass', 'scsslint', 'browserSync', 'watch']);
  grunt.registerTask('sans-lint', ['sass', 'browserSync', 'watch:css']);
};