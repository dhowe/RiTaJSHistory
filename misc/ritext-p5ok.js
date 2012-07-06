/*  
    NEXT: 
        add canvas ascent() and descent() methods (deal with difference in one or the other)
                -- try without jquery
        add memoizing of functions: textWidth, textAscent, textDescent, getBoundingBox, etc
        add interpolating behaviors
          
     $Id: ritext-p5ok.js,v 1.1 2012/05/29 15:19:08 dev Exp $
 */
    
(function(window, undefined) {
    
    var RiText_Canvas = makeClass();
    
    var DBUG = false; // tmp
    
    RiText_Canvas.prototype = {

        __init__ : function(ctx) {
            this.p = ctx;
            console.log("RiText_Canvas.init");
        },
        
        __pushState : function(str) {
            this.p.save();
            return this;
        },
        
        __popState : function() {
            this.p.restore();
            return this;
        },

        __textAlign : function(align) {
            //this.p.textAlign(align);
            return this;
        },
        
        __scale : function(sx, sy) {
            if(DBUG) console.log("scale: "+sx+","+sy+","+1);
            this.p.scale(sx, sy, 1);
        },
        
        __translate : function(tx, ty) {
            if(DBUG)console.log("translate: "+tx+","+ty+","+0);
            this.p.translate(tx, ty, 0);
        },
        
        __rotate : function(zRot) {
            this.p.rotate(0,0,zRot);
        },
        
        __text : function(str, x, y) {
            if(DBUG)console.log("text: "+str+","+x+","+y);
            this.p.baseline = 'alphabetic';
            this.p.fillText(str, x, y);
            //this.p.strokeText(str, x, y);
        },

        __rect : function(x,y,w,h) {
            if(DBUG)console.log("strokeRect: ");
            if(DBUG)console.log(x,y,w,h);
            this.p.strokeRect(x,y,w,h);
        },
        
        __textWidth : function(font, fontSize, str) {
            this.p.save();
            this.__textFont(font, fontSize);
            if(DBUG)console.log("measureText: ");
            if(DBUG)console.log(this.p.measureText(this.p.font, str));
            var tw = this.p.measureText(str).width;
            this.p.restore();
            return tw;
        },
        
        __textAscent : function(font,fontSize) {
            this.p.save();
            this.__textFont(font,fontSize);
            var asc = this.p.font.ascent;
            if(DBUG)console.log("__textAscent: "+asc);
            if(DBUG)console.log(this.p.font);
            this.p.restore();
            return asc;
        },
        
        __textDescent : function(font,fontSize) {
            this.p.save();
            this.__textFont(font,fontSize);
            var dsc = this.p.font.descent;
            if(DBUG)console.log("__textDescent: "+dsc);
            if(DBUG)console.log(this.p.font);
            this.p.restore();
            return dsc;
        },
        
        __textFont : function(font, size) {
            if (arguments.length!=2)
                throw Error("__textFont takes 2 args!");
            this.p.font = "normal "+size+"px "+font;
            if(DBUG)console.log("__textFont: "+this.p.font);
            
        },
        
        __createFont : function(name, size) {
            if(DBUG)console.log(this.toString() +": creating font: "+name+"-"+size);
            this.__textFont(name, size);
            return this.p.font;
        },
        
        __getWidth : function() {
            if(DBUG)console.log("width: "+this.p.canvas.width);
            return this.p.canvas.width || 200;
        },
        
        __getHeight : function() {
            if(DBUG)console.log("height: "+this.p.canvas.height);
            return this.p.canvas.height || 200;
        },
        
        __fill : function(r,g,b,a) {
            this.p.fillStyle="rgba("+r+","+g+","+b+","+(a/255)+")";
        },
        
        __stroke : function(r,g,b,a) {
            if(DBUG)console.log("__stroke: "+a);
            if(DBUG)console.log(r,g,b,(a/255));
            this.p.strokeStyle="rgba("+r+","+g+","+b+","+(a/255)+")";
        },
        
        __getBoundingBox : function(font,fontSize,str) { // bold, italic?
            this.p.font = "normal "+fontSize+"px "+font;
            var w = this.p.measureText(str).width;
            var metrics = this.__getMetrics(font, str);
            return { x: 0, y: metrics.descent, width: w, height: -metrics.ascent };
        },

        __getMetrics : function(font, str) {// does this need fontSize? no

            //console.log(font+","+str);
            var text = $('<span style="font: ' + font + '">'+str+'</span>');
            var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

            var div = $('<div></div>');
            div.append(text, block);

            var body = $('body');
            body.append(div);

            try {

                var result = {};

                block.css({ verticalAlign: 'baseline' });
                result.ascent = block.offset().top - text.offset().top;

                block.css({ verticalAlign: 'bottom' });
                var height = block.offset().top - text.offset().top;

                result.descent = (height - result.ascent) - 1;

            } finally {
                div.remove();
            }

            //console.log(result);
            return result;
        },
        
        toString : function() {
            return 'RiText_Canvas';
        }
    };
    
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

      font = font || RiText.getDefaultFont();
      
      leading = (leading>0) ? leading : font.leading;
      
      // handle the line y-spacing
      var nextHeight = startY;
      ritexts[0].setFont(font);
      for ( var i = 0; i < ritexts.length; i++) {
        if (font) ritexts[i].setFont(font); // set the specified font
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
    
    // make a sub-case of createLinesByCharCount() ?
    createLinesByCharCountFromArray = function(txtArr, startX, startY, maxCharsPerLine, leading, font) {

        //console.log("RiText.createLinesByCharCountFromArray("+txtArr+", maxChars="+maxCharsPerLine+")");

        if (maxCharsPerLine == -1) {
            var ritexts = [];
            for ( var i = 0; i < txtArr.length; i++) {
                var rr = new RiText(txtArr[i], startX, startY);
                if (font) {
                    rr.setFont(font);
                }
                ritexts.push(rr);
            }

            if (ritexts.length < 1) return [];

            handleLeading(font, ritexts, startY, leading);

            return ritexts;
        }
        //else return createLines(txtArr, startX, startY, maxCharsPerLine, leading, font);
    };
      
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
            RiText.disposeAll();
    }
    
    RiText.disposeAll = function() {
        
        for ( var i = 0; i < RiText.instances.length; i++) {
            
            if (RiText.instances[i] && RiText.instances[i].hasOwnProperty["riString"])
                delete(RiText.instances[i].riString);
            if (RiText.instances[i])
                delete(RiText.instances[i]);
        }
        RiText.instances = [];
    };
    
    // TODO: if txt is an array, maintain line breaks... ?
    RiText.createLines = function(txt, x, y, maxW, maxH, leading, theFont) {
        
        var g = window.RiGraphics;

        // remove line breaks
        txt = replaceAll(txt, "\n", SP);

        //  adds spaces around html tokens
        txt = replaceAll(txt," ?(<[^>]+>) ?", " $1 ");

        // split into array of words
        var tmp = txt.split(SP), words = [];
        for ( var i = tmp.length - 1; i >= 0; i--)
            words.push(tmp[i]);

        if (!words.length) return [];

        var tmp = new RiText(" ");
        theFont = theFont || RiText.getDefaultFont();
        if (!theFont) throw Error("no font");
        
        leading = leading>0 ? leading : theFont.leading;
      
        tmp.setFont(theFont);
        var textH = this.textHeight();
        disposeOne(tmp);

        var currentH = 0, currentW = 0, newParagraph = false, forceBreak = false, strLines = [];

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

            g.__textFont(theFont, theFont.size);
            
            currentW = g.__textWidth(theFont, theFont.size, sb + next);

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

    // TODO: if txt is an array, maintain line breaks... ?
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

    RiText.setDefaultFont = function(font, fontSize) {
        
        RiText.defaults.font = font;
        if (fontSize)
            RiText.defaults.fontSize = fontSize;
    };

    RiText.setDefaultAlignment = function(align) {

        RiText.defaults.alignment = align;
    };

    RiText.createWords = function(txt, x, y, w, h, leading, font) {

        return createRiTexts(txt, x, y, w, h, leading, font, RiText.prototype.splitWords);
    };

    RiText.createLetters = function(txt, x, y, w, h, leading, font) {

        return createRiTexts(txt, x, y, w, h, leading, font, RiText.prototype.splitLetters);
    };

    createRiTexts = function(txt, x, y, w, h, leading, font, splitFun) // private 
    {
        if (!txt || !txt.length) return [];
        font = font || RiText.getDefaultFont();

        var rlines = RiText.createLines(txt, x, y, w, h, leading, font);
        if (!rlines) return [];

        var result = [];
        for ( var i = 0; i < rlines.length; i++) {
            
            var rts = splitFun.call(rlines[i]);
            for ( var j = 0; j < rts.length; j++)
                result.push(rts[j].setFont(font)); // add the words
            
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
    
    // TODO: *** Need to test this font default across all platforms and browsers ***
    RiText.getDefaultFont = function() {
        //console.log("RiText.getDefaultFont: "+RiText.defaults.fontFamily+","+RiText.defaults.fontSize);
        RiText.defaults.font = RiText.defaults.font || RiText.renderer.__createFont(RiText.defaults.fontFamily, RiText.defaults.fontSize);
        return RiText.defaults.font;
    },

    // PUBLIC statics (TODO: clean up) ///////////////////////////////////////////
   
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
        fontFamily: "Times New Roman", fontSize: 14, 
        // , scaleZ : 1, rotateX : 0, rotateY : 0, rotateZ : 0,        
    };

    
    RiText.prototype = {

        __init__ : function(text, xPos, yPos, font, fontSize) { 
            
//          console.log("RiText.init.this: "+this);
            
            text = text || E;
      
            this.color = { 
                r : RiText.defaults.color.r, 
                g : RiText.defaults.color.g, 
                b : RiText.defaults.color.b, 
                a : RiText.defaults.color.a 
            };
    
            this.boundingBoxVisible = RiText.defaults.boundingBoxVisible;
            this.motionType = RiText.defaults.motionType;
            this.alignment = RiText.defaults.alignment;
            
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
            
            this.g = RiText.renderer;
            
            this.font = font || RiText.getDefaultFont(this.g);
            this.fontSize = this.font.size || RiText.defaults.fontSize;
            
            //this.setFont(font, fontSize);
            
            this.x = xPos || this.g.__getWidth() / 2 - this.textWidth() / 2.0;
            this.y = yPos || this.g.__getHeight() / 2;
            
//            console.log(this.g.__textAscent(this.font,this.fontSize,this.text));
//            console.log(this.g.__textDescent(this.font,this.fontSize,this.text));
//            
            return this;
        },
        
        draw : function() {
            
            var g = this.g;
            
            if (this.riString) {
            
                g.__pushState();
                
                //g.__rotate(this.rotateZ);  
                g.__translate(this.x, this.y);
                g.__scale(this.scaleX, this.scaleY);
        
                // Set color
                g.__fill(this.color.r, this.color.g, this.color.b, this.color.a);
        
                // Set font params
                g.__textAlign(this.alignment);
                g.__textFont(this.font, this.fontSize);
        
                // Draw text
                g.__text(this.riString.text, 0, 0);
        
                // And the bounding box
                if (this.boundingBoxVisible) {
                    g.__fill(0, 0, 0, 0);
                    g.__stroke(this.color.r, this.color.g, this.color.b, this.color.a);
                    var bb = g.__getBoundingBox(this.font, this.fontSize, this.riString.text);
                    g.__rect(bb.x, bb.y, bb.width, bb.height);
//                    var th = this.textHeight();
//                    g.__rect(0, -th + g.__textDescent(this.font, this.fontSize), g.__textWidth(this.font, this.fontSize, this.riString.text), th);
                }
                
                g.__popState();
            }
    
            return this;
        },
        
        textWidth : function() {
            
            var g = this.g;
            g.__pushState();
            this.font = this.font || RiText.getDefaultFont(); // check
            ///g.__textFont(this.font, this.fontSize);
            var result = g.__textWidth(this.font, this.fontSize, this.riString.text);
            g.__popState();
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
        
        
        clone : function() {
    
            var c = new RiText(this.getText(), this.x, this.y);
            
            // need to clone all the parameters
            // DCH: TMP -> Must be a better (JS) way?
            c.setColor(this.r, this.g, this.b, this.a);
            c.setFont(this.font, this.fontSize);
            c.setAlignment(this.alignment);
            c.setSize(this.fontSize);
            
            return c;
        },
        
        setAlignment : function(alignment) {
            this.alignment = alignment;
            return this;
        },
        
        getAlignment : function() {
            return this.alignment;
        },
        
        setSize : function(size) {
            this.fontSize = size;
            return this;
        },
        
        getSize : function() {
            return this.fontSize;
        },
        
        /**
         * Set the font and size for this RiText
         * @param font - a font object or string
         * @param fontSize (optional)
         * @returns {RiText}
         */
        setFont : function(font, fontSize) {
            this.font = font;
            if (!fontSize && !font.size) {
                console.warn("[WARN] Reverting to default font-size for: "+font);
                fontSize = RiText.defaults.fontSize;
            }
            this.fontSize = fontSize || font.size;
            
//            if (arguments.length == 0)
//            var a = arguments;
//            switch(a.length) {
//                case 0:
//                    this.font = RiText.getDefaultFont(this.g);
//                    this.fontSize = this.font.size || RiText.defaults.fontSize;
//                    break;
//                case 1:
//                    if (getType(font)=='object') {
//                        
//                    }
//                    break;
//                case 2:
//                    break;
//            }
//            if (getType(font)=='string') {
//                if (a.length)
//            }
//            else if (getType(font)=='object') {
//                
//            }
//            
//            
////            this.g.__textFont(font, fontSize);
////            
////            
////                var fontName = font;
////                this.fontSize = fontSize ||  this.fontSize || RiText.defaults.fontSize;
////                this.font = this.g.__createFont(fontName, fontSize);
////            }
////            else if (getType(font)=='object') {
////                this.font = font;
////                this.fontSize = fontSize || this.font.size;
////            }
////        
////            this.fonts[fontName+"/"+fontSize] = font;
////            this.font = font || RiText.getDefaultFont(this.g);
////            this.fontSize = this.font.size || RiText.defaults.fontSize;
////            console.log(this.riString.text+": "+this.font +","+this.fontSize);
////            
//            
//            /**
//             * Sets current font using either a PFont, or a font string and fontsize int
//             */
////            this.font = font;
////            if (!fontSize && !font.size) {
////                console.warn("[WARN] Reverting to default font-size for: "+font);
////                fontSize = RiText.defaults.fontSize;
////            }
////            this.fontSize = fontSize || font.size;
//            return this;
        },
        
        getFont: function() {
            return this.font.name+"-"+this.fontSize+" ("+this.font.size+")";
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
    
        setColor : function(r, g, b, a) {
    
            if (arguments.length >= 3) {
                    this.color.r = r;
                    this.color.g = g;
                    this.color.b = b;
            }
            if (arguments.length == 4) {
                    this.color.a = a;
            }
            if (arguments.length <= 2) {
                    this.color.r = r;
                    this.color.g = r;
                    this.color.b = r;
            }
            if (arguments.length == 2) {
                    this.color.a = g;
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
    
        rotate : function(rotate) {
          this.rotateZ = rotate;
          return this;
        },
    
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
    
        getCharOffset : function(charIdx) {
    
            var g = this.g;
            var theX = this.x;
    
            g.__pushState();
            g.__textFont(this.font, this.fontSize);
    
            if (charIdx > 0) {
    
                var txt = this.getText();
    
                var len = txt.length;
                if (charIdx > len) // -1?
                charIdx = len;
    
                var sub = txt.substring(0, charIdx);
                theX = this.x + g.__textWidth(this.font, this.fontSize, sub);
            }
    
            g.__popState();
    
            return theX;
        },
        
        textWidth : function() { 
            return this.g.__textWidth(this.font, this.fontSize, this.riString.text);
        },
        
        textAscent : function() { 
            return this.g.__textAscent(this.font, this.fontSize);
        },
        
        textDescent : function() { 
            return this.g.__textDescent(this.font, this.fontSize);
        },
        
        textHeight : function() { 
            var g = this.g;
            var result = -1;
            //g.__pushState();
                //g.__textFont(this.font,this.fontSize);
            var result = g.__textDescent(this.font, this.fontSize) + g.__textAscent(this.font, this.fontSize);
            //g.__popState();
            return result;
        },
    
        getWordOffset : function(words, wordIdx) {
    
            //console.log("getWordOffset("+words+","+wordIdx+")");
    
            if (wordIdx < 0 || wordIdx >= words.length)
                throw new Error("Bad wordIdx=" + wordIdx + " for " + words);
            
            var g = this.g;
            
            g.__pushState();
            g.__textFont(this.font, this.fontSize);
    
            var xPos = this.x;
    
            if (wordIdx > 0) {
                var pre = words.slice(0, wordIdx);
                var preStr = '';
                for ( var i = 0; i < pre.length; i++) {
                    preStr += pre[i] + ' ';
                    //if (addSpacesBetween)preStr += ' ';
                }
    
                var tw = g.__textWidth(this.font, this.fontSize, preStr);
    
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
            g.__popState();
    
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
    
    // P5 delegates
    RiText.prototype.fill     = RiText.prototype.setColor;
    RiText.prototype.textFont = RiText.prototype.setFont;
    RiText.prototype.textSize = RiText.prototype.setSize;
        
    
    /*interface TextMetrics {
    // x-direction
    readonly attribute double width; // advance width
    readonly attribute double actualBoundingBoxLeft;
    readonly attribute double actualBoundingBoxRight;

    // y-direction
    readonly attribute double fontBoundingBoxAscent;
    readonly attribute double fontBoundingBoxDescent;
    readonly attribute double actualBoundingBoxAscent;
    readonly attribute double actualBoundingBoxDescent;
    readonly attribute double emHeightAscent;
    readonly attribute double emHeightDescent;
    };*/
    
    var RiText_P5 = makeClass();

    RiText_P5.prototype = {

        __init__ : function(p) {
            this.p = p;
            console.log("RiText_P5.init");
        },
    
        __pushState : function(str) {
            this.p.pushStyle();
            this.p.pushMatrix();
            return this;
        },
        
        __popState : function() {
            this.p.popStyle();
            this.p.popMatrix();
            return this;
        },

        __textAlign : function(align) {
            this.p.textAlign(align);
            return this;
        },
        
        __scale : function(sx, sy) {
            this.p.scale(sx, sy, 1);
        },
        
        __translate : function(tx, ty) {
            this.p.translate(tx, ty, 0);
        },
        
        __rotate : function(zRot) {
            this.p.rotate(0,0,zRot);
        },
        
        __text : function(str, x, y) {
            //console.log("__text: "+str);
            this.p.text(str, x, y);
        },
        
        __fill : function(r,g,b,a) {
            this.p.fill(r,g,b,a);
        },
        
        __stroke : function(r,g,b,a) {
            this.p.stroke(r,g,b,a);
        },
        
        __rect : function(x,y,w,h) {
            this.p.rect(x,y,w,h);
        },
        

        __textFont : function(font, fontSize) {
//            var a = arguments;
//            if (a.length == 1 && getType(a[0]) === 'object' ) {
//            } 
            if (arguments.length != 2)
                throw Error("__textFont takes 2 args!");
            this.p.textFont(font, fontSize);
        },
        
        __textWidth : function(font, fontSize, str) {
            this.p.pushStyle();
            this.p.textFont(font, fontSize);     
            var tw = this.p.textWidth(str);
            this.p.popStyle();
            return tw;
        },
        
        __textAscent : function(font,fontSize) {
            this.p.pushStyle();
            this.p.textFont(font, fontSize);
            var asc = this.p.textAscent();
            this.p.popStyle();
            return asc;
        },
        
        __textDescent : function(font,fontSize) {
            this.p.pushStyle();
            this.p.textFont(font, fontSize);
            var dsc = this.p.textDescent();
            this.p.popStyle();
            return dsc;
        },
        
        __createFont : function(name, size) {
            console.log("Creating font: "+name+"-"+size);
            return this.p.createFont(name, size);
        },
        
        __getWidth : function() {

            return this.p.width;
        },
        
        __getHeight : function() {

            return this.p.height;
        },
        
        __getBoundingBox : function(font, fontSize, str) {
            var ascent  = this.__textAscent(font, fontSize);
            var descent = this.__textDescent(font, fontSize);
            var width = this.__textWidth(font, fontSize, str);
            return { x: 0, y: descent, width: width, height: -(ascent+descent) };
        },
        
        toString : function() {
            return 'RiText_P5';
        }
    };

    if (typeof Processing !== 'undefined') {
        
        Processing.registerLibrary("RiTaP5", {
            
            //console.log("Processing.registerLibrary()");
            p : null, 
            
            init : function(obj) {
              //console.log("Processing.registerLibrary.init: ");
            },
        
            attach : function(p5) {
                p = p5;
                //console.log("Processing.registerLibrary.attach: ");
                RiText.renderer= new RiText_P5(p5);
            },
            
            detach : function(p5) {
                console.log("Processing.registerLibrary.detach: ");
            },
            
            //exports : [] // export global function names?
               
        });
    }
    else {
        var cnv = document.getElementsByTagName("canvas")[0];
        RiText.renderer = new RiText_Canvas(cnv.getContext("2d"));
    }
    
    window.RiText = RiText;
    

})(window);