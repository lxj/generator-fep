'use strict';
var yeoman = require('yeoman-generator');

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

var extractGeneratorName = function (_, appname) {
  var slugged = _.slugify(appname);
  var match = slugged.match(/^generator-(.+)/);

  if (match && match.length === 2) {
    return match[1].toLowerCase();
  }
  return slugged;
};

var SubGeneratorGenerator = module.exports = yeoman.generators.Base.extend({

  initializing: function () {
    this.appbegintime = today();
    this.contrib = "${sys-env.ANT_HOME}/ant-contrib-1.0b3.jar";
    this.$ = "$";
  },

  prompting: {

    askForModInfo: function () {
      var done = this.async();
      var projectName = extractGeneratorName(this._, this.appname);
      var prompts = [
        {
          name: 'projectName',
          message: 'Project Name:?',
          default: projectName
        },
        {
          name: 'projectVersion',
          message: 'Project Version:?',
          default: '1.0'
        },
        {
          name: 'staticAsset',
          message: '静态资源文件存放:?',
          default :projectName+'_assets'
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
        }
      ];

      this.prompt(prompts, function (props) {
        this.projectName = props.projectName;
        this.staticAsset = props.staticAsset;
        this.projectVersion = props.projectVersion;
        this.user = props.user
        this.mail = props.mail
        done();
      }.bind(this));
    }
  },
  configuring: {
    enforceFolderName: function () {
      //console.log(this.destinationRoot())
      //this.destinationRoot(this.appname);
      //this.config.save();
    }
  },
  module : function(){
    this.dest.mkdir('module/footer/img/footer');
    this.template('_footer.html', 'module/footer/_footer.html');
    this.template('_footer.css', 'module/footer/_footer.css');
    this.dest.mkdir('module/global/img');
    this.template('global.css', 'module/global/global.css');
    this.template('_btn.css', 'module/global/_btn.css');
    this.template('_form.css', 'module/global/_form.css');
    this.template('_page_nav.css', 'module/global/_page_nav.css');
    this.template('_page_nav.html', 'module/global/_page_nav.html');
    this.template('jquery1.7.1.js', 'module/global/jquery1.7.1.js');
    this.dest.mkdir('module/header/img/header');
    this.template('_header.html', 'module/header/_header.html');
    this.template('_header.css', 'module/header/_header.css');
    this.dest.mkdir('module/index/img/index');
    this.template('index.html', 'module/index/index.html');
    this.template('index.css', 'module/index/index.css');
  },
  assets : function(){
    this.dest.mkdir(this.staticAsset);
    this.dest.mkdir(this.staticAsset+'/core');
    this.dest.mkdir(this.staticAsset+'/core/'+this.projectVersion);
    this.dest.mkdir(this.staticAsset+'/core/'+this.projectVersion+'/css');
    this.dest.mkdir(this.staticAsset+'/core/'+this.projectVersion+'/img');
    this.dest.mkdir(this.staticAsset+'/core/'+this.projectVersion+'/js');
    this.dest.mkdir(this.staticAsset+'/activitys');
    this.dest.mkdir(this.staticAsset+'/skins');
  },
  writing: function(){
    this.template('build.bat', 'build.bat');
    this.template('build.xml', 'build.xml');
    this.template('config.json', 'config.json');
    this.template('index.php', 'index.php');
    this.template('README.md', 'README.md');
  }
});
