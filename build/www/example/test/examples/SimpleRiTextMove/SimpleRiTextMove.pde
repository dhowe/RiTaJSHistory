import rita.*;

RiText rt1, rt2;

void setup() {
  size(500,500); 
  
  RiText.setDefaultFont("SynchroLET-32.vlw");  
  
  rt1 = new RiText(this, "GOODBYE"); 
  rt2 = new RiText(this, "HELLO"); 
  rt2.fill(255, 0, 0);
    
  reset();
}

void reset() 
{
  rt1.setLocation(300,400);  
  rt1.moveTo(rt1.x, 0, 3); 
  
  rt2.setLocation(100,100);
  rt2.moveTo(rt2.x, height+25, 3);
}

void mouseClicked() {
  reset();
}
  
void draw() {
  background(255);
}

