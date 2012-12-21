
## RiTaJS: A RiTa generative language toolkit for JavaScript


<a href="http://rednoise.org/rita/js"><img height=120 src="http://rednoise.org/rita/js/img/RiTa-logo2.png"/></a>

### <a href="http://rednoise.org/rita/js">The RiTaJS website</a>

RiTaJS is an easy-to-use toolkit designed to facilitate experiments 
in natural language and generative literature, based on the RiTa 
(http://rednoise.org/rita) library for Java. Like the original RiTa, RiTaJS 
works alone or in conjunction with Processing(JS) and/or with 
its own Canvas renderer, and/or as a NodeJS module.  All RiTa and RiTaJS tools
are free, gratis, and open-source according to the GPL (http://www.gnu.org/licenses/gpl.txt).


About the project
--------
* Original Author:   Daniel C. Howe (http://rednoise.org/~dhowe)
* License: 			 GPL (see included LICENSE file for full license)
* Maintainers:       See included AUTHORS file for contributor list
* Web Site:          http://rednoise.org/rita/js
* Github Repo:       https://github.com/dhowe/RiTaJS/
* Bug Tracker:       https://github.com/dhowe/RiTaJS/issues



A Simple Sketch
--------
Create a new file on your desktop called hello.html, add the following lines, save and drag it into a browser:
<pre>
  &lt;html&gt;
  &lt;canvas id="canvas" width=200 height=200&gt;&lt;/canvas&gt;
  &lt;script src="http://rednoise.org/rita/js/rita-latest.min.js"&gt;&lt;/script&gt;
  &lt;script&gt;

    window.onload = function() {
    
      // create a RiText and draw it
      
      RiText("HelloWorld").draw();
      
	};

  &lt;/script&gt;
  &lt;html&gt;
</pre>  

If you want to use RiTaJS with Processing, you can do so like this (assuming you've downloaded both libraries to the current directory):
<pre>
  &lt;html&gt;
  &lt;script src="processing-min.js"&gt;&lt;/script&gt;
  &lt;script src="rita-020a.min.js"&gt;&lt;/script&gt;
  &lt;script type="text/processing" data-processing-target="mycanvas"&gt;

	size(200,200);
	background(255);
	
	RiText("SIMPLE").color(200,100,0).draw();

  &lt;/script&gt;
  &lt;canvas id="mycanvas"&gt;&lt;/canvas&gt;
  &lt;html&gt;
</pre>  




Can I contribute?
--------
Sure! Just press *Fork* at the top of this github page and start coding. Active contributors might be asked to join the core team, and given the ability to merge pull requests.

If you don't feel like coding but still want to contribute, please join the discussion on the issuetracker and ritajs-dev group.


