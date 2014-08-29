'use strict';

var fs = require("fs");

function extand(target, source) {
  for (var p in source) {
      if (source.hasOwnProperty(p)){
          target[p] = source[p];
      }
  }
  return target;
}

module.exports = function(grunt) {

  //grunt.file.defaultEncoding = 'gbk';
  var siteConfig={
    static :{
      timestamp: "<%= new Date().getTime() %>",
      ver: '?' + new Date().getTime(),
      mods : "../../mods",
      images : "../../images",
      css : "../../<%= appname %>_assets/1.0/css",
      img : "../../<%= appname %>_assets/1.0/img",
      js : "../../<%= appname %>_assets/1.0/js"
    },
    build:{
      css : "build/<%= appname %>_assets/1.0/css",
      img : "build/<%= appname %>_assets/1.0/img",
      js : "build/<%= appname %>_assets/1.0/js"
    }
  }

  grunt.initConfig({
    connect: {
      options: {
        port: 9000,
        hostname: '*', // IP，localhost 或域名
        livereload: 35729//watch 监听的端口,
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
        src: ['build/pages/*',siteConfig.build.css,siteConfig.build.img]
      },
      compress :{
        src: ['build*.{zip,rar,gzip}']
      }
    },
    copy: {
      imgToAsset: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/img/*','!**/*.psd'], 
            dest: siteConfig.build.img,
            rename : function(dest,src){
              var reg = /(?:mods|pages)\/(.+)\/img\//g,newSrc;
                newSrc = src.replace(reg, function(k1,k2){
                    return k2==="global" ? '': (k2+'/')
                });
              return src===newSrc ? '':(siteConfig.build.img.replace(/^\/+/,'')+'/'+newSrc)
            }
          }
        ]
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
        files:[{
          expand: true,
          src: ['build/**/*.js'],
        }]
      }
    },
    cssmin: {
      target: {
        options: {
          banner: '/* build by grunt cssmin at <%= new Date() %> */'
        },
        files:[{
          expand: true,
          src: ['build/**/*.css'],
        }]
      }
    },
    compress: {
      main: {
        options: {
          archive: 'build'+new Date().getTime()+'.zip',
          pretty : true
        },
        files: [
          {
            expand: true, 
            cwd: 'build/', 
            src: ['**'], 
            dest: '.'
          }
        ]
      }
    },
    stylus: {
      compile: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'src',
          src: [ 'pages/**/*.styl'],
          dest: siteConfig.build.css,
          ext: '.css'
        }],
        options: {
          compress: false
        }
      }
    },
    jade: {
      compile: {
          files: [{
            expand: true,
            cwd: 'src',
            src: [ 'pages/**/*.jade'],
            dest: 'build',
            ext: '.html'
          }],
          options: {
            pretty:true,
            data: function(dest, src) {
              var srcDirName = src[0].toString().match(/.+\//)[0],
                  pageData = {},
                  defaultData = extand({},siteConfig.static),
                  jsonPath = './'+srcDirName+'data.json';

              if(fs.existsSync(jsonPath)){
                pageData = require(jsonPath);
              }

              //console.log("dest="+dest,"src="+src,src[0].toString().match(/.+\//)[0])
              //var pageData = require('/locals.json')
              return extand(defaultData,pageData);
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
          src: ['build/**/*.js','src/**/*.js']
        }
      }
    },
    watch: {
      livereload :{
        options: {
          livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
        },
        files: [  //下面文件的改变就会实时刷新网页
          'build/**/*'
        ]
      },
      jade: {
        files: ['**/*.jade','**/*.json'],
        tasks: ['jade']
      },
      stylus: {
        files: ['**/*.styl'],
        tasks: ['stylus']
      },
      copy:{
        files: ['src/**/*.{png,jpg,jpeg,gif}'],
        tasks: ['copy']
      }
    }

  });
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.registerTask('default', ['connect:server','clean','copy','jade','stylus','watch']);
  grunt.registerTask('youhua', ['imagemin','uglify','cssmin']);
  grunt.registerTask('build','打包发布', function(){
    grunt.log.writeln("打包发布中.......")
    //grunt.task.run(['clean', 'copy']);
    grunt.task.run(['clean:compress','compress']);
  });
};