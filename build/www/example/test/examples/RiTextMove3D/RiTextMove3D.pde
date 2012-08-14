import processing.opengl.*;

import rita.*;

RiText rt1,rt2;

void setup() 
{
  size(400, 400, P3D);

  RiText.setDefaultColor(0,100,0);
  RiText.setDefaultFont("Academy48.vlw");  

  rt1 = new RiText(this, "Green Ideas", 0, 50);
  rt1.x = -rt1.textWidth()/2;

  rt2 = new RiText(this, "Circle Slowly", 0, -50);
  rt2.x = -rt2.textWidth()/2;

  // after 1 sec, swap places over 4 sec
  rt1.moveTo(rt1.x, -50, 1, 4);
  rt2.moveTo(rt2.x,  50, 1, 4);
}

void draw() {
  background(255); // move to middle
  translate(width/2,height/2,0);
  
  // slowly rotate based on framecount
  rt1.rotateY(radians(frameCount) / 2);
  rt2.rotateY(-radians(frameCount) / 2);
}




