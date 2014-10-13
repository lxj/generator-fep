'use strict';
var path = require('path');
var url = require('url');
var yeoman = require('yeoman-generator');
var npmName = require('npm-name');
var superb = require('superb');

/* jshint -W106 */
var proxy = process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy ||
  process.env.HTTPS_PROXY || null;
/* jshint +W106 */

var extractGeneratorName = function (_, appname) {
  var slugged = _.slugify(appname);
  var match = slugged.match(/^generator-(.+)/);

  if (match && match.length === 2) {
    return match[1].toLowerCase();
  }
  return slugged;
};
var today = function(tpl){
    var date = new Date(),
        tmp = {
          "year":"getFullYear",
          "month":"getMonth",
          "day":"getDate",
          "hour":"getHours",
          "minute":"getMinutes",
          "second":"getSeconds"
        },
        cache = [],
        addZero = function(nub){
          var nub = parseInt(nub);
          return nub < 10 ? ("0"+nub) : nub;
        },
        tpl = tpl || "yyyy-mm-dd HH:MM:ss";

        for(var key in tmp){
          cache[key] = addZero(key==="month" ? (date[tmp[key]]()+1) : date[tmp[key]]());
        }

    return tpl.replace(/yyyy/g,cache.year).replace(/mm/g,cache.month).replace(/dd/g,cache.day).replace(/HH/g,cache.hour).replace(/MM/g,cache.minute).replace(/ss/g,cache.second);
};

var GeneratorGenerator = module.exports = yeoman.generators.Base.extend({
  
  initializing: function (){
    this.currentYear = new Date().getFullYear();
    this.appbegintime = today();
  },

  prompting: {

    askForGeneratorName: function () {
      var done = this.async();
      var generatorName = extractGeneratorName(this._, this.appname);

      var prompts = [
        {
          name: 'generatorName',
          message: 'Project Name:?',
          default: generatorName
        },
        {
          name: 'projectVersion',
          message: 'Project Version:?',
          default: '0.0.1'
        },
        {
          name: 'staticAsset',
          message: '静态资源文件存放:',
          default :generatorName+'_assets'
        },
        {
          name: 'cssCompile',
          message: 'css预处理器(styl/css):',
          default :'styl'
        },
        {
          name: 'htmlTemplete',
          message: 'html模板引擎(ejs/jade):',
          default :'ejs'
        },
        {
          name: 'cdn',
          message: 'cdn地址:',
          default :'http://image1.webscache.com/kan/'
        },
        {
          name: 'user',
          message: 'Author Name(你的名字拼音或英文名):',
          default: "louxiaojian"
        }, 
        {
          name: 'mail',
          message: 'Author Email:',
          default: "louxiaojian@gmal.com"
        },
        {
          type: 'confirm',
          name: 'pkgName',
          message: 'The name above already exists on npm, choose another?',
          default: true,
          when: function (answers) {
            var done = this.async();
            var name = answers.generatorName;
            npmName(name, function (err, available) {
              if (!available) {
                done(true);
              }

              done(false);
            });
          }
        }
      ];

      this.prompt(prompts, function (props) {

        if (props.pkgName) {
          return this.prompting.askForGeneratorName.call(this);
        }
        this.generatorName = props.generatorName;
        this.appname = this.generatorName;
        this.projectVersion = props.projectVersion;
        this.staticAsset = props.staticAsset;
        this.cssCompile = props.cssCompile;
        this.htmlTemplete = /^ejs/i.test(props.htmlTemplete) ? 'ejs' : 'jade';
        this.tplExt = this.htmlTemplete === 'jade' ? 'jade' : 'ejs';
        this.cdn = props.cdn;
        this.user = props.user;
        this.mail = props.mail;
        done();
        
      }.bind(this));
    }
  },

  configuring: {
    enforceFolderName: function () {
    //this.destinationRoot() //E:\louxiaojian\usr\Desktop\yeoman\bigtrue
      if (this.appname !== this._.last(this.destinationRoot().split(path.sep))) {
        //this.destinationRoot(this.appname);E:\louxiaojian\usr\Desktop\yeoman\bigtrue\ji
      }
      this.config.save();
    }
  },

  writing: {

    readme: function () {
      this.template('README.md');
    },
    jsonfile: function () {
      this.template('_package.json', 'package.json');
      this.template('_fep.json', 'fep.json');
    },
    gruntfile: function () {
      this.template('Gruntfile.js', 'Gruntfile.js');
    },
    app: function () {
      this.dest.mkdir('build/images');
      this.dest.mkdir('build/pages');
      this.dest.mkdir('build/'+this.staticAsset);
      this.dest.mkdir('src/mods/global/img');
      this.dest.mkdir('src/mods/header/img');
      this.dest.mkdir('src/mods/footer/img');
      this.dest.mkdir('src/pages/index/img');
      this.superb = superb();
    },
    testData : function(){
      this.template('data.json','src/pages/index/data.json');
    },
    jsFile : function(){
      this.template('global.js', 'src/mods/global/global.js');
      this.template('header.js', 'src/mods/header/header.js');
      this.template('footer.js', 'src/mods/footer/footer.js');
      this.template('index.js', 'src/pages/index/index.js');
    },
    cssFile : function(){
      this.template('global.styl', 'src/mods/global/global.styl');
      this.template('header.styl', 'src/mods/header/header.styl');
      this.template('footer.styl', 'src/mods/footer/footer.styl');
      this.template('index.styl', 'src/pages/index/index.styl');
    },
    tpl : function(){
      if(this.tplExt==='ejs'){
        this.src.copy('header.ejs.tpl', 'src/mods/header/header.html');
        this.src.copy('footer.ejs.tpl', 'src/mods/footer/footer.html');
        this.src.copy('index.ejs.tpl', 'src/pages/index/index.html');
      }else if(this.tplExt==='jade'){
        this.src.copy('header.tpl', 'src/mods/header/header.jade');
        this.src.copy('footer.tpl', 'src/mods/footer/footer.jade');
        this.src.copy('index.tpl', 'src/pages/index/index.jade');
      }
    }
  },

  end: function () {

    var done = this.async();
    this.prompt([
        {
            name   : 'npm_install',
            message: 'Install node_modules for grunt now?',
            default: 'N/y',
            warning: ''
        }
    ], function (props) {
        this.npm_install = (/^y/i).test(props.npm_install);
        if (this.npm_install) {
            this.npmInstall('', {}, function (err) {
                console.log('\n\nnpm was installed successful. \n\n');
            });
        } else {
            console.log('\n\nplease run "npm install" before grunt\n');
        }
        done();
    }.bind(this));

  }

});
