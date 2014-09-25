'use strict';

var fs = require("fs"),
  extand = function(target, source) {
    for (var p in source) {
      if (source.hasOwnProperty(p)) {
        target[p] = source[p];
      }
    }
    return target;
  };

module.exports = function(grunt) {

  //grunt.file.defaultEncoding = 'gbk';
  var timestamp = grunt.template.today("yyyymmdd-HH-MM-ss");
  var regStr = '(url\\s*\\(\\s*[\'\"]*\\s*)(?:(?:((?:(?!\\/img\\/)(?!\\}).)*)(\\/img\\/(?:(?!\\))(?![\'\"])(?!\\?).)+))|(img\\/(?:(?!\\))(?![\'\"])(?!\\?).)+))(\\?*[^\"\')]*)';
  var siteConfig = {
    livereload: 35729,
    static: {
      timestamp: timestamp,
      ver: timestamp,
      mods: "../../mods",
      images: "../../images",
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
  /**
   * [parseCSSBgUrl 正则替换css背景图片地址]
   * url(img/test.png => url(../img/test.png?version=123
   * url(/img/test.png => url(../img/test.png?version=123
   * url(./img/test.png => url(../img/test.png?version=123
   * url(../img/test.png => url(../img/test.png?version=123
   * url(http://www.lxj.com/img/test.png => url(http://www.lxj.com/img/test.png?version=123
   * @param  {[string]} str [正则替换前的字符串]
   * @return {[string]}     [正则替换后的字符串]
   */
  function parseCSSBgUrl(str) {
    var mhString = str,
      under,
      mhs = mhString.match(new RegExp(regStr, 'i')),
      cdn = siteConfig.cdn ? siteConfig.cdn.replace(/[\/\\]+$/, '') : '..';
    if (mhs) {
      //console.log(mhs)
      if (mhs[2] !== under) {
        /^http/.test(mhs[2]) && (cdn = '');
        mhString = mhs[1] + (cdn || mhs[2]) + mhs[3] + '?version=' + siteConfig.static.ver;
      } else {
        mhString = mhs[1] + cdn + '/' + mhs[4] + '?version=' + siteConfig.static.ver;
      }
    }
    return mhString
  }

  grunt.initConfig({
    connect: {
      options: {
        port: 9000,
        hostname: '*', // IP，localhost 或域名
        livereload: siteConfig.livereload //watch 监听的端口,
      },
      server: {
        options: {
          open: true, //自动打开网页 http://
          base: [
            'build' //主目录
          ]
        }
      }
    },
    clean: {
      static: {
        src: ['build/pages/*', siteConfig.build.css, siteConfig.build.img]
      },
      compress: {
        src: ['build*.{zip,rar,gzip}']
      }
    },
    copy: {
      imgToAsset: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/img/*', '!**/*.psd'],
          dest: siteConfig.build.img,
          rename: function(dest, src) {
            var reg = /(?:mods|pages)\/(.+)\/img\//g,
              newSrc;
            newSrc = src.replace(reg, function(k1, k2) {
              return k2 === "global" ? '' : (k2 + '/')
            });
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
        }
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
          compress: false
        }
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [{
            match: new RegExp(regStr, 'ig'),
            replacement: function(match) {
              return parseCSSBgUrl(match)
            }
          }]
        },
        files: [{
          expand: true,
          src: ['build/**/*.css'],
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
            var srcDirName = src[0].toString().match(/.+\//)[0],
              pageData = {},
              defaultData = extand({}, siteConfig.static),
              jsonPath = './' + srcDirName + 'data.json';

            if (fs.existsSync(jsonPath)) {
              pageData = require(jsonPath);
            }

            //console.log("dest="+dest,"src="+src,src[0].toString().match(/.+\//)[0])
            //var pageData = require('/locals.json')
            return extand(defaultData, pageData);
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
      livereload: {
        options: {
          livereload: siteConfig.livereload //监听前面声明的端口  35729
        },
        files: [ //下面文件的改变就会实时刷新网页
          'build/**/*'
        ]
      },
      <%
      if (htmlTemplete === "ejs") { %>
          ejs: {
            files: ['src/**/*.html', '**/*.json'],
            tasks: ['ejs']
        },
        <%
      } else { %>
          jade: {
            files: ['**/*.jade', '**/*.json'],
            tasks: ['jade']
        },
        <%
      } %>
        stylus: {
          files: ['**/*.styl'],
          tasks: ['stylus', 'replace']
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
  grunt.loadNpmTasks('grunt-replace'); <%
  if (htmlTemplete === "ejs") { %>
      grunt.loadNpmTasks('grunt-fep-ejs'); <%
  } else { %>
      grunt.loadNpmTasks('grunt-contrib-jade'); <%
  } %>

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.registerTask('default', ['connect:server', 'clean:static', 'copy', '<% if(htmlTemplete==="ejs"){ %>ejs<%}else{%>jade<% } %>', 'stylus', 'replace', 'watch']);
  grunt.registerTask('build', ['imagemin', 'stylus', 'uglify', 'replace', 'cssmin']);
  grunt.registerTask('zip', ['clean:compress', 'compress']);
  grunt.registerTask('publish', '打包发布', function() {
    siteConfig.cdn = "http://image1.webscache.com/kan/<%= staticAsset %>/<%= projectVersion %>/"
    grunt.log.writeln("\n打包发布中.......".green);
    grunt.log.writeln(("cdn地址为:" + siteConfig.cdn).green);
    grunt.task.run(['stylus', 'replace']);
  });

};