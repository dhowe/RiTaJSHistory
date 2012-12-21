import rita.*;

PGraphics b;
PImage img;
RiText rt;

void setup()
{
  size(300, 300);
  
  RiText.disableAutoDraw();
  RiText.createDefaultFont(this, "Arial", 36);
  
  // create the offscreen buffer
  b = createGraphics(250, 250, JAVA2D);
  
  // create a moving RiText  
  rt = new RiText(this, "Buffer", 0, 100);
  rt.moveTo(b.width, 100, 3f);
}

void draw()
{
  b.beginDraw();
  b.background(255);
  rt.draw(b);
  b.endDraw(); // draw the offscreen buffer
  image(b.get(0, 0, b.width, b.height), 0, 0);
  
  // reset move animation
  if (rt.isOffscreen(b)) {
    rt.setLocation(0, 100);
    rt.moveTo(b.width, 100, 3f);
  }
}


