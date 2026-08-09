/* eslint-disable import/no-extraneous-dependencies */

'use strict';

const Terser = require('terser');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-exorcise');

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true,
        compact: false,
      },
      dist: {
        files: [
          {
            expand: true,
            src: ['./lib/**/*.js', './spec/browser/*.js'],
            dest: './build/',
          },
        ],
      },
    },
    browserify: {
      options: {
        transform: [
          [
            'babelify',
            {
              // enable babel transpile for node_modules
              global: true,
              presets: ['@babel/preset-env'],
              // core-js should not be transpiled
              // See https://github.com/zloirock/core-js/issues/514
              ignore: [/node_modules[\\/]core-js/],
            },
          ],
        ],
        browserifyOptions: {
          // enable source map for browserify
          debug: true,
          standalone: 'ExcelJS',
        },
      },
      bare: {
        // keep the original source for source maps
        src: ['./lib/exceljs.bare.js'],
        dest: './dist/exceljs.bare.js',
      },
      bundle: {
        // keep the original source for source maps
        src: ['./lib/exceljs.browser.js'],
        dest: './dist/exceljs.js',
      },
      spec: {
        options: {
          transform: null,
          browserifyOptions: null,
        },
        src: ['./build/spec/browser/exceljs.spec.js'],
        dest: './build/web/exceljs.spec.js',
      },
    },

    terser: {
      options: {
        format: {
          preamble: '/*! ExcelJS <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          ascii_only: true,
        },
      },
      dist: {
        options: {
          // Keep the original source maps from browserify
          // See also https://www.npmjs.com/package/terser#source-map-options
          sourceMap: {
            content: 'inline',
            url: 'exceljs.min.js.map',
          },
        },
        files: {
          './dist/exceljs.min.js': ['./dist/exceljs.js'],
        },
      },
      bare: {
        options: {
          // Keep the original source maps from browserify
          // See also https://www.npmjs.com/package/terser#source-map-options
          sourceMap: {
            content: 'inline',
            url: 'exceljs.bare.min.js.map',
          },
        },
        files: {
          './dist/exceljs.bare.min.js': ['./dist/exceljs.bare.js'],
        },
      },
    },

    // Move source maps to a separate file
    exorcise: {
      bundle: {
        options: {},
        files: {
          './dist/exceljs.js.map': ['./dist/exceljs.js'],
          './dist/exceljs.bare.js.map': ['./dist/exceljs.bare.js'],
        },
      },
    },

    copy: {
      dist: {
        files: [
          {expand: true, src: ['**'], cwd: './build/lib', dest: './dist/es5'},
          {src: './build/lib/exceljs.nodejs.js', dest: './dist/es5/index.js'},
          {src: './LICENSE', dest: './dist/LICENSE'},
        ],
      },
    },

    jasmine: {
      options: {
        version: '3.8.0',
        noSandbox: true,
      },
      dev: {
        src: ['./dist/exceljs.js'],
        options: {
          specs: './build/web/exceljs.spec.js',
        },
      },
    },
  });

  // grunt-terser reports a minification failure through grunt.log.error and then
  // returns from a forEach callback, which neither fails the task nor stops the
  // build. The previous dist/*.min.js survives untouched, so a broken bundle
  // looks exactly like a successful build. Drive terser ourselves instead.
  grunt.registerMultiTask('terser', 'Minify the browser bundles', function() {
    const options = this.options();
    const done = this.async();

    const minify = async file => {
      const sources = file.src.reduce(
        (acc, filepath) => Object.assign(acc, {[filepath]: grunt.file.read(filepath)}),
        {}
      );

      let result;
      try {
        result = await Terser.minify(sources, options);
      } catch (error) {
        throw new Error(`Failed to minify ${file.dest}: ${error.message}`);
      }

      grunt.file.write(file.dest, result.code);
      if (options.sourceMap) {
        grunt.file.write(`${file.dest}.map`, result.map);
      }
      grunt.verbose.writeln(`File "${file.dest}" created.`);
    };

    Promise.all(this.files.map(minify)).then(
      () => done(),
      error => {
        grunt.log.error(error.message);
        done(false);
      }
    );
  });

  grunt.registerTask('build', ['babel:dist', 'browserify', 'terser', 'exorcise', 'copy']);
  grunt.registerTask('ug', ['terser']);
};
