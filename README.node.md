[![Build Status](https://travis-ci.org/dhowe/RiTaJS.svg?branch=master)](https://travis-ci.org/dhowe/RiTaJS)


## RiTa: a generative language toolkit for JavaScript

<a href="http://rednoise.org/rita/js"><img height=120 src="http://rednoise.org/rita/img/RiTa-logo3.png"/></a>

#### <a href="http://rednoise.org/rita">The RiTa website</a>

#### RiTa is designed to be an easy-to-use toolkit for experiments in natural language and generative
literature. It is implemented in Java and JavaScript (with a unified API for both) and optionally
integrates with Processing(JS), Android, and Node, and is available via Npm and Bower. 
It is free/libre and open-source according to the GPL license (http://www.gnu.org/licenses/gpl.txt).


About the project
--------
* Original Author:   Daniel C. Howe (http://rednoise.org/~dhowe)
* License: 			 GPL (see included LICENSE file for full license)
* Maintainers:       See included AUTHORS file for contributor list
* Web Site:          http://rednoise.org/rita/js
* Github Repo:       https://github.com/dhowe/RiTaJS/
* Bug Tracker:       https://github.com/dhowe/RiTaJS/issues


In NodeJS
--------
<pre>
 
 To install: $ npm install rita
 
 rita = require('rita');
 rs = rita.RiString("The elephant took a bite.");
 console.log(rs.features());
 
 To run tests: 	$ cd node_modules/rita/ && npm install && cd - 
 				$ npm test rita 

Or, see the 'Development Setup' instructions below...
</pre>  


In a browser
--------
Create a new file on your desktop called hello.html, add the following lines, save and drag it into a browser:
<pre>
  &lt;html&gt;
  &lt;canvas id="canvas" width=200 height=200&gt;&lt;/canvas&gt;
  &lt;script src="http://rednoise.org/rita/download/rita-latest.min.js"&gt;&lt;/script&gt;
  &lt;script&gt;

    window.onload = function() {
    
      // create a RiText and draw it
      
      RiText("HelloWorld").draw();
      
	};

  &lt;/script&gt;
  &lt;html&gt;
</pre>  



#### Can I contribute?
--------
Please! We are looking for more coders to help out... Just press *Fork* at the top of this github page and get started, or follow the instructions below... 


#### Development Setup
--------
1. Download and install <a href="https://npmjs.org/">npm</a>. The easiest way to do this is to just install <a href="http://nodejs.org/">node</a>. 
2. <a href="https://help.github.com/articles/fork-a-repo">Fork and clone</a> this library. 
  
  a. First, login to github and fork the project
  
  b. Then, from a terminal/shell: 
  <pre><code>$ git clone https://github.com/dhowe/RiTaJS.git</code></pre>
3. Now navigate into the project folder and install dependencies via npm. <pre>$ cd RiTaJS; npm install</pre>
4. To create the library from src, use gulp.<pre>$ gulp build</pre>
5. Run non-graphical tests in node with gulp.<pre>$ gulp test.node</pre>
6. Run all tests (in phantomJS) with gulp.<pre>$ gulp test</pre>   
7. Work on an existing <a href="https://github.com/dhowe/RiTaJS/issues?state=open">issue</a>, then <a href="https://help.github.com/articles/creating-a-pull-request">submit a pull request...</a>
