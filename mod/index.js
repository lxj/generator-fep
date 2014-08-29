'use strict';
var yeoman = require('yeoman-generator');

var SubGeneratorGenerator = module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The subgenerator name'
    });
  },

  initializing: function () {
    var pkg = {};
    pkg.files = pkg.files || [];
    pkg.files.push(this.name);
   // this.dest.write('package.json', JSON.stringify(pkg, null, 2));
    //this.generatorName = pkg.name.replace(/^generator-/, '');
    this.dirname = this._.dasherize(this.name);
  },

  writing: function () {
    var pagedir = this.env.cwd+'/'+this.dirname;
    this.dest.mkdir(pagedir);
    this.dest.mkdir(pagedir+'/img');
    this.src.copy('demo.jade', pagedir + '/'+this.dirname+'.jade');
    this.src.copy('demo.styl', pagedir + '/'+this.dirname+'.styl');
    this.src.copy('demo.js', pagedir + '/'+this.dirname+'.js');
  }
});
