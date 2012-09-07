  import rita.*;
  
  // A simple text display sketch
  
  String poem = "A huge lizard was discovered drinking out of the fountain today. It was not menacing anyone, it was just very thirsty. A small crowd gathered and whispered to one another, as though the lizard would understand them if they spoke in normal voices. The lizard seemed not even a little perturbed by their gathering. It drank and drank, its long forked tongue was like a red river hypnotizing the people, keeping them in a trance-like state. 'It's like a different town,' one of them whispered. 'Change is good,' the other one whispered back."; 

  void setup() 
  {
    size(400, 400);    
    
    RiText.setDefaultFont("Baskerville-16.vlw");
    
    RiText header = new RiText   // title & author at (40,40)
      (this, "New Blood - by James Tate", 40, 40);
      
    // Start at (40, 80) & break 'poem' into  
    // lines, each no more than 50 chars wide
    RiText[] lines = RiText.createLines(this, poem, 40, 80, 50);      
  }

  void draw() {
    background(255);
  }
