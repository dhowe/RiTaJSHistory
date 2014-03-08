  import rita.*;

  int clicks = 0;
  RiText[] slots = new RiText[3];
  String[] items = { "cherry", "$$$$", "lemon", "seven", "rings" };

  void setup() {
    size(400, 100);
    
    // the initial layout
    int xOff = width / 2 - 100;
    RiText.createDefaultFont(this, "Arial", 32);
    for (int j = 0; j < slots.length; j++)
      slots[j] = new RiText(this, items[j], xOff += 50, 65);
    slots[0].textAlign(RIGHT);
    slots[1].textAlign(CENTER);
    
    // set a timer to callback every .3 sec
    slots[2].setCallbackTimer(.3, true);
  }
  
  void mouseClicked() {
    if (++clicks == 4)
      clicks = 0; // count clicks
  }
  
  void onRiTaEvent(RiTaEvent re) { 
    
    // set them all to red
    for (int i = 0; i < slots.length; i++) 
      slots[i].setColor(255,0,0);
    
    // lets some keep spinning 
    if (clicks < 1)
      randomItem(slots[1]);
    if (clicks < 2)
      randomItem(slots[0]);
    if (clicks < 3)
      randomItem(slots[2]);
  }
  
  void randomItem(RiText rt) {
    // pick a random string & set it to black
    int randIdx = (int)random(slots.length);
    rt.setText(items[randIdx]);
    rt.setColor(0);
  }
  
  void draw() {
    background(221, 221, 204);
  }
