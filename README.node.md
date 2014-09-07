
## RiTa: a generative language toolkit for JavaScript

<a href="http://rednoise.org/rita"><img height=120 src="http://rednoise.org/rita/img/RiTa-logo2.png"/></a>

### <a href="http://rednoise.org/rita">The RiTa website</a>

RiTaJS is designed to an easy-to-use toolkit for experiments 
in natural language and generative literature, based on the RiTa 
(http://rednoise.org/rita) library for Java. Like the original RiTa, RiTaJS 
works alone or in conjunction with Processing(JS) and/or with 
its own Canvas renderer, and/or as a NodeJS module.  All RiTa and RiTaJS tools
are free/libre/open-source according to the GPL (http://www.gnu.org/licenses/gpl.txt).


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


Can I contribute?
--------
Please! We are looking for more coders to help out... Just press *Fork* at the top of this github page and get started. 

If you don't feel like coding but still want to contribute, please join the discussion on the issuetracker and ritajs-dev group.


