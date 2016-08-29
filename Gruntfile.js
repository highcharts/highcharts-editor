module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          "./src/highcharts-editor.js",
          "./src/highed.dom.js",
          "./src/highed.events.js",
          "./src/highed.editor.js",
          "./src/highed.dimmer.js",
          "./src/highed.overlaymodal.js",
          "./src/highed.hsplitter.js",
          "./src/highed.tabcontrol.js",
          "./src/highed.inspector.js",
          "./src/highed.inspector.field.js",
          "./src/highed.list.js",
          "./src/meta/highed.meta.charts.js",
          "./src/meta/highed.meta.options.extended.js",
          "./src/meta/highed.meta.colors.js",
          "./src/meta/highed.meta.fonts.js",
          "./src/highed.chart.template.selector.js",
          "./src/highed.chart.customizer.js",
          "./src/highed.wizstepper.js",
          "./src/highed.toolbar.js",
          "./src/highed.wizbar.js",
          "./src/highed.colorpicker.js",
          "./src/highed.fontpicker.js",
          "./src/highed.pushbutton.js",
          "./src/highed.tooltip.js",
          "./src/highed.snackbar.js",
          "./src/highed.dataimporter.js",
          "./src/highed.fileupload.js",
          "./src/highed.tree.js",
          "./src/highed.exporter.js",
          "./src/highed.modaleditor.js"
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
          'app/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    electron: {
      macosBuild: {
        options: {
          name: 'Highcarts Editor',
          dir: 'app',
          out: 'dist/electron',
          version: '1.3.4',
          platform: 'darwin',
          arch: 'x64'
        }
      }
    },

    less: {   
      development: {
        options: {
          paths: 'less/'     
        },
        files: {
          'dist/<%= pkg.name %>.min.css': 'less/theme.default.less',
          'app/<%= pkg.name %>.min.css': 'less/theme.default.less'
        }        
      },
      production: {
        options: {
          paths: 'less/',
          plugins: [
            new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
            new (require('less-plugin-clean-css'))({})
          ]        
        },
        files: {
          'dist/<%= pkg.name %>.min.css': 'less/theme.default.less',
          'app/<%= pkg.name %>.min.css': 'less/theme.default.less'
        }        
      }    
    },

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-electron');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less']);
  
  grunt.registerTask('native', ['jshint', 'concat', 'uglify', 'less', 'electron']);
};