  import rita.*;

  RiText rt;
  RiSpeech speech;
  
  void setup() {
    size(200,200);
    rt = new RiText(this, "Hello from RiTa");
    speech = new RiSpeech(this);  
    speech.speak(rt);
  }

  void draw() {
    background(255);
  }
  
  void mouseClicked() {
    speech.speak(rt);
  }
  
  void keyPressed() {
    speech.stop();
  }
