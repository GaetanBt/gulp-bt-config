# gulp-bt-config

## Simple [Gulp ](http://gulpjs.com) configuration used for my personnal projects. 

### Things it does :

* Compile Sass files 
* Minify Javascript files
* Automatically refresh your browser thanks to [livereload](http://livereload.com/)
  * Watches your CSS, JS and HTML files 
* Optimize images
* Launch [Bower](http://bower.io/) to manage your dependencies
* Zip all files so you can send them to your customer

### Project structure

This configuration imposes you to work with a defined structure. Basically, this is how it looks like.

1. **dev** (your work goes in this folder)
  * css
  * img
  * js
  * scss
2. **prod** (all the compiled - minified - optimized files you use in your project go there.)
  * css
  * img
  * js
 
### How to use it  

I suppose that you already have [NodeJs](http://nodejs.org/), [Bower](http://bower.io/), [Git](http://git-scm.com/) & [Gulp ](http://gulpjs.com) installed on your computer.


#### Install the configuration in your project

Create a folder named *dev* in your project folder. This will be your working folder. Then, run your terminal to begin to use Gulp.

First of all, you have to globally install Gulp in your project. Open it in your terminal and run:

```
$ npm install -g gulp
```

Then, you need to install the gulp dependencies specified in *package.json*. Just run:

```
$ npm install
```

And let the magic happen ! :D

To have an overview of every tasks available you can run :

``` 
$ gulp -T 
``` 

Once you created your files and working folders (css, js, images) you can run Gulp to create your production folder. Just run:
```
$ gulp
```


#### Watch changes
To watch changes and automatically reload your browser, make sure your have installed the exension for your browser and activated it. Then, run :

```
$ gulp watch
```

#### The end of the line
You have just finished your project, that sounds good, now you want to make sure everything is okay. So run ``` $ gulp ``` one more time. You will be sure that you have every optimized version of your dev files in your production folder.
This configuration allows you to zip your production folder to the root folder.Just run:

```
$ gulp zip
```

I hope it's clear enough, don't hesitate to ask if you have any question ! :)
