/**
 * @desc Uses two timers, one to blink the cursor,
      one to move it from letter to letter
 */
import rita.*;

int idx = 0;
RiText rt, curs;

void setup() 
{ 
  size(500,100);
 
  RiText.createDefaultFont("Courier", 24);

  rt = new RiText(this, "A line of text with a cursor.");
  curs = new RiText(this, "|");
  
  RiTa.setCallbackTimer(this, "blink", .5f);
  RiTa.setCallbackTimer(this, "move",   2f);
  
  moveCursor();
}

void onRiTaEvent(RiTaEvent re) { 
  if (re.getTag().equals("blink"))
    curs.setVisible(!curs.isVisible()); 
  else
    moveCursor(); // "move"
}

void moveCursor() {
  if (++idx == rt.length()) idx = 0;
  float x = (float)rt.getBoundingBox().getX();
  x += curs.textWidth()/-2f + idx*curs.textWidth();
  curs.setLocation(x+2, rt.y); 
}

void draw() {
  background(255);
}

