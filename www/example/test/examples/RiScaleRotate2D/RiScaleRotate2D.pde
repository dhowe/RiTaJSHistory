import processing.opengl.*;
import rita.*;

RiText rt;
int degrees = 0;

void setup() {
  size(400, 200);

  RiText.setDefaultFont("BigCaslon110.vlw");
  rt = new RiText(this, "CAKE", 0, 150);
  rt.scale(.3f);
}

void draw() {
  background(255);
  translate(width-degrees,0);
  if (rt.scaleX < 1) {
    rt.scale(rt.scaleX*1.0032);
  if (degrees <= 360)
    rt.rotate(radians(degrees++));
  }
}



