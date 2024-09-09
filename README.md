# Project Title

## Table of Contents

- [Project Title](#project-title)
  - [Table of Contents](#table-of-contents)
  - [About ](#about-)
  - [Getting Started ](#getting-started-)
    - [Prerequisites](#prerequisites)
    - [Installing](#installing)
  - [Usage ](#usage-)

## About <a name = "about"></a>

This is a Template structure for creating SPA web applications. 
It uses Webpack to auto compile Typescript, Sass, and HTML into a static index.html file and a single budle.js file.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development. See [usage](#usage) for notes on how to deploy the project on a live system.

### Prerequisites

You will need:

```
Node.js
npm
Webpack and Webpack-CLI
HTML Loader
Typescript + TS Loader
Sass + Sass Loader
```

### Installing

First you will need to install Node.js, you can either download their installer or use their package manager insntallation.

Then clone this repository and run the following command while inside the project directory:

```shell
npm install 
```

You might note theres no index.html file in this project, but it will be created when you build with Webpack.

## Usage <a name = "usage"></a>

You will now have everything you need to get started, and can run the following built in commands:

```shell
npm run build
```
This will build the project and output it to the `dist` folder.

```shell
npm run start
```
This will start the project in development mode, and open the browser. Allows for hotswapping code without needing to rebuild.

```shell
npm run watch
```
This will build the project and output it to the `dist` folder just as `npm run build`, but will continue to watch for changes in the input files and rebuild when they change. Useful for using vscode's Live Server.


Remember to change the webpack.config.js to match your project needs, and change the mode from `development` to `production` to build for production. I would remove the mapping as well for production, as it is not necessary.