'use strict';
var path = require('path');
var url = require('url');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
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


var GeneratorGenerator = module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.currentYear = (new Date()).getFullYear();
    this.appbegintime = new Date().toString();
  },

  prompting: {

    askForGeneratorName: function () {
      var done = this.async();
      var generatorName = extractGeneratorName(this._, this.appname);

      var prompts = [{
        name: 'generatorName',
        message: 'What\'s the name of your generator?',
        default: generatorName
      }, {
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
      }];

      this.prompt(prompts, function (props) {
        if (props.pkgName) {
          return this.prompting.askForGeneratorName.call(this);
        }

        this.generatorName = props.generatorName;
        this.appname = this.generatorName;

        done();
      }.bind(this));
    }
  },

  configuring: {
    enforceFolderName: function () {
      if (this.appname !== this._.last(this.destinationRoot().split(path.sep))) {
        this.destinationRoot(this.appname);
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
      this.dest.mkdir('build/'+this.appname+'_assets');
      this.dest.mkdir('src');
      //this.src.copy('src/**', 'src/');
      this.superb = superb();
    }
  },

  end: function () {
    if (!this.options['skip-install']) {
      this.npmInstall();
    }
  }
});
