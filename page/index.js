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

var SubGeneratorGenerator = module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The page name'
    });
  },

  initializing: function () {
    var fep = this.dest.readJSON('fep.json');
    this.htmlTemplete = fep.htmlTemplete || 'ejs';
    //this._.dasherize => recommend_video to recommend-video
    //this.dirname = this._.dasherize(this.name);
    this.dirname = this.name;
    this.appbegintime = today();
  },

  prompting: {

    askForPageInfo: function () {
      var done = this.async();
      var prompts = [
        {
          name: 'title',
          message: 'What\'s the title of your page?',
          default: "首页"
        },
        {
          name: 'pageid',
          message: '页面id:',
          default: this.dirname
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
        this.user = props.user;
        this.mail = props.mail;
        this.title = props.title;
        this.pageid = props.pageid;
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
  writing: function () {
    var cwd = this.env.cwd,
        cwdMatch = cwd.match(/.+(?:\/|\\)src(?:$|(?:\/|\\))/),
        pagedir = (cwdMatch ? cwdMatch[0] : (cwd+'/src'))+'/pages/'+this.dirname;

    this.dest.mkdir(pagedir);
    this.dest.mkdir(pagedir+'/img/'+this.dirname);
    if(this.htmlTemplete==='ejs'){
      this.src.copy('demo.ejs.tpl', pagedir + '/'+this.dirname+'.html');
    }else if(this.htmlTemplete==='jade'){
      this.template('demo.tpl', pagedir + '/'+this.dirname+'.jade');
    }
    this.template('demo.styl', pagedir + '/'+this.dirname+'.styl');
    this.template('demo.js', pagedir + '/'+this.dirname+'.js');
    this.template('data.json', pagedir + '/data.json');
  }
});
