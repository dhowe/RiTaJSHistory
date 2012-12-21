import processing.opengl.*;
import rita.*;

RiText rt;

void setup() {
  size(400, 200);

  RiText.setDefaultFont("BigCaslon110.vlw");
  rt = new RiText(this, "CLICK", 0, 150);

}

void draw() {
  background(255);
  rt.scale(max(0.1,mouseX)/(float)width);
}



