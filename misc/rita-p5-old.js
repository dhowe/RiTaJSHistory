/*  
	RiText: Re-add as conditional include
	
		Fix behaviors: Problem with jump after first interpolate()!
		
		Add: fadeToText(string, sec)
		Add: scaleTo(scale, sec)
		Add: rotateTo(radians, sec)  [lets ignore rotate stuff for now]
 */


    Processing.lib.RiTaLibrary = function() {
    
        function handleLeading(font, ritexts, startY, leading) // PApplet specific? no (move to RiText pk)
        {
    
            if (isNull(ritexts) || ritexts.length < 1) return;
    
            if (!isNull(font)) ritexts[0].textFont(font);
    
            // calculate the leading  
            var yOff = ritexts[0].textHeight() * 1.4; // RANDOM_CONSTANT, yuck
            if (leading >= 0) yOff = ritexts[0].textAscent() + leading;
    
            //console.log("handleLeading1("+font.name+"/"+font.size+"/leading:"+yOff+")");
    
            // handle the line y-spacing
            var nextHeight = startY;
            for ( var i = 0; i < ritexts.length; i++) {
                if (!isNull(font)) ritexts[i].textFont(font); // set the specified font
                ritexts[i].y = nextHeight; // adjust y-pos
                nextHeight += yOff;
            }
        }
    
        RiText = {
        
            // from PConstants (DCH: ugly -- how can we use them directly?)
        
            LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40,
        
            SLEEP_PER_FRAME_MS : 1000 / 30, // 30 FPS
        
            // ==== RiTaEvent ============
        
            UNKNOWN : -1, TEXT_ENTERED : 1, BEHAVIOR_COMPLETED : 2, TIMER_TICK : 3,
        
            // ==== TextBehavior ============
        
            MOVE : 1, FADE_COLOR : 2, FADE_IN : 3, FADE_OUT : 4, FADE_TO_TEXT : 5, TIMER : 6, SCALE_TO : 7, LERP : 8,
        
            // ==== Animation types ============
        
            LINEAR : 0, EASE_IN_OUT : 1, EASE_IN : 2, EASE_OUT : 3, EASE_IN_OUT_CUBIC : 4, EASE_IN_CUBIC : 5, EASE_OUT_CUBIC : 6, EASE_IN_OUT_QUARTIC : 7, EASE_IN_QUARTIC : 8, EASE_OUT_QUARTIC : 9, EASE_IN_OUT_EXPO : 10, EASE_IN_EXPO : 11, EASE_OUT_EXPO : 12, EASE_IN_OUT_SINE : 13, EASE_IN_SINE : 14, EASE_OUT_SINE : 15,
        }
        
        
        RiText = function (text, xPos, yPos, font) {
    
            return this.init(text, xPos, yPos, font);
        }
    
        RiText.instances = [];
    
        RiText.defaults = { x : 0, y : 0, z : 0, color : { r : 0, g : 0, b : 0, a : 255 }, 
            alignment : RiText.LEFT, motionType : RiText.LINEAR, boundingBoxVisible : false, font : createFont(
            "Arial", 12), scaleX : 1, scaleY : 1, scaleZ : 1, rotateX : 0, rotateY : 0, rotateZ : 0
        //theFontSize : 10,  
        };
    
        // !@# does this need an interface?
        RiText.callbacksDisabled = false;
    
        // Set of (static) functions to be called on RiText class, not on instances
    
        RiText.disposeAll = function() {
    
            for ( var i = 0; i < RiText.instances.length; i++)
                delete (RiText.instances[i]);
            RiText.instances = [];
            return true;
        };
    
        RiText.dispose = function(riTextArray) { // BROKEN: 3.2.12: DCH
    
            var ok = true;
            for ( var i = 0; i < riTextArray.length; i++) {
                if (!riTextArray[i].dispose()) ok = false;
            }
            return ok;
        };
    
        // ======================================================
        RiText.createLines = function(txt, x, y, maxW, maxH, leading, pf) {
    
            // remove line breaks
            txt = replaceAll(txt, "\n", " ");
    
            // 	adds spaces around html tokens
            txt = replaceAll(txt, " ?(<[^>]+>) ?", " $1 ");
    
            // split into array of words
            var tmp = txt.split(" ");
    
            var words = [];
            for ( var i = tmp.length - 1; i >= 0; i--)
                words.push(tmp[i]);
    
            if (words.length < 1) return new Array();
    
            var tmp = new RiText(" ");
            var theFont = assign(theFont, RiText.defaults.font);
            tmp.textFont(theFont);
            var textH = tmp.textHeight();
            tmp.dispose();
    
    
            var currentH = 0, currentW = 0;
            var newParagraph = false;
            var forceBreak = false;
    
            var strLines = new Array();
    
            var sb = RiText.indentFirstParagraph ? RiText.PARAGRAPH_INDENT : "";
            while (words.length > 0) {
    
                var next = words.pop();
                if (next.length == 0) continue;
    
                if (startsWith(next, '<') && endsWith(next, ">")) {
                    //println("HTML: "+next);
    
                    if (next === RiText.NON_BREAKING_SPACE || next === "</sp>") {
                        sb += " ";
                    }
                    else if (next === RiText.PARAGRAPH || next === "</p>") {
                        if (sb.length > 0) // case: paragraph break
                            newParagraph = true;
                        else if (RiText.indentFirstParagraph) sb += RiText.PARAGRAPH_INDENT;
                    }
                    else if (endsWith(next, RiText.LINE_BREAK) || next === "</br>") {
                        forceBreak = true;
                    }
                    continue;
                }
    
                textFont(theFont);
                currentW = textWidth(sb + next);
    
                // check line-length & add a word
                if (!newParagraph && !forceBreak && currentW < maxW) {
                    sb += next + " "; // was addWord(sb, next);
                }
                else // new paragraph or line-break
                {
                    // check vertical space, add line & next word
                    if (RiText.checkLineHeight(currentH, textH, maxH)) {
                        RiText.addLine(strLines, sb);
                        sb = "";
    
                        if (newParagraph) { // do indent
    
                            sb += RiText.PARAGRAPH_INDENT;
                            if (RiText.PARAGRAPH_LEADING > 0) {
                                sb += '|'; // dirty
                            }
                        }
                        newParagraph = false;
                        forceBreak = false;
                        sb += next + " ";//addWord(sb, next);
    
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
            if (RiText.checkLineHeight(currentH, textH, maxH)) {
                RiText.addLine(strLines, sb);
                sb = "";
            }
            else {
                RiText.pushLine(words, sb.split(" "));
            }
    
            var rts = RiText.createLinesByCharCountFromArray(strLines, x + 1, y + textH - 2, -1,
                leading, pf);
    
            // set the paragraph spacing
            if (RiText.PARAGRAPH_LEADING > 0) {
                var lead = 0;
                for ( var i = 0; i < rts.length; i++) {
                    var str = rts[i].getText();
                    var idx = str.indexOf('|');
                    if (idx > -1) {
                        lead += RiText.PARAGRAPH_LEADING;
                        rts[i].removeCharAt(idx);
                    }
                    rts[i].y += lead;
                }
            }
    
            // double-check that all the lines are in the rect (yuk!)
            var check = rts[rts.length - 1];
            while (check.y > y + maxH) {
                var chkArr = check.getText().split(" ");
                rts.pop().dispose();
                RiText.pushLine(words, chkArr); // re-add words to stack
                check = rts[rts.length - 1];
            }
    
            return rts;
        };
    
        // doesnt have a test
        RiText.createLinesByCharCountFromArray = function(txtArr, startX, startY, maxCharsPerLine,
            leading, font) {
    
            //console.log("RiText.createLinesByCharCountFromArray("+txtArr+", maxChars="+maxCharsPerLine+")");
    
            if (maxCharsPerLine == -1) {
                var ritexts = [];
                for ( var i = 0; i < txtArr.length; i++) {
                    var rr = new RiText(txtArr[i], startX, startY);
                    if (!isNull(font)) {
                        rr.textFont(font);
                    }
                    ritexts.push(rr);
                }
    
                if (ritexts.length < 1) return [];
    
                handleLeading(font, ritexts, startY, leading);
    
                return ritexts;
            }
            // will this ever happen?
            else
                return createLines(txtArr, startX, startY, maxCharsPerLine, leading, font);
        };
    
        RiText.createLinesByCharCount = function(txt, startX, startY, maxCharsPerLine, leading, pFont) {
    
            //console.log("RiText.createLinesByCharCount("+txt+", "+startX+","+startY+", "+maxCharsPerLine+", "+leading+", "+pFont+")");
    
            if (isNull(pFont)) pFont = RiText.defaults.font;
    
            if (isNull(maxCharsPerLine) || maxCharsPerLine < 1) maxCharsPerLine = INTEGER_MAX_VALUE;
    
            if (txt == null || txt.length == 0) return new Array();
    
            if (txt.length < maxCharsPerLine) return [ new RiText(txt, startX, startY) ];
    
            // remove any line breaks from the original
            txt = replaceAll(txt, "\n", " ");
    
            var texts = [];
            while (txt.length > maxCharsPerLine) {
                var toAdd = txt.substring(0, maxCharsPerLine);
                txt = txt.substring(maxCharsPerLine, txt.length);
    
                var idx = toAdd.lastIndexOf(" ");
                var end = "";
                if (idx >= 0) {
                    end = toAdd.substring(idx, toAdd.length);
                    if (maxCharsPerLine < INTEGER_MAX_VALUE) end = end.trim();
                    toAdd = toAdd.substring(0, idx);
                }
                texts.push(new RiText(toAdd.trim(), startX, startY));
                txt = end + txt;
            }
    
            if (txt.length > 0) {
                if (maxCharsPerLine < INTEGER_MAX_VALUE) txt = txt.trim();
                texts.push(new RiText(txt, startX, startY));
            }
    
            handleLeading(pFont, texts, startY, leading);
    
            return texts;
        };
    
        // privates ! ============================================
        RiText.PARAGRAPH_INDENT = '    ';
        RiText.PARAGRAPH_LEADING = 0;
        RiText.indentFirstParagraph = true;
        RiText.NON_BREAKING_SPACE = "<sp>";
        RiText.LINE_BREAK = "<br>";
        RiText.PARAGRAPH = "<p>";
    
        RiText.addSpaces = function(str, num) {
    
            for ( var i = 0; i < num; i++)
                str += " ";
            return str;
        };
        RiText.checkLineHeight = function(currentH, lineH, maxH) {
    
            return currentH + lineH <= maxH;
        };
        RiText.pushLine = function(arr, tmp) {
    
            for ( var i = tmp.length - 1; i >= 0; i--)
                // reverse?
                arr.push(tmp[i]);
        };
        RiText.addLine = function(l, s) // remove?
        {
    
            //println("addLine("+l+")");
            if (!isNull(s)) {
                // strip trailing spaces (regex?)
                while (s.length > 0 && endsWith(s, " "))
                    s = s.substring(0, s.length - 1);
                l.push(s); // add && clear the builder
            }
    
        } //  ! ============================================
    
    
        RiText.setDefaultMotionType = function(motionType) {
    
            RiText.defaults.motionType = motionType;
            return this;
        };
    
        RiText.setDefaultBoundingBoxVisible = function(value) {
    
            RiText.defaults.boundingBoxVisible = value;
        };
    
        RiText.setDefaultFont = function(pfont) {
    
            RiText.defaults.font = pfont;
        };
    
        RiText.setDefaultFontSize = function(size) {
    
            console.warn("RiText.setDefaultFontSize() " + "deprecated, use setDefaultFont() instead");
        };
    
        RiText.setDefaultAlignment = function(align) {
    
            RiText.defaults.alignment = align;
        };
    
        RiText.createWords = function(txt, x, y, w, h, lead, pfont) {
    
            return RiText.createRiTexts(txt, x, y, w, h, lead, pfont, RiText.prototype.splitWords);
        };
    
        RiText.createLetters = function(txt, x, y, w, h, lead, pfont) {
    
            return RiText.createRiTexts(txt, x, y, w, h, lead, pfont, RiText.prototype.splitLetters);
        };
    
        RiText.createRiTexts = function(txt, x, y, w, h, lead, pfont, splitFun) // private 
        {
    
            if (isNull(txt) || txt.length == 0) return [];
    
            var theFont = assign(theFont, RiText.defaults.font);
            var rlines = RiText.createLines(txt, x, y, w, h, lead, pfont);
            if (isNull(rlines)) return [];
    
            var result = [];
            for ( var i = 0; i < rlines.length; i++) {
                var rts = splitFun.call(rlines[i]);
                for ( var j = 0; j < rts.length; j++)
                    result.push(rts[j].textFont(theFont)); // add the words
                rlines[i].dispose();
            }
    
            return result;
        };
    
        RiText.drawAll = function() {
    
            //for (var i = 0; i < RiTa.riTextInstances.length; i++)
            //RiTa.riTextInstances[i].draw();
            for ( var i = 0; i < RiText.instances.length; i++)
                RiText.instances[i].draw();
        };
    
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
            return this;
        };
    
        RiText.prototype = {
    
        toString : function() {
    
            return "['" + this.getText() + "']";
        },
    
        init : function(text, xPos, yPos, font) {
    
            //RiText.instances = [];
    
            this.color = { r : RiText.defaults.color.r, g : RiText.defaults.color.g, b : RiText.defaults.color.b, a : RiText.defaults.color.a };
    
            this.boundingBoxVisible = RiText.defaults.boundingBoxVisible;
            this.motionType = RiText.defaults.motionType;
            this.alignment = RiText.defaults.alignment;
            this.textFont(!isNull(font) ? font : RiText.defaults.font);
    
            this.behaviors = [];
            this.scaleX = RiText.defaults.scaleX;
            this.scaleY = RiText.defaults.scaleY;
    
            // this.hidden = false;
            // this.fontSize = RiText.defaults.fontSize;
            //this.riString = new RiString();
            //this.rotateX = RiText.defaults.rotateX;
            //this.rotateY = RiText.defaults.rotateY;
            //this.rotateZ = RiText.defaults.rotateZ;
            //this.scaleZ = RiText.defaults.scaleZ;
    
            //RiTa.riTextInstances.push(this);
            RiText.instances.push(this);
    
            if (typeof (text) == 'string') {
                this.riString = new RiString(text);
            }
            else if (typeof (text) == 'object' && typeof (text.text == 'undefined')) {
                this.riString = new RiString(text.text);
                applicate(this, text);
            }
            else
                throw new Error("RiText expects 'string' or RiString, got: " + text);
    
            this.x = (assign(xPos, (width / 2) - this.textWidth() / 2.0));
            this.y = (assign(yPos, height / 2));
    
            return this;
        },
    
        // these functions delegate to processing.js (!@# only functions
        // in the lib that do) =====
        draw : function() {
    
            pushStyle();
    
            // Orient the pjs renderer (D: what if we are in 3D??)
            pushMatrix();
    
            // DCH: need to add scale? FIXED 8/16
    
            translate(this.x, this.y);
            // rotate(this.rotateZ);  
            scale(this.scaleX, this.scaleY);
    
            // Set color
            fill(this.color.r, this.color.g, this.color.b, this.color.a);
    
            // Set font params
            textAlign(this.alignment);
            textFont(this.font, this.fontSize);
    
            // Draw text
            text(this.riString.getText(), 0, 0);
    
            // And the bounding box
            if (this.boundingBoxVisible) {
                noFill();
                stroke(this.color.r, this.color.g, this.color.b, this.color.a);
                rect(0, -this.textHeight() + textDescent(), this.textWidth(), this.textHeight());
            }
    
            popMatrix();
            popStyle();
    
            return this;
        },
    
        dispose : function() { // BROKEN?
    
            var ok = removeFromArray(RiText.instances, this);
            if (!ok) console.trace("FAIL");
            delete (this.riString);
            delete (this);
            return ok;
        },
    
        removeCharAt : function(idx) {
    
            this.riString.removeCharAt(idx);
        },
    
        equals : function(check) {
    
            if (isNull(check)) return false;
            return (this.id === check.id && this.getText() === check.getText());
        },
    
        textWidth : function() {
    
            var result = -1;
            pushStyle();
            textFont(this.font, this.fontSize);
            result = textWidth(this.getText());
            popStyle();
            return result;
        },
    
        // remove? duplicate of p5
        textAscent : function() {
    
            var result = -1;
            pushStyle();
            textFont(this.font, this.fontSize);
            result = textAscent();
            popStyle();
            return result;
        },
    
        // remove? duplicate of p5
        textDescent : function() {
    
            var result = -1;
            pushStyle();
            textFont(this.font, this.fontSize);
            result = textDescent();
            popStyle();
            return result;
        },
    
    
        textHeight : function() {
    
            var result = -1;
            pushStyle();
            textFont(this.font, this.fontSize);
            result = textDescent() + textAscent();
            popStyle();
            return result;
        },
    
        // end processing.js delegates
    
        // ===========================================================
    
        getX : function() {
    
            return this.x;
        },
    
        getY : function() {
    
            return this.y;
        },
    
        getFont : function() {
    
            return this.font;
        },
    
        getFontSize : function() {
    
            return this.fontSize;
        },
    
        splitWords : function() {
    
            var l = [];
            var txt = this.getText();
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
            for (t = 0; t < len; t++) {
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
    
        getText : function() {
    
            return this.riString.getText();
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
    
            this.fadeColor(null, null, null, 255, sec, FADE_IN);
            return this;
        },
    
        fadeOut : function(sec) {
    
            this.fadeColor(null, null, null, 0, sec, FADE_OUT);
            return this;
        },
    
        // !@# TODO: add delay attributes to the two functions below
        fadeColor : function(r, g, b, a, sec, type/* , delay */) {
    
            var fxType = type || FADE_COLOR; // ms // !@#
    
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
    
            pushStyle();
            textFont(this.font, this.fontSize);
    
            if (charIdx > 0) {
    
                var txt = this.getText();
    
                var len = txt.length;
                if (charIdx > len) // -1?
                charIdx = len;
    
                var sub = txt.substring(0, charIdx);
                theX = this.x + textWidth(sub);
            }
    
            popStyle();
    
            return theX;
        },
    
        getWordOffset : function(words, wordIdx) {
    
            //console.log("getWordOffset("+words+","+wordIdx+")");
    
            if (wordIdx < 0 || wordIdx >= words.length)
                throw new Error("Bad wordIdx=" + wordIdx + " for " + words);
    
            pushStyle();
            textFont(this.font, this.fontSize);
    
            var xPos = this.x;
    
            if (wordIdx > 0) {
                var pre = words.slice(0, wordIdx);
                var preStr = '';
                for ( var i = 0; i < pre.length; i++) {
                    preStr += pre[i] + ' ';
                    //if (addSpacesBetween)preStr += ' ';
                }
    
                var tw = textWidth(preStr);
    
                //console.log("x="+xPos+" pre='"+preStr+"' tw=" + tw); 
    
                switch (this.alignment) {
                    case LEFT:
                        xPos = this.x + tw;
                        break;
                    case RIGHT:
                        xPos = this.x - tw;
                        break;
                    default: // fix this
                        throw new Error("getWordOffset() only supported for "
                            + "LEFT & RIGHT alignments, found: " + this.alignment);
                }
            }
            popStyle();
    
            return xPos;
        }
    
        };
    
    
        // //////////////
        // RiString //
        // //////////////
    
        RiString = function RiString(s) {
    
            this.text = (typeof (s) === 'string') ? s : '';
        };
    
        RiString.prototype = {
    
        getText : function() {
    
            return this.text;
        },
    
        setText : function(text) {
    
            this.text = text;
            return this;
        },
    
        getStresses : function() {
    
            var a = this.getPlaintext().split(" "), result = [];
    
            for ( var i = 0, l = a.length; i < l; i++) {
                result.push(RiLexicon.getStresses(a[i]));
            }
            return result;
        },
    
        getPhonemes : function() {
    
            var a = this.getPlaintext().split(" "), result = [];
    
            for ( var i = 0, l = a.length; i < l; i++) {
                result.push(RiLexicon.getPhonemes(a[i]));
            }
            return result;
        },
    
        getSyllables : function() {
    
            var a = this.getPlaintext().split(" "), result = [];
    
            for ( var i = 0, l = a.length; i < l; i++) {
                result.push(RiLexicon.getSyllables(a[i]));
            }
            return result;
        },
    
        getPos : function() {
    
            return this.getPosList().join(" ");
        },
    
        getPosList : function() {
    
            var words = RiTa.tokenize(this.getPlaintext());
            var i, tag = RiPosTagger.tag(words);
            for (i = 0, l = tag.length; i < l; i++) {
                if (!okStr(tag[i])) throw new Error("RiString: can't parse pos for:" + words[i]);
            }
            return tag;
        },
    
        getPlaintext : function() {
    
            var text = this.getText(); // why are we doing this?
            return trim(text.replace(/[\.,-\/#!?$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,100}/g, " "));
        },
    
        removeCharAt : function(ind) {
    
            var text = this.getText();
            var string_one = text.slice(0, ind);
            var string_two = text.slice(ind + 1, this.length);
            this.text = string_one.concat(string_two);
            return this;
        }
    
        };
    
        // ///////////////
        // RiLexicon //
        // ///////////////
    
        RiLexicon = {
    
        DATA_DELIM : '|', STRESSED : '1', UNSTRESSED : '0', PHONEME_BOUNDARY : '-', WORD_BOUNDARY : " ", SYLLABLE_BOUNDARY : "/", SENTENCE_BOUNDARY : "|", VOWELS : "aeiou", // moved constants here as test...
    
        isVowel : function(p) {
    
            if (!strOk(p)) return false; // what about 'y'?
            return RiLexicon.VOWELS.indexOf(p.substring(0, 1)) != -1;
        },
    
        isConsonant : function(p) {
    
            if (!strOk(p)) return false;
            return !this.isVowel(p);
        },
    
        //isSilence : function(p) { // remove, no tts
        //  return (p === "pau");
        //},
    
        contains : function(word) {
    
            if (!strOk(word)) return false;
    
            return (!isNull(RiTa_DICTIONARY[word]));
        },
    
        isRhyme : function(word1, word2) {
    
            if (!strOk(word1) || !strOk(word2)) return false;
            if (equalsIgnoreCase(word1, word2)) return false;
            var p1 = this.lastStressedPhoneToEnd(word1);
            var p2 = this.lastStressedPhoneToEnd(word2);
            return (strOk(p1) && strOk(p2) && p1 === p2);
        },
    
        getRhymes : function(word) {
    
            this.buildWordlist();
    
            if (this.contains(word)) {
    
                var p = this.lastStressedPhoneToEnd(word);
                var entry, entryPhones, results = [];
    
                for (entry in RiTa_DICTIONARY) {
                    if (entry === word) continue;
                    entryPhones = this.getRawPhones(entry);
    
                    if (strOk(entryPhones) && endsWith(entryPhones, p)) {
                        results.push(entry);
                    }
                }
                return (results.length > 0) ? results : null; // return null?
            }
            return null; // return null?
        },
    
        getAlliterations : function(word) {
    
            if (this.contains(word)) {
    
                var c2, entry, results = [];
                var c1 = this.firstConsonant(this.firstStressedSyllable(word));
    
                for (entry in RiTa_DICTIONARY) {
                    c2 = this.firstConsonant(this.firstStressedSyllable(entry));
                    if (c2 !== null && (c1 === c2)) {
                        results.push(entry);
                    }
                }
                return (results.length > 0) ? results : null; // return null?
            }
            return null; // return null?
        },
    
        isAlliteration : function(word1, word2) {
    
            if (!strOk(word1) || !strOk(word2)) return false;
    
            if (equalsIgnoreCase(word1, word2)) return true;
    
            var c1 = this.firstConsonant(this.firstStressedSyllable(word1));
            var c2 = this.firstConsonant(this.firstStressedSyllable(word2));
    
            return (strOk(c1) && strOk(c2) && c1 === c2);
        },
    
        firstStressedSyllable : function(word) {
    
            var raw = this.getRawPhones(word);
            var idx = -1, c, firstToEnd, result;
    
            if (!strOk(raw)) return null; // return null?
    
            idx = raw.indexOf(RiLexicon.STRESSED);
    
            if (idx < 0) return null; // no stresses...  return null?
    
            c = raw.charAt(--idx);
    
            while (c != ' ') {
                if (--idx < 0) {
                    // single-stressed syllable
                    idx = 0;
                    break;
                }
                c = raw.charAt(idx);
            }
            firstToEnd = idx === 0 ? raw : trim(raw.substring(idx));
            idx = firstToEnd.indexOf(' ');
    
            return idx < 0 ? firstToEnd : firstToEnd.substring(0, idx);
        },
    
        getSyllables : function(word) {
    
            var phones, i;
            var raw = this.getRawPhones(word);
    
            if (!strOk(raw)) return null; // return null?
    
            raw = raw.replace(/1/g, "");
            phones = raw.split(" ");
    
            return phones.join(":");
        },
    
        getPhonemes : function(word) {
    
            var phones, i;
            var raw = this.getRawPhones(word);
    
    
            if (!strOk(raw)) return null; // return null?
    
            raw = raw.replace(/-/g, " ").replace(/1/g, "");
            phones = raw.split(" ");
    
            return phones.join(":");
        },
    
        getStresses : function(word) {
    
            var stresses = [], phones, i;
            var raw = this.getRawPhones(word);
    
    
            if (!strOk(raw)) return null; // return null?
    
            phones = raw.split(" ");
            for (i = 0; i < phones.length; i++)
                stresses[i] = (phones[i].indexOf(RiLexicon.STRESSED) > -1) ? "1" : "0";
    
            return stresses.join(":");
        },
    
        lookupRaw : function(word) {
    
            if (!strOk(word)) return null; // return null?
    
            word = word.toLowerCase();
    
            this.buildWordlist();
    
            if (!isNull(RiTa_DICTIONARY[word]))
                return RiTa_DICTIONARY[word];
            else {
                console.log("[WARN] No lexicon entry for '" + word + "'");
                return null; // return null?
            }
        },
    
        getRawPhones : function(word) {
    
            var data = this.lookupRaw(word);
            return (!isNull(data)) ? data[0] : null;
        },
    
        getPos : function(word) {
    
            var data = this.lookupRaw(word);
            return (isNull(data)) ? null : data[1]; // return null?
        },
    
        getPosArr : function(word) {
    
            var pl = this.getPos(word);
            if (!strOk(pl)) return null; // return null?
            return pl.split(" ");
        },
    
        firstConsonant : function(rawPhones) {
    
            if (!strOk(rawPhones)) return null; // return null?
    
            var phones = rawPhones.split(RiLexicon.PHONEME_BOUNDARY);
            //var phones = rawPhones.split(PHONEME_BOUNDARY);
            if (!isNull(phones)) {
                for (j = 0; j < phones.length; j++) {
                    if (this.isConsonant(phones[j])) return phones[j];
                }
            }
            return null; // return null?
        },
    
        lastStressedPhoneToEnd : function(word) {
    
            if (!strOk(word)) return null; // return null?
    
            var idx, c, result;
            var raw = this.getRawPhones(word);
    
            if (!strOk(raw)) return null; // return null?
    
            idx = raw.lastIndexOf(RiLexicon.STRESSED);
            if (idx < 0) return null; // return null?
            c = raw.charAt(--idx);
            while (c != '-' && c != ' ') {
                if (--idx < 0) { return raw; // single-stressed syllable
                }
                c = raw.charAt(idx);
            }
            result = raw.substring(idx + 1);
            return result;
        },
    
        getRandomWord : function(pos) {
    
            /*
             * var word, found = false, t; if(pos) { pos = trim(pos.toLowerCase()); for(t in
             * RiLexicon.TAGS){ if (t[0].toLowerCase === pos) { found = true; } } if(!found) { throw
             * "RiTa RiLexicon.getRandomWord: POS '" + pos + "' not valid!"; } } if(pos)
             */
            this.buildWordlist();
            return RiLexicon.wordlist[Math.floor(Math.random() * RiLexicon.wordlist.length)];
        },
    
        buildWordlist : function() {
    
            if (!RiLexicon.wordlist) {
    
                if ((typeof RiTa_DICTIONARY != 'undefined') && RiTa_DICTIONARY) {
                    RiLexicon.wordlist = [];
                    for ( var w in RiTa_DICTIONARY)
                        RiLexicon.wordlist.push(w);
                    console.log("[RiTa] Loaded lexicon(#" + RiLexicon.wordlist.length + ")...");
                }
                else {
                    throw "[RiTa] No dictionary found!";
                }
            }
    
        } };
    
        // /////////////////
        // RiPosTagger //
        // /////////////////
    
        RiPosTagger = {
    
        // !@# these constants are not kept in RC due to scope problems
        // created by internal "this" references
        UNKNOWN : [ "???", "UNKNOWN" ], N : [ "N", "NOUN_KEY" ], V : [ "V", "VERB_KEY" ], R : [ "R", "ADVERB_KEY" ], A : [ "A", "ADJECTIVE_KEY" ], CC : [ "CC", "Coordinating conjunction" ], CD : [ "CD", "Cardinal number" ], DT : [ "DT", "Determiner" ], EX : [ "EX", "Existential there" ], FW : [ "FW", "Foreign word" ], IN : [ "IN", "Preposition or subordinating conjunction" ], JJ : [ "JJ", "Adjective" ], JJR : [ "JJR", "Adjective, comparative" ], JJS : [ "JJS", "Adjective, superlative" ], LS : [ "LS", "List item marker" ], MD : [ "MD", "Modal" ], NN : [ "NN", "Noun, singular or mass" ], NNS : [ "NNS", "Noun, plural" ], NNP : [ "NNP", "Proper noun, singular" ], NNPS : [ "NNPS", "Proper noun, plural" ], PDT : [ "PDT", "Predeterminer" ], POS : [ "POS", "Possessive ending" ], PRP : [ "PRP", "Personal pronoun" ], PRP$ : [ "PRP$", "Possessive pronoun (prolog version PRP-S)" ], RB : [ "RB", "Adverb" ], RBR : [ "RBR", "Adverb, comparative" ], RBS : [ "RBS", "Adverb, superlative" ], RP : [ "RP", "Particle" ], SYM : [ "SYM", "Symbol" ], TO : [ "TO", "to" ], UH : [ "UH", "Interjection" ], VB : [ "VB", "Verb, base form" ], VBD : [ "VBD", "Verb, past tense" ], VBG : [ "VBG", "Verb, gerund or present participle" ], VBN : [ "VBN", "Verb, past participle" ], VBP : [ "VBP", "Verb, non-3rd person singular present" ], VBZ : [ "VBZ", "Verb, 3rd person singular present" ], WDT : [ "WDT", "Wh-determiner" ], WP : [ "WP", "Wh-pronoun" ], WP$ : [ "WP$", "Possessive wh-pronoun (prolog version WP-S)" ], WRB : [ "WRB", "Wh-adverb" ],
    
        TAGS : [ this.CC, this.CD, this.DT, this.EX, this.FW, this.IN, this.JJ, this.JJR, this.JJS, this.LS, this.MD, this.NN, this.NNS, this.NNP, this.NNPS, this.PDT, this.POS, this.PRP, this.PRP$, this.RB, this.RBR, this.RBS, this.RP, this.SYM, this.TO, this.UH, this.VB, this.VBD, this.VBG, this.VBN, this.VBP, this.VBZ, this.WDT, this.WP, this.WP$, this.WRB, this.UNKNOWN ], NOUNS : [ this.NN, this.NNS, this.NNP, this.NNPS ], VERBS : [ this.VB, this.VBD, this.VBG, this.VBN, this.VBP, this.VBZ ], ADJ : [ this.JJ, this.JJR, this.JJS ], ADV : [ this.RB, this.RBR, this.RBS, this.RP ],
    
        isVerb : function(tag) {
    
            return inArray(this.VERB, tag);
        },
    
        isNoun : function(tag) {
    
            return inArray(this.NOUN, tag);
        },
    
        isAdverb : function(tag) {
    
            return inArray(this.ADV, tag);
        },
    
        isAdj : function(tag) {
    
            return inArray(this.ADJ, tag);
        },
    
        isTag : function(tag) {
    
            return inArray(this.TAGS, tag);
        },
    
        // Returns an array of parts-of-speech from the Penn tagset each
        // corresponding to one word of input.
        tag : function(words) {
    
            var result = [], choices = [], word, data, size, i;
    
            if (!(words instanceof Array)) { // << !@# test this
                words = [ words ];
                console.log("RiPosTagger: NOT ARRAY");
            }
    
            for (i = 0, l = words.length; i < l; i++) {
                word = words[i];
                data = RiLexicon.getPosArr(word);
    
                if (data == null || data.length == 0) {
                    if (word.length == 1) {
                        result[i] = isDigit(word.charAt(0)) ? "cd" : word;
                    }
                    else {
                        result[i] = "nn";
                    }
                    choices[i] = null;
                }
                else {
                    result[i] = data[0];
                    choices[i] = data;
                }
            }
    
            // Adjust pos according to transformation rules
            return this.applyContext(words, result, choices);
        },
    
        hasTag : function(choices, tag) {
    
            var choiceStr = choices.join();
            return (choiceStr.indexOf(tag) > -1);
        },
    
        // Applies a customized subset of the Brill transformations
        applyContext : function(words, result, choices) {
    
            // Shortcuts for brevity/readability
            var sW = startsWith, eW = endsWith, PRINT = PRINT_CUSTOM_TAGS, firstLetter, i;
    
            // Apply transformations
            for (i = 0, l = words.length; i < l; i++) {
    
                firstLetter = words[i].charAt(0);
    
                // transform 1: DT, {VBD | VBP | VB} --> DT, NN
                if (i > 0 && (result[i - 1] == "dt")) {
                    if (sW(result[i], "vb")) {
                        if (PRINT) {
                            console.log("BrillPosTagger: changing verb to noun: " + words[i]);
                        }
                        result[i] = "nn";
                    }
    
                    // transform 1: DT, {RB | RBR | RBS} --> DT, {JJ |
                    // JJR | JJS}
                    else if (sW(result[i], "rb")) {
                        if (PRINT) {
                            console.log("BrillPosTagger:  custom tagged '" + words[i] + "', "
                                + result[i]);
                        }
                        result[i] = (result[i].length > 2) ? "jj" + result[i].charAt(2) : "jj";
                        if (PRINT) {
                            console.log(" -> " + result[i]);
                        }
                    }
                }
    
                // transform 2: convert a noun to a number (cd) if it is
                // all digits and/or a decimal "."
                if (sW(result[i], "n") && choices[i] == null) {
                    if (isNum(words[i])) {
                        result[i] = "cd";
                    } // mods: dch (add choice check above) <---- ? >
                }
    
                // transform 3: convert a noun to a past participle if
                // words[i] ends with "ed"
                if (sW(result[i], "n") && eW(words[i], "ed")) {
                    result[i] = "vbn";
                }
    
                // transform 4: convert any type to adverb if it ends in
                // "ly";
                if (eW(words[i], "ly")) {
                    result[i] = "rb";
                }
    
                // transform 5: convert a common noun (NN or NNS) to a
                // adjective if it ends with "al"
                if (sW(result[i], "nn") && eW(words[i], "al")) {
                    result[i] = "jj";
                }
    
                // transform 6: convert a noun to a verb if the
                // preceeding word is "would"
                if (i > 0 && sW(result[i], "nn") && equalsIgnoreCase(words[i - 1], "would")) {
                    result[i] = "vb";
                }
    
                // transform 7: if a word has been categorized as a
                // common noun and it ends
                // with "s", then set its type to plural common noun
                // (NNS)
                if ((result[i] == "nn") && eW(words[i], "s")) {
                    result[i] = "nns";
                }
    
                // transform 8: convert a common noun to a present
                // participle verb (i.e., a gerund)
                if (sW(result[i], "nn") && eW(words[i], "ing")) {
                    // fix here -- add check on choices for any verb: eg
                    // 'morning'
                    if (this.hasTag(choices[i], "vb")) {
                        result[i] = "vbg";
                    }
                    else if (PRINT) {
                        console.log("[INFO] um tagged '" + words[i] + "' as " + result[i]);
                    }
                }
    
                // transform 9(dch): convert common nouns to proper
                // nouns when they start w' a capital and are not a
                // sentence start
                if (i > 0 && sW(result[i], "nn") && words[i].length > 1
                    && (firstLetter == firstLetter.toUpperCase())) {
                    result[i] = eW(result[i], "s") ? "nnps" : "nnp";
                }
    
                // transform 10(dch): convert plural nouns (which are
                // also 3sg-verbs) to 3sg-verbs when followed by adverb
                // (jumps, dances)
                if (i < result.length - 1 && result[i] == "nns" && sW(result[i + 1], "rb")
                    && this.hasTag(choices[i], "vbz")) {
                    result[i] = "vbz";
                }
            }
            return result;
        }
    
        };// end RiPosTagger
    
        // Handles verb conjugation based on tense, person, number
        // for simple, passive, progressive, and perfect forms.
        // An example:
        // RiConjugator rc = new RiConjugator(this);
        // rc.setNumber("plural");
        // rc.setPerson("2nd");
        // rc.setTense("past");
        // rc.setPassive(true);
        // rc.setPerfect(true);
        // rc.setProgressive(false);
        // String c = rc.conjugate("announce");
    
        // Note: this implementation is based closely on rules found in the
        // MorphG package,
        // further described here:<p>
        // Minnen, G., Carroll, J., and Pearce, D. (2001). Applied
        // Morphological Processing of English.
        // Natural Language Engineering 7(3): 207--223.
    
        RiConjugator = function RiConjugator() {
    
            this.perfect = this.progressive = this.passive = this.interrogative = false;
    
            this.tense = PRESENT_TENSE;
            this.person = FIRST_PERSON;
            this.number = SINGULAR;
            this.head = "";
    
            // int form = NORMAL; // other forms?? GERUND, INFINITIVE // !@#
            // this comment from java version - add/handle here?
        };
    
        RiConjugator.prototype = {
    
        // Conjugates the verb based on the current state of the
        // conjugator.
    
        // !@# Removed (did not translate) incomplete/non-working java
        // implementation of modals handling.
        // !@# TODO: add handling of past tense modals.
    
        conjugate : function(verb, number, person, tense) {
    
            var actualModal = null, // Compute modal -- this affects
            // tense
            conjs = [], frontVG = verb, verbForm, s;
    
            if (number) {
                this.setNumber(number);
            }
            if (person) {
                this.setPerson(person);
            }
            if (tense) {
                this.setTense(tense);
            }
    
            if (verb == null || verb.length < 1) { throw new RiTaException(
                "Make sure to set the head verb before calling conjugate()!"); }
    
            if (this.form == INFINITIVE) {
                actualModal = "to";
            }
            if (this.tense == FUTURE_TENSE) {
                actualModal = "will";
            }
    
            if (this.passive) {
                conjs.push(this.getPastParticiple(frontVG));
                frontVG = "be"; // Conjugate
            }
    
            if (this.progressive) {
                conjs.push(this.getPresentParticiple(frontVG));
                frontVG = "be"; // Conjugate
            }
    
            if (this.perfect) {
                conjs.push(this.getPastParticiple(frontVG));
                frontVG = "have";
            }
    
            if (actualModal) {
                conjs.push(frontVG);
                frontVG = null;
            }
    
            // Now inflect frontVG (if it exists) and push it on restVG
            if (frontVG) {
                if (this.form == GERUND) {// gerund - use ING form
                    // !@# not yet
                    // implemented!
                    conjs.push(this.getPresentParticiple(frontVG));
                }
    
                // / when could this happen, examples??? // !@# <--
                // comment from original java. ???
            }
            else if (this.interrogative && !(verb == "be") && conjs.length == 0) {
                conjs.push(frontVG);
    
            }
            else {
                verbForm = this.getVerbForm(frontVG, tense, person, number);
                conjs.push(verbForm);
            }
    
            // add modal, and we're done
            if (actualModal) {
                conjs.push(actualModal);
            }
    
            s = trim(conjs.join());
    
            // !@# test this
            if (endsWith(s, "peted")) { throw (this.toString()); }
            return s;
        },
    
        checkRules : function(ruleSet, verb) {
    
            var result = null, defaultRule = ruleSet.defaultRule || null, rules = ruleSet.rules, i;
    
            if (inArray(MODALS, verb)) { return verb; }
    
            i = rules.length;
            while (i--) {
                if (rules[i].applies(verb)) { return rules[i].fire(verb); }
            }
    
            if (ruleSet.doubling || inArray(VERB_CONS_DOUBLING, verb)) {
                verb = this.doubleFinalConsonant(verb);
            }
            return defaultRule.fire(verb);
        },
    
        doubleFinalConsonant : function(word) {
    
            var letter = word.charAt(word.length - 1);
            return word + letter;
        },
    
        getPast : function(verb, pers, numb) {
    
            if (verb.toLowerCase() == "be") {
                switch (numb) {
                    case SINGULAR:
                        switch (pers) {
                            case FIRST_PERSON:
                                break;
                            case THIRD_PERSON:
                                return "was";
                            case SECOND_PERSON:
                                return "were";
                        }
                        break;
                    case PLURAL:
                        return "were";
                }
            }
            return this.checkRules(PAST_TENSE_RULESET, v);
        },
    
        getPastParticiple : function(verb) {
    
            return this.checkRules(PAST_PARTICIPLE_RULESET, verb);
        },
    
        getPresent : function(verb, person, number) {
    
            // Defaults if unset
            if (typeof (person) === 'undefined') {
                person = this.person;
            }
            if (typeof (number) === 'undefined') {
                number = this.number;
            }
    
            if ((person == THIRD_PERSON) && (number == SINGULAR)) {
                return this.checkRules(PRESENT_TENSE_RULESET, verb);
    
            }
            else if (verb == "be") {
                if (number == SINGULAR) {
                    switch (person) {
                        case FIRST_PERSON:
                            return "am";
                            break;
                        case SECOND_PERSON:
                            return "are";
                            break;
                        case THIRD_PERSON:
                            return "is";
                            break;
                    }
                }
                else {
                    return "are";
                }
            }
            return verb;
        },
    
        getPresentParticiple : function(verb) {
    
            return this.checkRules(PRESENT_PARTICIPLE_RULESET, verb);
        },
    
        getVerbForm : function(verb, tense, person, number) {
    
            switch (tense) {
                case PRESENT_TENSE:
                    return getPresent(verb, person, number);
                case PAST_TENSE:
                    return getPast(verb, person, number);
                default:
                    return verb;
            }
        },
    
        // Returns a String representing the current person from one of
        // (first, second, third)
        getPerson : function() {
    
            return CONJUGATION_NAMES[RC[this.person]];
        },
    
        // Returns a String representing the current number from one of
        // (singular, plural)
        getNumber : function() {
    
            return CONJUGATION_NAMES[RC[this.number]];
        },
    
        // Returns a String representing the current tense from one of
        // (past, present, future)
        getTense : function() {
    
            return CONJUGATION_NAMES[RC[this.tense]];
        },
    
        // Returns the current verb
        getVerb : function() {
    
            return this.head;
        },
    
        // Returns whether the conjugation will use passive tense
        isPassive : function() {
    
            return this.passive;
        },
        // Returns whether the conjugation will use perfect tense
        isPerfect : function() {
    
            return this.perfect;
        },
        // Returns whether the conjugation will use progressive tense
        isProgressive : function() {
    
            return this.progressive;
        },
    
        // Sets the person for the conjugation, from one of the
        // constants: [FIRST_PERSON, SECOND_PERSON, THIRD_PERSON]
        setPerson : function(personConstant) {
    
            this.person = RC[personConstant];
        },
    
        // Sets the number for the conjugation, from one of the
        // constants: [SINGULAR, PLURAL]
        setNumber : function(numberConstant) {
    
            this.number = RC[numberConstant];
        },
    
        // Sets the tense for the conjugation, from one of the
        // constants: [PAST_TENSE, PRESENT_TENSE, FUTURE_TENSE]
        setTense : function(tenseConstant) {
    
            this.tense = RC[tenseConstant];
        },
    
        // Sets the verb to be conjugated
        setVerb : function(verb) {
    
            var v = this.head = verb.toLowerCase();
            if (v === "am" || v === "are" || v === "is" || v === "was" || v === "were") {
                this.head = "be";
            }
        },
    
        // Sets whether the conjugation should use passive tense
        setPassive : function(bool) {
    
            this.passive = bool;
        },
    
        // Sets whether the conjugation should use perfect tense
        setPerfect : function(bool) {
    
            this.perfect = bool;
        },
    
        // Sets whether the conjugation should use progressive tense
        setProgressive : function(bool) {
    
            this.progressive = bool;
        },
    
        // Creates a readable representation of data for logging
        toString : function() {
    
            return "  ---------------------\n" + "  Passive = " + this.isPassive() + "\n"
                + "  Perfect = " + this.isPerfect() + "\n" + "  Progressive = " + this.isProgressive()
                + "\n" + "  ---------------------\n" + "  Number = " + this.getNumber() + "\n"
                + "  Person = " + this.getPerson() + "\n" + "  Tense = " + this.getTense() + "\n"
                + "  ---------------------\n";
        },
    
        // Returns all possible conjugations of the specified verb
        // (contains duplicates)
        conjugateAll : function(verb) {
    
            var results = [], i, j, k, l, m, n;
            this.setVerb(verb);
    
            for (i = 0; i < TENSES.length; i++) {
                this.setTense(TENSES[i]);
                for (j = 0; j < NUMBERS.length; j++) {
                    this.setNumber(NUMBERS[j]);
                    for (k = 0; k < PERSONS.length; k++) {
                        this.setPerson(PERSONS[k]);
                        for (l = 0; l < 2; l++) {
                            this.setPassive(l == 0 ? true : false);
                            for (m = 0; m < 2; m++) {
                                this.setProgressive(m == 0 ? true : false);
                                for (n = 0; n < 2; n++) {
                                    this.setPerfect(n == 0 ? true : false);
                                    results.push(this.conjugate(verb));
                                }
                            }
                        }
                    }
                }
            }
            // console.log("all="+results.length);
            return results;
        }
    
        };// end RiConjugator
    
        // =====================================================================================================================
        // EVENTS AND BEHAVIORS
        // =====================================================================================================================
    
        // ///////////////
        // RiTaEvent //
        // ///////////////
    
        RiTaEvent = function RiTaEvent(source, type, data) {
    
            this.id = -1;
            this.tag = "";
            this.type = type;
            this.source = source; // RiText
            this.data = (typeof (data) === 'object') ? data : null;
    
            if (typeof (data) === 'object') {
                this.tag = data.toString();
                if (data instanceof TextBehavior) {
                    this.tag = data.getName();
                    this.id = data.getId();
                }
            }
    
            // Set unique ID
            if (this.id < 0) {
                this.id = RiTa.nextId();
            }
        };
    
        RiTaEvent.prototype = {
    
        // Creates a readable representation of data for logging
        toString : function() {
    
            return "RiTaEvent[type=" + this.type + ", tag=" + this.tag + " data=" + this.getData()
                + ", source=" + this.source + "]";
        },
    
        // Returns one of the event types specified in the RiConstants
        // [RC] interface, e.g., BEHAVIOR_COMPLETED, or
        // SPEECH_COMPLETED.
        // To test, use the following syntax: if (re.getType() ==
        // BEHAVIOR_COMPLETED)
        getType : function() {
    
            return this.type;
        },
    
        // Returns RiText object
        getSource : function() {
    
            return this.source;
        },
    
        // Returns auxillary data that varies based on the different
        // event types:
        // - SPEECH_COMPLETED: a string with the last spoken text.
        // - TEXT_ENTERED: a string with the entered text.
        // - BEHAVIOR_COMPLETED or TIMER_COMPLETED: the TextBehavior
        // object that has just completed.
        getData : function() {
    
            return this.data;
        },
    
        // !@# handling of event names is incomplete. Need to determine
        // where/how names are (to be) set.
    
        // Return the user-specified name for this event, or for the
        // associated TextBehavior. For example, if
        // a name has been assigned to a RiTa timer which generated this
        // event, it will be accessible here.
        getName : function() {
    
            return tag;
        },
    
        getId : function() {
    
            return id;
        }
    
        };
    
        // ////////////////
        // Interpolator //
        // ////////////////
    
        // Handles math and logic for interpolation. Never used directly by user.
    
        Interpolator = function Interpolator(startValue, targetValue, startOffsetInMs, durationInMs,
            motionType) {
    
            this.reset(startValue, targetValue, startOffsetInMs, durationInMs, motionType);
        };
    
        Interpolator.prototype = {
    
        // Penner's easing equations
        equations : { linear : function(t, b, c, d) {
    
            return t * (c / d) + b;
        }, easeInQuad : function(t, b, c, d) {
    
            return c * (t /= d) * t + b;
        }, easeOutQuad : function(t, b, c, d) {
    
            return -c * (t /= d) * (t - 2) + b;
        }, easeInOutQuad : function(t, b, c, d) {
    
            if ((t /= d / 2) < 1) { return c / 2 * t * t + b; }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }, easeInCubic : function(t, b, c, d) {
    
            return c * (Math.pow(t / d, 3) + b);
        }, easeOutCubic : function(t, b, c, d) {
    
            return c * ((Math.pow(t / d - 1, 3) + 1) + b);
        }, easeInOutCubic : function(t, b, c, d) {
    
            if ((t /= d / 2) < 1) { return (c / 2 * Math.pow(t, 3) + b); }
            return (c / 2 * (Math.pow(t - 2, 3) + 2) + b);
        }, easeInQuart : function(t, b, c, d) {
    
            return (c * Math.pow(t / d, 4) + b);
        }, easeOutQuart : function(t, b, c, d) {
    
            return (-c * (Math.pow(t / d - 1, 4) - 1) + b);
        }, easeInOutQuart : function(t, b, c, d) {
    
            if ((t /= d / 2) < 1) { return (c / 2 * Math.pow(t, 4) + b); }
            return (-c / 2 * (Math.pow(t - 2, 4) - 2) + b);
        }, easeInSine : function(t, b, c, d) {
    
            return (c * (1 - Math.cos(t / d * (Math.PI / 2))) + b);
        }, easeOutSine : function(t, b, c, d) {
    
            return (c * Math.sin(t / d * (Math.PI / 2)) + b);
        }, easeInOutSine : function(t, b, c, d) {
    
            return (c / 2 * (1 - Math.cos(Math.PI * t / d)) + b);
        }, easeInCirc : function(t, b, c, d) {
    
            return (-c * (Math.sqrt(1 - (t /= d) * t) - 1) + b); // hmm??
        }, easeOutCirc : function(t, b, c, d) {
    
            return (c * Math.sqrt(1 - (t - d) * (t - d) / (d * d)) + b);
        }, easeInOutCirc : function(t, b, c, d) {
    
            if (t < d / 2) { return (-c / 2 * (Math.sqrt(1 - 4 * t * t / (d * d)) - 1) + b); }
            return (c / 2 * (Math.sqrt(1 - 4 * (t - d) * (t - d) / (d * d)) + 1) + b);
        }, easeInExpo : function(t, b, c, d) {
    
            var flip = 1;
            if (c < 0) {
                flip *= -1;
                c *= -1;
            }
            return (flip * (Math.exp(Math.log(c) / d * t)) + b);
        }, easeOutExpo : function(t, b, c, d) {
    
            var flip = 1;
            if (c < 0) {
                flip *= -1;
                c *= -1;
            }
            return (flip * (-Math.exp(-Math.log(c) / d * (t - d)) + c + 1) + b);
        }, easeInOutExpo : function(t, b, c, d) {
    
            var flip = 1;
            if (c < 0) {
                flip *= -1;
                c *= -1;
            }
            if (t < d / 2) { return (flip * (Math.exp(Math.log(c / 2) / (d / 2) * t)) + b); }
            return (flip * (-Math.exp(-2 * Math.log(c / 2) / d * (t - d)) + c + 1) + b);
        } },
    
        reset : function(startVal, targetVal, startOffsetInMs, durationInMs, motionType) {
    
            this.running = true;
            this.completed = false;
            this.startValue = this.currentValue = startVal;
            this.targetValue = targetVal;
            this.change = targetVal - startVal;
            this.duration = durationInMs;
            this.startTime = Date.now() + startOffsetInMs;
            this.equation = this.getEquation(motionType);
            //console.log("this.equation("+motionType+") ="+this.equation);
        },
    
        getEquation : function(motionType) {
    
            switch (motionType) { // ugly, use an array instead?
                case LINEAR:
                    return this.equations.linear;
                case EASE_IN_OUT:
                    return this.equations.easeInOutQuad;
                case EASE_IN:
                    return this.equations.easeInQuad;
                case EASE_OUT:
                    return this.equations.easeOutQuad;
                case EASE_IN_OUT_CUBIC:
                    return this.equations.easeInOutCubic;
                case EASE_IN_CUBIC:
                    return this.equations.easeInCubic;
                case EASE_OUT_CUBIC:
                    return this.equations.easeOutCubic;
                case EASE_IN_OUT_QUARTIC:
                    return this.equations.easeInOutQuart;
                case EASE_IN_QUARTIC:
                    return this.equations.easeInQuart;
                case EASE_OUT_QUARTIC:
                    return this.equations.easeOutQuart;
                case EASE_IN_OUT_EXPO:
                    return this.equations.easeInOutExpo;
                case EASE_IN_EXPO:
                    return this.equations.easeInExpo;
                case EASE_OUT_EXPO:
                    return this.equations.easeOutExpo;
                case EASE_IN_OUT_SINE:
                    return this.equations.easeInOutSine;
                case EASE_IN_SINE:
                    return this.equations.easeInSine;
                case EASE_OUT_SINE:
                    return this.equations.easeOutSine;
                default:
                    throw new Error("Unknown MotionType: " + motionType);
            }
        },
    
        update : function() {
    
            var msElapsed = Date.now();
            var a = msElapsed - this.startTime;
            var b = this.startValue;
            var c = this.change;
            var d = this.duration;
    
            // Have we finished or not started yet?
            if (this.completed || msElapsed < this.startTime) { return this.running = false; }
    
            // Or have we run out of time?
            if (msElapsed > (this.startTime + this.duration)) {
                this.finish();
                return this.running = false;
            }
    
            // Ok, we are actually updating
            this.running = true;
    
            // Check if we've started
            if (msElapsed >= this.startTime) {
                this.currentValue = this.equation(a, b, c, d);
            }
    
            return this.running;
        },
    
        stop : function() {
    
            this.running = false;
        },
    
        finish : function() {
    
            this.currentValue = this.targetValue;
            this.completed = true;
        },
    
        isCompleted : function() {
    
            return this.completed;
        },
    
        getValue : function() {
    
            return this.currentValue;
        },
    
        getStartValue : function() {
    
            return this.startValue;
        },
    
        getTarget : function() {
    
            return this.targetValue;
        }
    
        }; // end Interpolator
    
    
        // DCH: class should be removed and replaced with Array.foreach() calls?
    
        // /////////////////
        // InterpolatorArray // delegates to Interpolator 
        // /////////////////
    
        // Creates & controls an arbitrary number of interpolators
        // with shared duration & motionType
        // 'dataArray' array format: [ [initialValue, targetValue],  [initialValue, targetValue], ... ]
    
        InterpolatorArray = function InterpolatorArray(dataArray, startOffsetInMs, durationInMs,
            motionType) {
    
            this.initValues = dataArray;
            //this.initDuration = durationInMs;
            this.interpolators = [];
            this.interpolatorCount = dataArray.length;
            this.motionType = motionType || RiText.defaults.motionType;
    
            var i = this.interpolatorCount;
            while (i--) {
                var nt = new Interpolator(dataArray[i][0], dataArray[i][1], startOffsetInMs,
                    durationInMs, this.motionType);
                this.interpolators.push(nt);
            }
        };
    
        InterpolatorArray.prototype = {
    
        // Reset the set of interpolators. If arguments not given (or
        // null), fn defaults to instantiation values for
        // start values, target values, and duration. If startOffsetMs
        // not given, that defaults to 0: running immediately.
        reset : function(values, startOffsetMs, durationInMs) {
    
            values = values || this.initValues;
            durationInMs = durationInMs;//  || this.initDuration;
            startOffsetMs = startOffsetMs || 0;
    
            checkMinLen(values, this.interpolatorCount);
    
            var i = this.interpolatorCount;
            while (i--) {
                this.interpolators[i].reset(values[i][0], values[i][0], startOffsetMs, durationInMs,
                    this.motionType);
            }
        },
    
        update : function() {
    
            var running = true, i = this.interpolatorCount;
            while (i--) {
                running = (this.interpolators[i].update()) ? running : false;
            }
            return running;
        },
    
        finish : function() {
    
            var i = this.interpolatorCount;
            while (i--) {
                this.interpolators[i].finish();
            }
        },
    
        stop : function() {
    
            var i = this.interpolatorCount;
            while (i--) {
                this.interpolators[i].stop();
            }
        },
    
        // Returns true if ANY of the set of interpolators is completed
        isCompleted : function() {
    
            var complete = true, i = this.interpolatorCount;
            while (i--) {
                complete = (this.interpolators[i].isCompleted());
            }
            return complete;
        },
    
        getValues : function() {
    
            var values = [], i = this.interpolatorCount;
            while (i--) {
                values.push(this.interpolators[i].getValue());
            }
            return values;
        },
    
        getTargets : function() {
    
            var targets = [], i = this.interpolatorCount;
            while (i--) {
                targets.push(this.interpolators[i].getTargetValue());
            }
            return targets;
        },
    
        setMotionType : function(motionType) {
    
            this.motionType = motionType;
        },
    
        getMotionType : function(motionType) {
    
            return this.motionType;
        }
    
        };
    
        // //////////////////
        // TextBehavior //
        // //////////////////
    
        // !@# TODO: rewrite this documentation
        // An abstract superclass for an extensible set of text behaviors
        // including a variety of interpolation algorithms for moving,
        // fading, scaling [!@# not yet implemented], color-change, etc.
        //
        // Included in the rita.* package primarily to document callbacks as
        // follows:<br>
        //
        // public void onRiTaEvent(re) {
        // // do something with the RiText whose behavior has finished
        // var rt = re.getSource();
        // ...
        // // do something with the Behavior directly
        // var rtb = re.getData();
        // ...
        // }
    
        // Needs to exist in child objects: fn updateRiText()
    
        TextBehavior = function TextBehavior() {
    
        };
    
        // Container for TextBehaviors, used by meta methods below
        TextBehavior.instances = [];
    
        TextBehavior.prototype = {
    
        completed : false, duration : 0, id : -1,
        // initDuration : 0,  // why?  so you can call reset without a value
        //initRepeating : false, // DCH // why???
        interpolator : new InterpolatorArray([]), listeners : [], name : null, pauseFor : 0, remainingAfterPauseMs : 0, repeating : false, reusable : false, running : true, rt : null, startOffset : 0, type : -1,
    
        // ================== Constructor ==================
    
        // Constructor function to be run "manually" by child objects
        init : function(rt, timerName, startOffsetInSec, durationInSeconds, repeating) {
    
            if (startOffsetInSec > 0) throw new Error("offset not yet tested...");
    
            TextBehavior.instances.push(this);
    
            this.rt = rt;
            this.id = RiTa.nextId();
            this.repeating = assign(repeating, false); // DCH
            if (!isNull(timerName)) this.name = timerName; // DCH
            if (isNull(durationInSeconds) || durationInSeconds < 0) return; // DCH
    
            /*
             * this.initRepeating = this.repeating; // DCH if (typeof (durationInSeconds) ===
             * 'undefined') { durationInSeconds = -1; // use isNull }
             */
    
            this.duration = durationInSeconds;
            //this.initDuration = durationInSeconds;
            this.startOffset = startOffsetInSec;
            this.startTime = Date.now(); // update for delay
    
            //console.log("TextBehavior.add: id=#"+this.id+" of "+TextBehavior.instances.length);
        },
    
        // ================== Control methods ==================
    
        update : function() {
    
            if (this.duration <= 0 || this.completed || this.isPaused()) { return; }
    
            if (this.interpolator.update()) { // true if running
                this.updateRiText();
            }
            this.checkForCompletion();
        },
    
        // Causes the behavior to be (immediately) repeated with its
        // initial params and the specified 'duration'. 
        // Ignores startOffset and restarts immediately.
        reset : function(durationInSeconds) {
    
            this.completed = false;
            this.running = true;
    
            if (durationInSeconds < 0) return;
    
            this.duration = durationInSeconds;
            this.startTime = Date.now();
            this.pauseFor = 0;
    
            this.interpolator.reset(null, 0, toMs(durationSec));
        },
    
        finish : function() {
    
            if (!isNull(this.interpolator)) this.interpolator.finish();
            this.completed = true;
        },
    
        stop : function() {
    
            if (!isNull(this.interpolator)) this.interpolator.stop();
            this.running = false;
            this.duration = -1;
        },
    
        // Pauses the behavior for 'pauseTime' seconds
        pause : function(pauseTime) {
    
            this.pauseFor = pauseTime;
        },
    
        // ================== Get methods ==================
    
        // Returns the total duration for the behavior
        getDuration : function() {
    
            return this.duration;
        },
    
        // Returns the unique id for this behavior
        getId : function() {
    
            return this.id;
        },
    
        // Returns the user-assigned name for this behavior
        getName : function() {
    
            return this.name;
        },
    
        // Returns the RiText object in which this behavior is operating
        getRiText : function() {
    
            return this.rt;
        },
    
        // Returns the original startOffset for the behavior
        getStartOffset : function() {
    
            return this.startOffset;
        },
    
        // Return target values of interpolator(s)
        getTargets : function() {
    
            return this.interpolator.getTargets();
        },
    
        // Returns the type for the behavior
        getType : function() {
    
            return this.type;
        },
    
        // Returns values for associated interpolator(s)
        getValues : function() {
    
            return this.interpolator.getValues();
        },
    
        // Returns whether this behavior has completed
        isCompleted : function() {
    
            return this.completed;
        },
    
        // Returns the paused status for the behavior
        isPaused : function() {
    
            return (this.pauseFor > 0);
        },
    
        // Returns whether behavior will repeat (indefinitely) when
        // finished
        isRepeating : function() {
    
            return this.repeating;
        },
    
        // Returns the paused status for the behavior
        isRunning : function() {
    
            return this.running;
        },
    
        // Returns whether behavior has started
        isWaiting : function() {
    
            return (Date.now() < this.startTime);
        },
    
        // ================== Set methods ==================
    
        setId : function(id) {
    
            this.id = id;
        },
    
        // Sets a (user-assigned) name for this behavior.
        setName : function(name) {
    
            this.name = name;
        },
    
        // Sets the paused status for the behavior
        setPaused : function(pausedVal) {
    
            var soFar, pauseFor;
            if (pausedVal) {
    
                // Compute how long its been running, and how much remaining
                pauseFor = INTEGER_MAX_VALUE;
                soFar = (Date.now() - this.startTime);
                this.remainingAfterPauseMs = (duration * 1000 - soFar);
    
            }
            else {
                this.reset(remainingAfterPauseMs / 1000);
            }
        },
    
        // Sets whether the behavior should repeat (indefinitely) when
        // finished
        setRepeating : function(repeating) {
    
            this.repeating = repeating;
        },
    
        setRunning : function(b) {
    
            this.running = b;
        },
    
        setType : function(type) {
    
            this.type = type;
        },
    
        setMotionType : function(motionType) {
    
            this.interpolator.setMotionType(motionType);
        },
    
        // ============ Completion / deletion methods ============
    
        // Checks for completion, and if so, fires the callback
        checkForCompletion : function() {
    
            this.completed = this.interpolator.isCompleted();
            if (this.running && this.completed && !this.isPaused()) {
                this.updateRiText();
                this.fireCallback();
            }
        },
    
        fireCallback : function() {
    
            var behaviorType = this.getType(), eventType = BEHAVIOR_COMPLETED, ok;
    
            this.running = false;
    
            if (behaviorType == TIMER) eventType = TIMER_TICK;
    
            if (this.rt != null && !RiText.callbacksDisabled) {
    
                ok = RiTa.fireEvent(new RiTaEvent(this.rt, eventType, this));
    
                if (!ok) {
                    if (behaviorType == TIMER) {
                        console.log("\n[WARN] Possible coding error? You appear to have created"
                            + " a callback timer,\n       but not implemented the method: "
                            + "'void onRiTaEvent(RiTaEvent rt)'");
                    }
                    RiText.callbacksDisabled = true;
    
                }
            }
    
            this.notifyListeners(); // Now tell any listeners
    
            if (this.isRepeating()) this.reset(this.duration);
        },
    
        // Adds a listener for events fired from this behavior, e.g.,
        // completion, upon which it will behaviorCompleted();
        addListener : function(bl) { // behaviorListener // <<-- !@#
    
            // test this
            this.listeners.push(bl);
        },
    
        notifyListeners : function() {
    
            if (this.listeners.length > 0) {
                for ( var l in this.listeners) {
                    l.behaviorCompleted(this);
                }
            }
        },
    
        // !@# had to change from "delete" in java version because
        // "delete" is reserved in js
        dispose : function() {
    
            this.running = false;
            this.complete = true;
            this.stop();
            if (!isNull(this.rt) && !isNull(this.rt.behaviors)) {
                // removeFromArray(RiTa.behaviors, this);
                removeFromArray(this.rt.behaviors, this);
            }
            removeFromArray(TextBehavior.instances, this);
        },
    
        // ================== Meta methods ==================
    
        // Stops and deletes all the behaviors for a specified RiText
        // object that are of types
        /*
         * FADE_IN, FADE_OUT and FADE_TO_TEXT. disposeFades : function(rt) {
         *  // DCH: DO WE NEED THIS ONE“?? var behaviors = rt.getBehaviors(), rtb;
         * 
         * if (behaviors == null) { return; }
         * 
         * for (rtb in behaviors) { if (rtb != null && (rtb.type == FADE_IN || rtb.type ==
         * FADE_OUT || rtb.type == FADE_COLOR || rtb.type == FADE_TO_TEXT)) { rtb.dispose(); } } },
         */
    
        // Calls destroy() on all existing behaviors
        disposeAll : function() {
    
            for ( var i in TextBehavior.instances) {
                i.dispose();
            }
        },
    
        // Pauses/un-pauses all existing behaviors (takes boolean)
        pauseAll : function(paused) {
    
            for ( var i in TextBehavior.instances) {
                i.setPaused(paused);
            }
        },
    
        findById : function(id) {
    
            if (TextBehavior.instances == null) return null;
            for ( var rtb in TextBehavior.instances) {
                if (rtb != null && rtb.getId() == id) { return rtb; }
            }
            return null;
        },
    
        findByName : function(name) {
    
            if (TextBehavior.instances == null) return null;
            for ( var rtb in TextBehavior.instances) {
                if (rtb != null && rtb.getName() == name) return rtb;
            }
            return null;
        },
    
        findByType : function(type) {
    
            var l = [], rtb;
            if (TextBehavior.instances == null) return l;
            for (rtb in TextBehavior.instances) {
                if (rtb != null && rtb.getType() == type) l.push(rtb);
            }
            return l;
        }
    
        };// end TextBehavior
    
        // ////////////////
        // TextMotion2D // extends TextBehavior
        // ////////////////
    
        // Creates a text motion behavior. Not accessed directly by user.
    
        TextMotion2D = function TextMotion2D(rt, targetX, targetY, offsetMs, durationInMs) {
    
            this.init(rt, "TextMotion2D", offsetMs, durationInMs, false);
            this.setMotionType(rt.motionType);
            this.setType(MOVE);
            this.interpolator = new InterpolatorArray(
                [ [ rt.getX(), targetX ], [ rt.getY(), targetY ] ], offsetMs, durationInMs,
                rt.motionType);
    
            // [ rt.getY(), targetY ] ], offsetMs, durationInMs); // DCH:
            // fixed bug here (no motion-type)
        };
    
        TextMotion2D.prototype = new TextBehavior();
        TextMotion2D.prototype.constructor = TextMotion2D;
    
        TextMotion2D.prototype.updateRiText = function() {
    
            var values = this.getValues();
            this.rt.setPosition(Math.round(values[0]), Math.round(values[1]));
        };
    
        // //////////////
        // ColorFader // extends TextBehavior
        // //////////////
    
        // Creates a color fading behavior. Not accessed directly by user.
    
        ColorFader = function ColorFader(rt, colors, offsetMs, durationInMs, type) {
    
            var current = rt.getColor();
    
            //console.log("current="+current.r+", "+current.g+","+current.b+", "+current.a);
    
            var r, g, b, a; // targets
    
            this.init(rt, "ColorFader", offsetMs, durationInMs, false);
    
            this.setType(type);
    
            if (type == FADE_IN || type == FADE_OUT) {
                // a = colors[0]; // D: this was a bug
                a = colors[3];
                this.interpolator = new InterpolatorArray([ [ current.a, a ] ], offsetMs, durationInMs);
            }
            else if (type == FADE_COLOR) {
                r = (typeof colors[0] === 'number') ? colors[0] : current.r;
                g = (typeof colors[1] === 'number') ? colors[1] : current.g;
                b = (typeof colors[2] === 'number') ? colors[2] : current.b;
                a = (typeof colors[3] === 'number') ? colors[3] : current.a;
    
                this.interpolator = new InterpolatorArray(
                    [ [ current.r, r ], [ current.g, g ], [ current.b, b ], [ current.a, a ] ],
                    offsetMs, durationInMs);
            }
        };
    
        ColorFader.prototype = new TextBehavior();
        ColorFader.prototype.constructor = ColorFader;
    
        ColorFader.prototype.updateRiText = function() {
    
            var values = this.getValues();
    
            if (this.getType() == FADE_IN || this.getType() == FADE_OUT) {
                this.rt.color.a = Math.round(values[0]);
            }
            else {
                this.rt.fill(Math.round(values[0]), Math.round(values[1]), Math.round(values[2]), Math
                    .round(values[3]));
            }
        };

    }
    //if (!isNull(Processing) && !isNull(Processing.lib)) Processing.lib.RiTaLibrary = RiTaLibrary; // install in p5

