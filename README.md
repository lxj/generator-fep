# generator-fep

## Getting started

- Install: `npm install -g generator-fep`
- Run: `yo fep`

to your `.bashrc`, `.zshrc`, `.profile` or another file that is run on shell initialization. In new terminal shells
you shouldn't see this error anymore.


## Commands

* `yo fep` shows a wizard for generating a new generator
* `yo fep`:page NAME` generates a subgenerator with the name NAME


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


