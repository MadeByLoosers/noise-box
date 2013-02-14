#noise-box-build

Use GruntJs to run tests, concatenate & minify files and deploy.

###Requirements
* PhantomJS http://phantomjs.org/
* CasperJs http://casperjs.org/

```brew install casperjs``` will install both on OSX.

###Installation
```
git clone git@github.com:GuntLondon/noise-box.git
cd noise-box/build
npm install
```

###Usage
```
cd noise-box/build
./node_modules/grunt/bin/grunt taskname
```
Where _taskname_ is the name of the grunt task you'd like to run

Here are the useful grunt tasks
* 'test' -   Run all available tests
* 'dist' -   Run 'test' then create a dist folder containing deployable files
* 'deploy' - Run previous tasks, then deploy site to host 'wintermute'.  This is unlikely to be useful unless you have an ssh host on your machine named 'wintermute'.
* 'watch' - watches for files changes, converting LESS css into compiled css.  

When running tests you'll need to make sure you have a fresh instance of noise-box running.  