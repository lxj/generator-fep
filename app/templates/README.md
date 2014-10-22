# <%= appname %>

<%= appname %> begin at:<%= appbegintime %>

## Getting Started

```bash
$ npm install -g grunt grunt-cli yo yeoman-generator generator-fep
$ yo fep
```
## Commands

+ `yo fep` shows a wizard for generating a new generator
+ `yo fep:page NAME` generates a page with the name NAME
+ `yo fep:mod NAME` generates a mod with the name NAME

## Run

```bash
$ cd <%= _.slugify(appname) %>
$ npm install
$ grunt
```




