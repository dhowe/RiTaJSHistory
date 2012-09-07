import rita.*;

RiText rt1, rt2;

// Change to a grid of letters...

void setup() 
{
  size(300, 300);

  RiText.setDefaultFont("CourierNew36.vlw");    
  rt1 = new RiText(this, "Click To");  
  rt2 = new RiText(this, "Fade Colors");
  rt2.setY(height/2+30);
}

void draw() 
{
  background(80);                       
}

public void mouseClicked() {
  rt1.fadeColor(randomColor(), 2);
  rt2.fadeColor(randomColor(), 1, 2);
}

public float[] randomColor()  {
  return new float[] { 
    random(0,255), random(0,255), random(0,255), random(0,255) 
  };
}

