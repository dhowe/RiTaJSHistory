import rita.*;

RiText rt;

void setup()
{
  size(300, 300);

  RiText.setDefaultFont("Ziggurat32.vlw"); 

  rt = new RiText(this, "drag me", 70, 150);
  rt.showBoundingBox(true);
  rt.boundingBoxStrokeWeight(4);
  rt.setMouseDraggable(true);    
  rt.setSelectedColor(128,0,0);
}

void mouseReleased()
{
  // drift back to center 
  rt.moveTo(70, 150, .5f);
}

void draw()
{
  background(80);
}

