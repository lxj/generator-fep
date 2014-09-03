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
          default: '1.0'
        },
        {
          name: 'staticAsset',
          message: '静态资源文件存放:?',
          default :generatorName+'_assets'
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
        this.projectVersion = pros.projectVersion;
        this.appname = this.generatorName;
        this.staticAsset = props.staticAsset;
        this.user = props.user
        this.mail = props.mail
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
    projectfiles: function () {
      this.template('_package.json', 'package.json');
      this.template('editorconfig', '.editorconfig');
      this.template('jshintrc', '.jshintrc');
      this.template('_travis.yml', '.travis.yml');
      this.template('README.md');
      this.template('Gruntfile.js', 'Gruntfile.js');
    },

    gitfiles: function () {
      this.src.copy('gitattributes', '.gitattributes');
      this.src.copy('gitignore', '.gitignore');
    },

    app: function () {
      this.dest.mkdir('build');
      this.dest.mkdir('build/images');
      this.dest.mkdir('build/pages');
      this.dest.mkdir('build/'+this.staticAsset);
      this.dest.mkdir('src');
      this.dest.mkdir('src/mods');
      this.dest.mkdir('src/mods/global');
      this.dest.mkdir('src/mods/global/img');
      this.src.copy('src/mods/global/global.styl', 'src/mods/global/global.styl');
      this.src.copy('src/mods/global/global.js', 'src/mods/global/global.js');
      this.dest.mkdir('src/mods/header');
      this.dest.mkdir('src/mods/header/img');
      this.src.copy('src/mods/header/header.jade', 'src/mods/header/header.jade');
      this.src.copy('src/mods/header/header.styl', 'src/mods/header/header.styl');
      this.src.copy('src/mods/header/header.js', 'src/mods/header/header.js');
      this.dest.mkdir('src/mods/footer');
      this.dest.mkdir('src/mods/footer/img');
      this.src.copy('src/mods/footer/footer.jade', 'src/mods/footer/footer.jade');
      this.src.copy('src/mods/footer/footer.styl', 'src/mods/footer/footer.styl');
      this.src.copy('src/mods/footer/footer.js', 'src/mods/footer/footer.js');
      this.dest.mkdir('src/pages');
      this.dest.mkdir('src/pages/index');
      this.dest.mkdir('src/pages/index/img');
      this.src.copy('src/pages/index/index.jade', 'src/pages/index/index.jade');
      this.template('src/pages/index/index.styl', 'src/pages/index/index.styl');
      this.template('src/pages/index/index.js', 'src/pages/index/index.js');
      this.src.copy('src/pages/index/data.json','src/pages/index/data.json');
      this.superb = superb();
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
