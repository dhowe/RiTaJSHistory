[![Build Status](https://travis-ci.org/dhowe/RiTaJS.svg?branch=master)](https://travis-ci.org/dhowe/RiTaJS)

### RiTaJS: a generative language toolkit for JavaScript


<a href="https://rednoise.org/rita"><img height=120 src="https://rednoise.org/rita/img/RiTa-logo3.png"/></a>

#### [The RiTa website](http://rednoise.org/rita)

RiTaJS is designed to an easy-to-use toolkit for experiments 
in natural language and generative literature, based on the RiTa 
(http://rednoise.org/rita) library for Java. Like the original RiTa, RiTaJS 
works alone or in conjunction with Processing(JS) and/or as a NodeJS or Bower module.  All RiTa and RiTaJS tools
are free/libre/open-source according to the GPL (http://www.gnu.org/licenses/gpl.txt).



#### About the project
--------
* Original Author:   Daniel C. Howe (https://rednoise.org/daniel)
* Related:           RiTa -> https://github.com/dhowe/RiTa
* License: 			 GPL (see included LICENSE file for full license)
* Maintainers:       See included AUTHORS file for contributor list
* Web Site:          https://rednoise.org/rita
* Github Repo:       https://github.com/dhowe/RiTaJS/
* Bug Tracker:       https://github.com/dhowe/RiTa/issues
* Documentation:     http://www.rednoise.org/rita/reference/

#### A Simple Sketch
--------
Create a new file on your desktop called hello.html, add the following lines, save and drag it into a browser:

```html
<html>
  <script src="bower_components/rita/dist/rita.js"></script>
  <script>
    window.onload = function() {
      $('#content').text(RiTa.tokenize("The elephant took a bite."));
    };
  </script>
  <div id="content" width=200 height=200></div>
<html>
```

#### With ProcessingJS
--------
If you want to use RiTa with <a href="http://processingjs.org/">ProcessingJS</a>, you can simply open Processing and switch to 'JavaScript' mode. If you don't want to use the Processing IDE, you can cimply create an HTML file like this (assuming you've downloaded both libraries to the current directory):

```html
<html>
  <meta charset="utf-8"/>
  <script src="processing-min.js"></script>
  <script src="rita-latest.min.js"></script>
  <script type="text/processing" data-processing-target="mycanvas">
    size(200,200);
    background(255);
    RiText("SIMPLE").fill(200,100,0).draw();
  </script>
  <canvas id="mycanvas"></canvas>
<html>
```

#### With NodeJS
--------
To install: `$ npm install rita`
 
```javascript
var rita = require('rita');
var rs = rita.RiString("The elephant took a bite.");
console.log(rs.features());
```

#### Can I contribute?
--------
Please! We are looking for more coders to help out... Just press *Fork* at the top of this github page and get started, or follow the instructions below... 


#### Development Setup
--------
1. Download and install [npm](https://npmjs.org/) The easiest way to do this is to just install [node](http://nodejs.org/). 
2. [Fork and clone](https://help.github.com/articles/fork-a-repo) this library. 
  a. First, login to github and fork the project

  b. Then, from a terminal/shell: 
  ```bash
  $ git clone https://github.com/dhowe/RiTaJS.git
  ```
3. Now navigate into the project folder and install dependencies via npm. 
```bash
$ cd RiTaJS; npm install
```
4. To create the library from src, use gulp.
```bash
$ gulp build
```
5. Run non-graphical tests in node with gulp.
```bash
$ gulp test.node
```
6. Run all tests (in phantomJS) with gulp.
```bash
$ gulp test
```
7. Work on an existing [issue](https://github.com/dhowe/RiTaJS/issues?state=open), then [submit a pull request...](https://help.github.com/articles/creating-a-pull-request)
