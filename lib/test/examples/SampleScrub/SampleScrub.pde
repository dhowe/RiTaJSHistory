import ddf.minim.*; 
import rita.*;      

RiText rt;

void setup() 
{
  size(300, 300);    
  rt = new RiText(this,"click to scrub");
  rt.loopSample("beat.mp3"); 
  
  fill(0);
  stroke(0);
  strokeWeight(3);
}

void draw() 
{
  background(255);
  float pos = getSamplePosition();
  line(pos*width,0,pos*width,height);                        
}

float getSamplePosition()
{
  int current = rt.sample.getCurrentFrame();
  int total = rt.sample.getNumFrames();  
  return current/(float)total; 
}

void mouseClicked()
{
  float frame = mouseX / (float)width;
  frame *= rt.sample.getNumFrames();
  rt.sample.setCurrentFrame((int)frame);
}


