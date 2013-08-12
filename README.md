
## RiTaJS: a generative language toolkit for JavaScript

<a href="http://rednoise.org/rita/"><img height=120 src="http://rednoise.org/rita/img/RiTa-logo2.png"/></a>

### <a href="http://rednoise.org/rita">The RiTaJS website</a>

RiTa is designed to be an easy-to-use toolkit for experiments in natural language and generative literature. Is is implemented in Java and JavaScript (with a unified API for both) and optionally integrates with both Processing(JS) and NodeJS. It is free/libre and open-source according to the GPL license (http://www.gnu.org/licenses/gpl.txt). 

Please see https://github.com/dhowe/RiTa for the Java implementation of RiTa.  
  
About the project
--------
* Original Author:  Daniel C. Howe (http://rednoise.org/~dhowe)
* Related:			RiTaJS -> https://github.com/dhowe/RiTa/js
* License:			GPL (see included LICENSE file for full license)
* Maintainers:      See included AUTHORS file for contributor list
* Web Site:         http://rednoise.org/rita
* Github Repo:      https://github.com/dhowe/RiTaJS/
* Bug Tracker:      https://github.com/dhowe/RiTaJS/issues


A Simple Sketch
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


With ProcessingJS
--------
If you want to use RiTa with <a href="http://processingjs.org/">ProcessingJS</a>, you can simply open Processing and switch to 'JavaScript' mode. If you don't want to use the Processing IDE, you can cimply create an HTML files like this (assuming you've downloaded both libraries to the current directory):
<pre>
  &lt;html&gt;
  &lt;meta charset="utf-8"/&gt;

  &lt;script src="processing-min.js"&gt;&lt;/script&gt;
  &lt;script src="rita-1.0.29a.min.js"&gt;&lt;/script&gt;
  &lt;script type="text/processing" data-processing-target="mycanvas"&gt;

	size(200,200);
	background(255);
	
	RiText("SIMPLE").fill(200,100,0).draw();

  &lt;/script&gt;
  &lt;canvas id="mycanvas"&gt;&lt;/canvas&gt;
  &lt;html&gt;
</pre>  


With NodeJS
--------

<pre>
To install:
$ npm install rita

A simple test:

var rita = require('rita');
var rs = rita.RiString('The white elephant jumped.');
console.log(rs.features());
</pre>  


Can I contribute?
--------
Please! We are looking for more coders to help out... Just press *Fork* at the top of this github page and get started. 

If you don't feel like coding but still want to contribute, please join the discussion on the issuetracker and ritajs-dev group.


