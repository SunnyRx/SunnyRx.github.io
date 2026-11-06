module.exports = function(grunt) {
    var fs = require('node:fs');
    var path = require('node:path');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            main: {
                src: 'js/<%= pkg.name %>.js',
                dest: 'js/<%= pkg.name %>.min.js'
            }
        },
        less: {
            expanded: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/<%= pkg.name %>.css": "less/<%= pkg.name %>.less"
                }
            }
        },
        cssmin: {
            options: {
                level: 1,
                rebase: false
            },
            main: {
                files: {
                    "css/<%= pkg.name %>.min.css": "css/<%= pkg.name %>.css"
                }
            }
        },
        banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
        usebanner: {
            options: {
                banner: '<%= banner %>'
            },
            scripts: {
                files: {
                    src: ['js/<%= pkg.name %>.min.js']
                }
            },
            styles: {
                files: {
                    src: ['css/<%= pkg.name %>.css', 'css/<%= pkg.name %>.min.css']
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/<%= pkg.name %>.js'],
                tasks: ['scripts'],
                options: {
                    spawn: false,
                },
            },
            less: {
                files: ['less/**/*.less'],
                tasks: ['styles'],
                options: {
                    spawn: false,
                }
            },
        },
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerMultiTask('usebanner', 'Preserve the project copyright banner.', function() {
        var banner = this.options().banner;
        this.filesSrc.forEach(function(filename) {
            var content = grunt.file.read(filename);
            if (content.indexOf(banner) !== 0) {
                grunt.file.write(filename, banner + content);
            }
        });
    });

    // Copy the full official build verbatim, including its license notices.
    grunt.registerTask('vendor', 'Sync the pinned jQuery distribution.', function() {
        var jqueryDist = path.dirname(require.resolve('jquery'));
        ['jquery.js', 'jquery.min.js'].forEach(function(filename) {
            fs.copyFileSync(path.join(jqueryDist, filename), path.join('js', filename));
        });
        grunt.log.ok('Synced the full jQuery distribution.');
    });

    grunt.registerTask('scripts', ['uglify', 'usebanner:scripts']);
    grunt.registerTask('styles', ['less', 'cssmin', 'usebanner:styles']);
    grunt.registerTask('default', ['vendor', 'scripts', 'styles']);

};
