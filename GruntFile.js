'use strict';

module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    const sass = require('node-sass');

    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    implementation: sass,
                    sourceMap: true
                },
                files: {
                    'css/styles.css': 'sass/styles.scss'
                }
            }
        },
        watch: {
            files: 'sass/*.scss',
            tasks: ['sass']
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'css/*.css',
                        '*.html',
                        'js/*.js',
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    }
                }
            }
        },
        copy: {
            html: {
                files: [
                    {
                        //for html
                        expand: true,
                        dot: true,
                        cwd: './',
                        src: ['*.html'],
                        dest: 'dist'
                    }]
            },
            fonts: {
                files: [
                    {
                        //for font-awesome
                        expand: true,
                        dot: true,
                        cwd: 'node_modules/font-awesome',
                        src: ['fonts/*.*'],
                        dest: 'dist'
                    }]
            },
            webfonts: {
                files: [
                    {
                        //for font-awesome
                        expand: true,
                        dot: true,
                        cwd: 'node_modules/@fortawesome/fontawesome-free',
                        src: ['webfonts/*.*'],
                        dest: 'dist'
                    }]
            }
        },
        clean: {
            build: {
                src: ['dist/']
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: './',                   // Src matches are relative to this path
                    src: ['img/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'dist/'                  // Destination path prefix
                }]
            }
        },

        useminPrepare: {
            foo: {
                dest: 'dist',
                src: ['index.html'] //'contactus.html','aboutus.html',
            },
            options: {
                flow: {
                    steps: {
                        css: ['cssmin'],
                        js: ['uglify']
                    },
                    post: {
                        css: [{
                            name: 'cssmin',
                            createConfig: function (context, block) {
                                var generated = context.options.generated;
                                generated.options = {
                                    keepSpecialComments: 0, rebase: false
                                };
                            }
                        }]
                    }
                }
            }
        },

        // Concat
        concat: {
            options: {
                separator: ';'
            },

            // dist configuration is provided by useminPrepare
            dist: {}
        },

        // Uglify
        uglify: {
            // dist configuration is provided by useminPrepare
            dist: {}
        },

        cssmin: {
            dist: {}
        },

        // Filerev
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },

            release: {
                // filerev:release hashes(md5) all assets (images, js and css )
                // in dist directory
                files: [{
                    src: [
                        'dist/js/*.js',
                        'dist/css/*.css',
                    ]
                }]
            }
        },

        // Usemin
        // Replaces all assets with their revved version in html and css files.
        // options.assetDirs contains the directories for finding the assets
        // according to their relative paths
        usemin: {
            html: ['dist/index.html'], //'dist/contactus.html','dist/aboutus.html',
            options: {
                assetsDirs: ['dist', 'dist/css', 'dist/js']
            }
        },

        htmlmin: {                                         // Task
            dist: {                                        // Target
                options: {                                 // Target options
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'dist/index.html'  // 'destination': 'source'
                    //,'dist/contactus.html': 'dist/contactus.html',
                    //'dist/aboutus.html': 'dist/aboutus.html',
                }
            }
        }
    });

    grunt.registerTask('css', ['sass']);
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', [
        'sass',
        'clean',
        'copy',
        'imagemin',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);
    grunt.registerTask('cp', ['copy']);
};