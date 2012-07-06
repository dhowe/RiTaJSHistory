import processing.opengl.*;
import rita.*;

RiText rt;

void setup() {
  size(280, 200);

  RiText.setDefaultFont("BigCaslon110.vlw");
  rt = new RiText(this, "PILL", 5, 150);
}

void draw() {
  background(255);
  rt.scale(max(0.1,(mouseX)/(float)width));
}



