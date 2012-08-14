/*  
	RiText: Re-add as conditional include
	
		Fix behaviors: Problem with jump after first interpolate()!
		
		Add: fadeToText(string, sec)
		Add: scaleTo(scale, sec)
		Add: rotateTo(radians, sec)  [lets ignore rotate stuff for now]
 */


(function(window, undefined) {
    
    // /////////////////////////////////////////////////////////////////////// 

    var E = "", SP = " "; // DUP
    
    // /////////////////////////////////////////////////////////////////////// 

    function remove(array, from, to) { // DUP
        
        if (!array || !array.length) return;
        to = to || from; // remove one by default
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    }

    
    function makeClass() { // DUP
        
        return function(args) {
            
            if (this instanceof arguments.callee) {
                
                if (typeof this.__init__ == "function") {
                    
                    this.__init__.apply(this, args && args.callee ? args : arguments);
                }
            } 
            else {
                return new arguments.callee(arguments);
            }
        };
    }

    function isNum(n) { // DUP
        
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    function replaceAll(theText, replace, withThis) { // DUP?
        if (!theText) throw Error("no text!")
        return theText.replace(new RegExp(replace, 'g'), withThis);
    }

    function joinWords(words) { // DUP?
        
        var newStr = words[0];
        for ( var i = 1; i < words.length; i++) {
            if (!RiTa.isPunctuation(words[i]))
                newStr += SP;
            newStr += words[i];
        }
        return newStr;
    }
    
    function startsWith(str, prefix) { // DUP
        return str.indexOf(prefix) === 0;
    }
    
    function endsWith(str, ending) { // DUP
        return (str.match(ending + "$") == ending);
    }
    
    function isNull(obj) { // DUP
        
        return (typeof obj === 'undefined' || obj === null);
    }

    function getType(obj) { // DUP
        
        // http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/    
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };
    
    
    //////////////////////////// RiText ///////////////////////////////////
     
    handleLeading = function(font, ritexts, startY, leading)  
    {
      if (!ritexts || ritexts.length < 1) return;

      font = font || RiText.getDefaultFont(p);
      
      leading = (leading>0) ? leading : font.leading;
      
      // handle the line y-spacing
      var nextHeight = startY;
      ritexts[0].textFont(font);
      for ( var i = 0; i < ritexts.length; i++) {
        if (font) ritexts[i].textFont(font); // set the specified font
        ritexts[i].y = nextHeight; // adjust y-pos
        nextHeight += leading;
      }
    };
    
    
    disposeOne = function(toDelete) {
        
        removeFromArray(RiText.instances, toDelete);
        if (toDelete && toDelete.hasOwnProperty["riString"])
            delete(toDelete.riString);
        if (toDelete)
            delete(toDelete);
    };
    

    disposeArray = function(toDelete) {
        
        for ( var i = 0; i < toDelete.length; i++) {
            
            disposeOne(toDelete[i]);
        }
    };
    
    disposeAll = function() {
        
        for ( var i = 0; i < RiText.instances.length; i++) {
            
            if (RiText.instances[i] && RiText.instances[i].hasOwnProperty["riString"])
                delete(RiText.instances[i].riString);
            if (RiText.instances[i])
                delete(RiText.instances[i]);
        }
        RiText.instances = [];
    };
    
    addSpaces = function(str, num) {
        
        for ( var i = 0; i < num; i++)
            str += " ";
        return str;
    };
    
    checkLineHeight = function(currentH, lineH, maxH) {

        return currentH + lineH <= maxH;
    };
    
    pushLine = function(arr, tmp) {

        for ( var i = tmp.length - 1; i >= 0; i--) {
            arr.push(tmp[i]);
        }
    };
    
    addLine = function(l, s)
    {
        if (!isNull(s)) {
            // strip trailing spaces (regex?)
            while (s.length > 0 && endsWith(s, " "))
                s = s.substring(0, s.length - 1);
            l.push(s); // add && clear the builder
        }
    };
    
    removeFromArray = function(items, element)
    {
        while (items.indexOf(element) !== -1) {
            items.splice(items.indexOf(element), 1);
        }
    }
      
    var RiText = makeClass();

    
    // 'Static' Methods ///////////////////////////////////////////////////////////// 
    
    RiText.dispose = function(toDelete) {
        if (arguments.length==1) {
            if (getType(toDelete) === 'array')
                disposeArray(toDelete);
            else if (getType(toDelete) === 'object')
                disposeOne(toDelete);
            else
                throw Error("Unexpected type: "+toDelete);
        }
        else if (arguments.length==0)
            disposeAll();
    }

    // TODO: Need to test this default across platforms and browsers ***
    RiText.getDefaultFont = function(p) {
        if (!RiText.defaults.font) {
            RiText.defaults.font = p.createFont(RiText.defaults.fontFamily, 14);
        }
        return RiText.defaults.font;
    };
    
    RiText.createLines = function(txt, x, y, maxW, maxH, leading, theFont) {

        // remove line breaks
        txt = replaceAll(txt, "\n", SP);

        //  adds spaces around html tokens
        txt = replaceAll(txt," ?(<[^>]+>) ?", " $1 ");

        // split into array of words
        var tmp = txt.split(SP);

        var words = [];
        for ( var i = tmp.length - 1; i >= 0; i--)
            words.push(tmp[i]);

        if (words.length < 1) return [];

        var tmp = new RiText(" ");
        theFont = theFont || RiText.getDefaultFont(p);
        if (!theFont) throw Error("no font");
        
        leading = leading>0 ? leading : theFont.leading;
      
        tmp.textFont(theFont);
        var textH = p.textAscent() + p.textDescent();
        disposeOne(tmp);

        var currentH = 0, currentW = 0;
        var newParagraph = false;
        var forceBreak = false;
        var strLines = [];

        var sb = RiText.defaults.indentFirstParagraph ? RiText.defaults.paragraphIndent : E;
        while (words.length > 0) {

            var next = words.pop();
            
            if (next.length == 0) continue;

            if (startsWith(next, '<') && endsWith(next, ">")) {
                //println("HTML: "+next);

                if (next === RiText.NON_BREAKING_SPACE || next === "</sp>") {
                    
                    sb += SP;
                }
                else if (next === RiText.PARAGRAPH || next === "</p>") {
                    
                    if (sb.length > 0) {// case: paragraph break
                        
                        newParagraph = true;
                    }
                    else if (RiText.indentFirstParagraph) {
                    
                        sb += RiText.defaults.paragraphIndent;
                    }
                }
                else if (endsWith(next, RiText.LINE_BREAK) || next === "</br>") {
                    
                    forceBreak = true;
                }
                continue;
            }

            p.textFont(theFont);
            currentW = p.textWidth(sb + next);

            // check line-length & add a word
            if (!newParagraph && !forceBreak && currentW < maxW) {
                
                sb += next + " "; // was addWord(sb, next);
            }
            else // new paragraph or line-break
            {
                // check vertical space, add line & next word
                if (checkLineHeight(currentH, textH, maxH)) {
                    
                    addLine(strLines, sb);
                    sb = E;

                    if (newParagraph) { // do indent

                        sb += RiText.defaults.paragraphIndent;
                        if (RiText.defaults.paragraphLeading > 0) {
                            sb += '|'; // filthy
                        }
                    }
                    newParagraph = false;
                    forceBreak = false;
                    sb += next + SP;//addWord(sb, next);

                    currentH += textH; // DCH: changed(port-to-js), 3.3.12 
                    // currentH += lineHeight; 
                }
                else {
                    
                    if (next != null) words.push(next);
                    break;
                }
            }
        }

        // check if leftover words can make a new line
        if (checkLineHeight(currentH, textH, maxH)) {
            addLine(strLines, sb);
            sb = E;
        }
        else {
            pushLine(words, sb.split(SP));
        }

        // lay out the lines
        var rts = createLinesByCharCountFromArray(strLines, x, y+textH, -1, leading, theFont);

        // set the paragraph spacing
        if (RiText.defaults.paragraphLeading > 0)  {
          var lead = 0;
          for (var i = 0; i < rts.length; i++)
          {
            var str = rts[i].getText();
            var idx = str.indexOf('|');
            if (idx > -1) {
              lead += RiText.defaults.paragraphLeading;
              rts[i].removeCharAt(idx);
            }
            rts[i].y += lead;
          }
        }
        
        // check all the lines are still in the rect
        var toKill = [];
        var check = rts[rts.length - 1];
        for (var z = 1; check.y > y + maxH; z++) {
            toKill.push(check);
            var idx = rts.length - 1 - z;
            if (idx < 0) break;
            check = rts[idx];
        }
        
        // remove the dead ones
        for (var z = 0; z < toKill.length; z++) {
            
            removeFromArray(rts,toKill[z]);
        }
        disposeArray(toKill);


        return rts;
    };

    // private
    createLinesByCharCountFromArray = function(txtArr, startX, startY, maxCharsPerLine, leading, font) {

        //console.log("RiText.createLinesByCharCountFromArray("+txtArr+", maxChars="+maxCharsPerLine+")");

        if (maxCharsPerLine == -1) {
            var ritexts = [];
            for ( var i = 0; i < txtArr.length; i++) {
                var rr = new RiText(txtArr[i], startX, startY);
                if (font) {
                    rr.textFont(font);
                }
                ritexts.push(rr);
            }

            if (ritexts.length < 1) return [];

            handleLeading(font, ritexts, startY, leading);

            return ritexts;
        }
        //else leading
          //  return createLines(txtArr, startX, startY, maxCharsPerLine, leading, font);
    };

    RiText.createLinesByCharCount = function(txt, startX, startY, maxCharsPerLine, leading, pFont) {

        //console.log("RiText.createLinesByCharCount("+txt+", "+startX+","+startY+", "+maxCharsPerLine+", "+leading+", "+pFont+")");

        if (!maxCharsPerLine || maxCharsPerLine<0) maxCharsPerLine = Number.MAX_VALUE;

        if (txt == null || txt.length == 0) return new Array();

        if (txt.length < maxCharsPerLine) return [ new RiText(txt, startX, startY) ];

        // remove any line breaks from the original
        txt = replaceAll(txt,"\n", " ");

        var texts = [];
        while (txt.length > maxCharsPerLine) {
            var toAdd = txt.substring(0, maxCharsPerLine);
            txt = txt.substring(maxCharsPerLine, txt.length);

            var idx = toAdd.lastIndexOf(" ");
            var end = "";
            if (idx >= 0) {
                end = toAdd.substring(idx, toAdd.length);
                if (maxCharsPerLine < Number.MAX_VALUE) end = end.trim();
                toAdd = toAdd.substring(0, idx);
            }
            texts.push(new RiText(toAdd.trim(), startX, startY));
            txt = end + txt;
        }

        if (txt.length > 0) {
            if (maxCharsPerLine < Number.MAX_VALUE) txt = txt.trim();
            texts.push(new RiText(txt, startX, startY));
        }

        handleLeading(pFont, texts, startY, leading);

        return texts;
    };
    
    RiText.setDefaultMotionType = function(motionType) {

        RiText.defaults.motionType = motionType;
    };

    RiText.setDefaultBoundingBoxVisible = function(value) {

        RiText.defaults.boundingBoxVisible = value;
    };

    RiText.setDefaultFont = function(pfont) {

        RiText.defaults.font = pfont;
    };

    RiText.setDefaultAlignment = function(align) {

        RiText.defaults.alignment = align;
    };

    RiText.createWords = function(txt, x, y, w, h, leading, pfont) {

        return createRiTexts(txt, x, y, w, h, leading, pfont, RiText.prototype.splitWords);
    };

    RiText.createLetters = function(txt, x, y, w, h, leading, pfont) {

        return createRiTexts(txt, x, y, w, h, leading, pfont, RiText.prototype.splitLetters);
    };

    createRiTexts = function(txt, x, y, w, h, leading, pfont, splitFun) // private 
    {
        if (!txt || !txt.length) return [];
        pfont = pfont || RiText.getDefaultFont(p);

        var rlines = RiText.createLines(txt, x, y, w, h, leading, pfont);
        if (!rlines) return [];

        var result = [];
        for ( var i = 0; i < rlines.length; i++) {
            
            var rts = splitFun.call(rlines[i]);
            for ( var j = 0; j < rts.length; j++)
                result.push(rts[j].textFont(pfont)); // add the words
            
            disposeOne(rlines[i]);//.dispose();
        }

        return result;
    };

    
    /**
     * A convenience method to draw all existing RiText objects (with no argument)
     * or an array of RiText objects (if supplied as an argument)
     * @param array - draws only the array if supplied (optional)
     */
    RiText.drawAll = function(array) {
        
        if (arguments.length == 1 && getType(array) === 'array') { 
            for ( var i = 0; i < RiText.instances.length; i++)
                if (RiText.instances[i]) RiText.instances[i].draw();
        }
        else {
            for ( var i = 0; i < RiText.instances.length; i++)
                if (RiText.instances[i]) RiText.instances[i].draw();
        }
        
    };//.expects([],[A]);
    
    RiText.setDefaultColor = function(r, g, b, a) {
        
        if (arguments.length >= 3) {
            if (typeof (r) === 'number') {
                RiText.defaults.color.r = r;
            }
            if (typeof (g) === 'number') {
                RiText.defaults.color.g = g;
            }
            if (typeof (b) === 'number') {
                RiText.defaults.color.b = b;
            }
        }
        if (arguments.length == 4) {
            if (typeof (a) === 'number') {
                RiText.defaults.color.a = a;
            }
        }
        if (arguments.length <= 2) {
            if (typeof (r) === 'number') {
                RiText.defaults.color.r = r;
                RiText.defaults.color.g = r;
                RiText.defaults.color.b = r;
            }
        }
        if (arguments.length == 2) {
            if (typeof (g) === 'number') {
                RiText.defaults.color.a = g;
            }
        }

    };

    // PUBLIC statics (TODO: clean up)
   
    RiText.NON_BREAKING_SPACE = "<sp>";
    RiText.LINE_BREAK = "<br>";
    RiText.PARAGRAPH = "<p>";
    
    RiText.instances = [];

    RiText.LEFT = 37; RiText.UP = 38; RiText.RIGHT = 39; RiText.DOWN = 40;

    // ==== RiTaEvent ============

    RiText.UNKNOWN = -1; RiText.TEXT_ENTERED = 1; RiText.BEHAVIOR_COMPLETED = 2; RiText.TIMER_TICK = 3;

    // ==== TextBehavior ============

    RiText.MOVE = 1; RiText.FADE_COLOR = 2; RiText.FADE_IN = 3; RiText.FADE_OUT = 4; RiText.FADE_TO_TEXT = 5; 
    RiText.TIMER = 6; RiText.SCALE_TO = 7; RiText.LERP = 8;

    // ==== Animation types ============

    RiText.LINEAR = 0; RiText.EASE_IN_OUT = 1; RiText.EASE_IN = 2; RiText.EASE_OUT = 3; 
    RiText.EASE_IN_OUT_CUBIC = 4; RiText.EASE_IN_CUBIC = 5; RiText.EASE_OUT_CUBIC = 6; 
    RiText.EASE_IN_OUT_QUARTIC = 7; RiText.EASE_IN_QUARTIC = 8; RiText.EASE_OUT_QUARTIC = 9; 
    RiText.EASE_IN_OUT_EXPO = 10; RiText.EASE_IN_EXPO = 11; RiText.EASE_OUT_EXPO = 12; 
    RiText.EASE_IN_OUT_SINE = 13; RiText.EASE_IN_SINE = 14; RiText.EASE_OUT_SINE = 15;
    
    RiText.defaults = { 
        
        color : { r : 0, g : 0, b : 0, a : 255 }, font: null, scaleX : 1, scaleY : 1,
        alignment : RiText.LEFT, motionType : RiText.LINEAR, boundingBoxVisible : false,
        paragraphLeading :  0, paragraphIndent: '    ', indentFirstParagraph: false,
        fontFamily: "Times New Roman", 
        // , scaleZ : 1, rotateX : 0, rotateY : 0, rotateZ : 0,        
    };

    
    RiText.prototype = {

        __init__ : function(text, xPos, yPos, font) { 
            
            text = text || "";
      
            this.color = { r : RiText.defaults.color.r, g : RiText.defaults.color.g, b : RiText.defaults.color.b, a : RiText.defaults.color.a };
    
            this.boundingBoxVisible = RiText.defaults.boundingBoxVisible;
            this.motionType = RiText.defaults.motionType;
            this.alignment = RiText.defaults.alignment;
            this.font = font || RiText.getDefaultFont(p);

            this.behaviors = [];
            this.scaleX = RiText.defaults.scaleX;
            this.scaleY = RiText.defaults.scaleY;
    
            RiText.instances.push(this);
    
            if (typeof (text) == 'string') {
                this.riString = new RiString(text);
            }
            else if (typeof text == 'object' && typeof text.getText !== 'undefined') { 
                this.riString = new RiString(text.getText());
            }
            else
                throw Error("RiText expects 'string' or RiString, got: " + text);
    
            this.x = xPos || p.width / 2 - this.textWidth() / 2.0;
            this.y = yPos || p.height / 2;
            //console.log("RiText.init: "+this);
            
            return this;
        },
        
        draw : function() {

            if (this.riString) {
            
                p.pushStyle();
        
                p.pushMatrix();
    
                p.translate(this.x, this.y);
                // rotate(this.rotateZ);  
                p.scale(this.scaleX, this.scaleY);
        
                // Set color
                p.fill(this.color.r, this.color.g, this.color.b, this.color.a);
        
                // Set font params
                p.textAlign(this.alignment);
                p.textFont(this.font, this.fontSize);
        
                // Draw text
                p.text(this.riString.text, 0, 0);
        
                // And the bounding box
                if (this.boundingBoxVisible) {
                    p.noFill();
                    p.stroke(this.color.r, this.color.g, this.color.b, this.color.a);
                    var th = p.textDescent() + p.textAscent()
                    p.rect(0, -th + p.textDescent(), this.textWidth(), th);
                }
        
                p.popMatrix();
                p.popStyle();
                
            }
    
            return this;
        },
        
        textWidth : function() {
            
            p.pushStyle();
            this.font = this.font || RiText.getDefaultFont(p);
            p.textFont(this.font, this.fontSize);
            var result = p.textWidth(this.riString.text);
            p.popStyle();
            return result;
        },
        
        getText : function() {
            if (!this.riString || !this.riString.text)
                throw Error("dead risString");
            return this.riString.text;
        },
        
        toString : function() {
            var s =  (this.riString && this.riString.text) || "undefined";
            return '['+Math.round(this.x)+","+Math.round(this.y)+",'"+s+"']";
        },
        
        splitWords : function() {
            
            var l = [];
            var txt = this.riString.text;
            var words = txt.split(' ');
    
            for ( var i = 0; i < words.length; i++) {
                if (words[i].length < 1) continue;
                var tmp = this.clone();
                tmp.setText(words[i]);
                var mx = this.getWordOffset(words, i);
                tmp.setPosition(mx, this.y);
                l.push(tmp);
            }
    
            return l;
        },
    
        splitLetters : function() {
    
            var l = [];
            var chars = [];
            var txt = this.getText();
            var len = txt.length;
            for (var t = 0; t < len; t++) {
                chars[t] = txt.charAt(t);
            }
    
            for ( var i = 0; i < chars.length; i++) {
                if (chars[i] == ' ') continue;
                var tmp = this.clone();
                tmp.setText(chars[i]);
                var mx = this.getCharOffset(i);
                tmp.setPosition(mx, this.y);
    
                l.push(tmp);
            }
    
            return l;
        },
        
        // DCH: THIS IS JUST TMP -- IS THERE A BETTER JS WAY?
        clone : function() {
    
            var c = new RiText(this.getText(), this.x, this.y);
            // need to clone all the parameters!!!
            c.fill(this.r, this.g, this.b, this.a);
            c.textFont(this.font);
            c.textSize(this.fontSize);
            return c;
        },
    
        textAlign : function(align) {
    
            this.alignment = align;
            return this;
        },
    
        textSize : function(size) {
    
            this.fontSize = size;
            return this;
        },
    
        textFont : function(pfont) {
    
            if (isNull(pfont)) {
                console.trace();
                throw new Error("Null font!");
                return;
            }
            this.font = pfont;
            this.fontSize = pfont.size;
            return this;
        },
    
        showBoundingBox : function(trueOrFalse) {
    
            this.boundingBoxVisible = trueOrFalse;
            return this;
        },
    
        setText : function(t) {
    
            this.riString.setText(t);
            return this;
        },
    
        setMotionType : function(motionType) {
    
            this.motionType = motionType;
        },
    
        getColor : function() {
    
            return this.color;
        },
    
        // D: changed setColor to fill
        fill : function(r, g, b, a) {
    
            if (arguments.length >= 3) {
                if (typeof (r) === 'number') {
                    this.color.r = r;
                }
                if (typeof (g) === 'number') {
                    this.color.g = g;
                }
                if (typeof (b) === 'number') {
                    this.color.b = b;
                }
            }
            if (arguments.length == 4) {
                if (typeof (a) === 'number') {
                    this.color.a = a;
                }
            }
            if (arguments.length <= 2) {
                if (typeof (r) === 'number') {
                    this.color.r = r;
                    this.color.g = r;
                    this.color.b = r;
                }
            }
            if (arguments.length == 2) {
                if (typeof (g) === 'number') {
                    this.color.a = g;
                }
            }
            return this;
        },
    
        isVisible : function() {
    
            return this.color.a > 0;
        },
    
        setAlpha : function(a) {
    
            this.color.a = a;
            return this;
        },
    
        getPosition : function() {
    
            return [ this.x, this.y ];
        },
    
        setPosition : function(x, y) {
    
            this.x = x;
            this.y = y;
            return this;
        },
    
        //              rotate : function(rotate) {
        //                  this.rotateZ = rotate;
        //                  return this;
        //              },
    
        scale : function(scale) {
    
            this.scaleX = scale;
            this.scaleY = scale;
            return this;
        },
    
        fadeIn : function(sec) {
    
            this.fadeColor(null, null, null, 255, sec, RiText.FADE_IN);
            return this;
        },
    
        fadeOut : function(sec) {
    
            this.fadeColor(null, null, null, 0, sec, RiText.FADE_OUT);
            return this;
        },
    
        // !@# TODO: add delay attributes to the two functions below
        fadeColor : function(r, g, b, a, sec, type/* , delay */) {
    
            var fxType = type || RiText.FADE_COLOR; // ms // !@#
    
            var delay = 0; // delete this line when delay added
            anim = new ColorFader(this, [ r, g, b, a ], delay, toMs(sec), fxType);
    
            // D: what is going on here? Why 2 sets?
            // RiTa.behaviors.push(anim);                    
            this.behaviors.push(anim);
    
            return this;
        },
    
        moveTo : function(x, y, sec) {
    
            // console.log("moveTo("+x+ ", "+y+", "+sec+")");
    
            var delay = 0, // ms // !@# delete this when delay added
            anim = new TextMotion2D(this, x, y, delay, toMs(sec));
    
            this.behaviors.push(anim);
    
            return this; // or return the bejavior? (no, inconsistent)
        },
    
        //                disposeBehaviors : function() {
        //                    TextBehavior.dispose(this);
        //                },
    
    
        getCharOffset : function(charIdx) {
    
            var theX = this.x;
    
            p.pushStyle();
            p.textFont(this.font, this.fontSize);
    
            if (charIdx > 0) {
    
                var txt = this.getText();
    
                var len = txt.length;
                if (charIdx > len) // -1?
                charIdx = len;
    
                var sub = txt.substring(0, charIdx);
                theX = this.x + p.textWidth(sub);
            }
    
            p.popStyle();
    
            return theX;
        },
        
        textHeight : function() { 
            var result = -1;
            p.pushStyle();
                p.textFont(this.font, this.fontSize);
                result = p.textDescent()+p.textAscent();
            p.popStyle();
            return result;
        },
    
        getWordOffset : function(words, wordIdx) {
    
            //console.log("getWordOffset("+words+","+wordIdx+")");
    
            if (wordIdx < 0 || wordIdx >= words.length)
                throw new Error("Bad wordIdx=" + wordIdx + " for " + words);
    
            p.pushStyle();
            p.textFont(this.font, this.fontSize);
    
            var xPos = this.x;
    
            if (wordIdx > 0) {
                var pre = words.slice(0, wordIdx);
                var preStr = '';
                for ( var i = 0; i < pre.length; i++) {
                    preStr += pre[i] + ' ';
                    //if (addSpacesBetween)preStr += ' ';
                }
    
                var tw = p.textWidth(preStr);
    
                //console.log("x="+xPos+" pre='"+preStr+"' tw=" + tw); 
    
                switch (this.alignment) {
                    case RiText.LEFT:
                        xPos = this.x + tw;
                        break;
                    case RiText.RIGHT:
                        xPos = this.x - tw;
                        break;
                    default: // fix this
                        throw new Error("getWordOffset() only supported for "
                            + "LEFT & RIGHT alignments, found: " + this.alignment);
                }
            }
            p.popStyle();
    
            return xPos;
        },
        
        /**
         * Removes the character at the specified index
         * 
         * @param number the index
         * @return this RiString
         */
        removeCharAt : function(ind) { 
            
            this.riString.removeCharAt(ind);
            return this;
            
        }//.expects([N]).returns(O)
    
    }
    
    Processing.registerLibrary("RiTaP5", {
        
        
        //console.log("Processing.registerLibrary()");
        p : null, 
        
        init : function(obj) {
          //console.log("Processing.registerLibrary.init: ");
          //console.log(obj);
        },
    
        attach : function(p5) {
            p = p5;
            //console.log("Processing.registerLibrary.attach: ");
            //console.log(p5);
        },
        
        detach : function(p5) {
            console.log("Processing.registerLibrary.detach: ");
        },
        
        //exports : [] // export global function names?
           
    });
    
    window.RiText = RiText;

})(window);