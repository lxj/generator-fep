# generator-fep

## Getting started

1. Install: `npm install -g grunt grunt-cli yo yeoman-generator generator-fep`
2. Run: `yo fep`

to your `.bashrc`, `.zshrc`, `.profile` or another file that is run on shell initialization. In new terminal shells
you shouldn't see this error anymore.


## Commands

* `yo fep` shows a wizard for generating a new generator
* `yo fep:page` NAME generates a page with the name NAME
* `yo fep:mod` NAME generates a mod with the name NAME


## What do you get?

Scaffolds out a complete project directory structure for you:

    .
    ├── build
    │   └── images
    │   │   └── .jpeg,.png,.gif
    │   └── pages
    │       └── index
    │           └── index.html
    │   └── syt_assets
    │       ├── css
    │       ├── js
    │       └── img
    │      
    ├── src
    │   └── mods
    │       └── header
    │           ├── img
    │           ├── header.styl
    │           └── header.jade
    │   └── pages
    │       └── index
    │           ├── img
    │           ├── index.styl
    │           └── index.jade
    ├── .editorconfig
    ├── .gitattributes
    ├── .gitignore
    ├── .jshintrc
    ├── LICENSE
    ├── package.json
    ├── README.md


