'use strict';

var fepUtil = require('fep-util');

module.exports = function(grunt) {

  //grunt.file.defaultEncoding = 'gbk';
  var pkg = grunt.file.readJSON("package.json");
  var timestamp = grunt.template.today("yyyymmdd-HH-MM-ss");
  var siteConfig = {
    livereload: 35729,
    static: {
      request: null,
      location: null,
      reqUrl: '',
      debug: false,
      staticAsset: '<%= staticAsset %>',
      projectVersion: '<%= projectVersion %>',
      timestamp: timestamp,
      ver: timestamp,
      mods: "../../mods",
      images: "../../images",
      imagephp: "http://10.1.3.17/dummyimage/image.php?",
      css: "../../<%= staticAsset %>/<%= projectVersion %>/css",
      img: "../../<%= staticAsset %>/<%= projectVersion %>/img",
      js: "../../<%= staticAsset %>/<%= projectVersion %>/js"
    },
    build: {
      css: "build/<%= staticAsset %>/<%= projectVersion %>/css",
      img: "build/<%= staticAsset %>/<%= projectVersion %>/img",
      js: "build/<%= staticAsset %>/<%= projectVersion %>/js"
    }
  }

  grunt.initConfig({
    pkg: pkg,
    connect: {
      options: {
        port: <%= nodeServerPort %>,
        hostname: '*', // IP，localhost 或域名
        livereload: siteConfig.livereload //watch 监听的端口,
      },
      server: {
        options: {
          open: true, //自动打开网页 http://
          base: './', //主目录
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(fepUtil.ejsCompile({
              serverOtions: options,
              data: siteConfig.static,
              //defaultData : {grunt:'lllkkkk',img:"http://yuncdn.org/"}
              defaultData: function() {
                return {
                  img: this.debug ? "/build/<%= staticAsset %>/<%= projectVersion %>/img" : siteConfig.build.img
                }
              }
            }));
            middlewares.unshift(fepUtil.stylusCompile);
            return middlewares;
          }
        }
      }
    },
    clean: {
      static: {
        src: ['build/pages/*', siteConfig.build.css, siteConfig.build.img]
      },
      compress: {
        src: ['build*.{zip,rar,gzip}']
      },
      seajs: {
        src: ['.build']
      }
    },
    transport: {
      options: {
        paths: ['build/<%= staticAsset %>/<%= projectVersion %>/js/']
        //alias: pkg.spm.alias
      },
      src: {
        options: {
          idleading: '../../'
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['mods/**/*.js', '!mods/**/sea.js', '!mods/**/sea1.3-debug.js', '!mods/**/rootConfig.js'],
          filter: 'isFile',
          dest: '.build/'
        }]
      },
      pages: {
        options: {
          idleading: '../../../<%= staticAsset %>/<%= projectVersion %>/js/'
        },
        files: [{
          expand: true,
          cwd: 'src/pages/',
          src: '**/*.js',
          filter: 'isFile',
          dest: '.build/pages/'
        }]
      }
    },
    concat: {
      options: {
        paths: ['build/<%= staticAsset %>/<%= projectVersion %>/js/'],
        include: 'all'
      },
      pages: {
        files: [{
          expand: true,
          flatten: true,
          cwd: '.build/',
          src: ['pages/**/*.js', '!pages/**/*-debug.js'],
          dest: './build/<%= staticAsset %>/<%= projectVersion %>/js/',
          ext: '.js'
        }]
      }
    },
    copy: {
      imgToAsset: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/img/**', '!**/*.psd'],
          dest: siteConfig.build.img,
          rename: function(dest, src) {
            var reg = /(?:mods|pages)\/(.+)\/img\//g,
              newSrc;
            newSrc = src.replace(reg, '');
            return src === newSrc ? '' : (siteConfig.build.img.replace(/^\/+/, '') + '/' + newSrc)
          }
        }]
      }
    },
    imagemin: {
      cdn: {
        files: [{
          expand: true,
          cwd: '',
          src: ['build/**/*.{png,jpg,jpeg,gif}'],
        }]
      }
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        },
        footer: "\n/**Create by Fep at " + grunt.template.today("yyyymmdd HH:MM:ss") + "**/\n"
      },
      target: {
        files: [{
          expand: true,
          src: ['build/**/*.js'],
        }]
      }
    },
    cssmin: {
      target: {
        options: {
          banner: '/* build by grunt cssmin at ' + grunt.template.today("yyyy-mm-dd HH:MM:ss") + ' */'
        },
        files: [{
          expand: true,
          src: ['build/**/*.css'],
        }]
      }
    },
    compress: {
      main: {
        options: {
          archive: 'build' + grunt.template.today("yyyymmdd-HH-MM-ss") + '.zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['**'],
          dest: '.'
        }]
      }
    },
    stylus: {
      compile: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'src',
          src: ['pages/**/*.styl'],
          dest: siteConfig.build.css,
          ext: '.css'
        }],
        options: {
          banner: "/**Create by Fep at " + grunt.template.today("yyyymmdd HH:MM:ss") + "**/\n",
          compress: true
        }
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [{
            match: new RegExp(fepUtil.regStr, 'ig'),
            replacement: function(match) {
              return fepUtil.parseCSSBgUrl(match, {
                cdn: siteConfig.cdn,
                version: siteConfig.static.ver
              })
            }
          }]
        },
        files: [{
          expand: true,
          src: ['build/**/*.css'],
          dest: '.'
        }]
      },
      seajs: {
        options: {
          patterns: [{
            match: /(?:\.\.\/){3}<%= staticAsset %>\/<%= projectVersion %>\/js\/[^"']+/ig,
            replacement: function(matchStr) {
              var matchs = matchStr.match(/(.+)(\/.+)(\/.+)/i);
              return matchs ? ('.'+matchs[3]) : matchStr
            }
          }]
        },
        files: [{
          expand: true,
          src: ['build/**/*.js'],
          dest: '.'
        }]
      }
    },
    <%
    if (htmlTemplete === "ejs") { %> ejs <%
    } else { %> jade <%
    } %> : {
      compile: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['pages/**/*.<% if(htmlTemplete==="ejs"){ %>html<%}else{%>jade<% } %>'],
          dest: 'build',
          ext: '.html'
        }],
        options: {
          pretty: true,
          data: function(dest, src) {
            return fepUtil.tplData(src[0], siteConfig.static);
          }
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      with_overrides: {
        options: {
          curly: false,
          undef: true
        },
        files: {
          src: ['build/**/*.js', 'src/**/*.js']
        }
      }
    },
    watch: {
      options: {
        persistent: true,
        interval: 5007
      },
      livereload: {
        options: {
          livereload: siteConfig.livereload //监听前面声明的端口  35729
        },
        files: [ //下面文件的改变就会实时刷新网页
          'build/**/*',
          'src/**/*'
        ]
      },
      <%
      if (htmlTemplete === "ejs") { %>
          ejs: {
            files: ['src/**/*.html', 'src/**/*.json'],
            tasks: ['ejs']
        },
        <%
      } else { %>
          jade: {
            files: ['src/**/*.jade', 'src/**/*.json'],
            tasks: ['jade']
        },
        <%
      } %>
        stylus: {
          files: ['**/*.styl'],
          tasks: ['stylus', 'replace:dist']
      },
      copy: {
        files: ['src/**/*.{png,jpg,jpeg,gif}'],
        tasks: ['copy']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat'); <%
  if (htmlTemplete === "ejs") { %>
      grunt.loadNpmTasks('grunt-fep-ejs'); <%
  } else { %>
      grunt.loadNpmTasks('grunt-contrib-jade'); <%
  } %>

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.registerTask('default', ['connect:server', 'clean:static', 'copy', '<% if(htmlTemplete==="ejs"){ %>ejs<%}else{%>jade<% } %>', 'stylus', 'replace:dist', 'watch']);
  grunt.registerTask('server', ['connect:server','watch:livereload']);
  grunt.registerTask('build', ['imagemin', 'stylus', 'uglify', 'replace:dist', 'cssmin']);
  grunt.registerTask('zip', ['clean:compress', 'compress']);
  grunt.registerTask('seajs', ['transport', 'concat', 'uglify', 'clean:seajs', 'replace:seajs']);
  grunt.registerTask('publish', '打包发布', function() {
    siteConfig.cdn = "http://image1.webscache.com/kan/<%= staticAsset %>/<%= projectVersion %>/"
    grunt.log.writeln("\n打包发布中.......".green);
    grunt.log.writeln(("cdn地址为:" + siteConfig.cdn).green);
    grunt.task.run(['stylus', 'replace:dist']);
  });

};