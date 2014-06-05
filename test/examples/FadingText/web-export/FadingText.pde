  import rita.*;
  
  RiText rt;
  int clicks = 0;
  String[] txt = {"Click To Fade", "Fade On Click" };
  
  void setup() {  
    size(400,100);
    rt = new RiText(this, txt[0], 10, 70);
    rt.createFont("Arial", 60);
  }  
  
  void draw() {
    background(255);
  } 
  
  void mouseClicked() 
  { 
    // swap texts
    String newText = clicks++%2 == 0 ? txt[1] : txt[0];
    
    // fade to the new over 4 secs
    rt.fadeToText(newText, 4f); 
  }

