import rita.*;

/**
 * @desc Shows how to layout RiTexts in a line, a row or words, or as single letters
 */
String txt = "The dog ate the cat.";
RiText line1, line2[], line3[];

void setup() {    
  size(500, 200);    
  
  RiText.setDefaultFont("Ziggurat32.vlw");
  RiText.setDefaultBBoxVisibility(true);
  
  line1 = new RiText(this, txt, 64, 50);        // line
  line2 = RiText.createWords(this, txt, 64, 100); // words
  line3 = RiText.createLetters(this, txt, 64, 150); // letters
  
  setColors();
}

void draw() {
  background(255);  // wiggle
  line1.y =  50 + frameCount%2;
  line2[line2.length-1].y = 100 + frameCount%4;
  line3[line3.length-2].y = 150 + frameCount%7;
}

void setColors() {    
  for (int i = 0; i < line2.length; i++) 
    line2[i].fill(100+random(155),100+random(155),0);       
  for (int i = 0; i < line3.length; i++) 
    line3[i].fill(100+random(155),100+random(155),0);  
}

