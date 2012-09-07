  import rita.*;

/*
 * @desc Uses a grammar combined with a callback to avoid repeated nouns
 */ 
 
  RiGrammar rg;
  RiText rt;
  
  void setup() {
    size(600,200);
    
    RiText.setDefaultAlignment(CENTER);
    RiText.createDefaultFont("arial", 32);
    
    rg = new RiGrammar(this, "uniqnouns.g");
    rt = new RiText(this, rg.expand());    
  }
 
  // called from within the grammar
  String unique(String noun) 
  {
    String soFar = rg.getBuffer();     
    
    // keep trying until there is no duplicate
    while (soFar.contains(noun)) 
    {
      // 'true' says: preserve the original buffer
      noun = rg.expandFrom("<noun>", true);
    }
    return noun;
  }
  
  // generate a new phrase on mouse-click
  void mouseClicked() { 
    rt.setText(rg.expand());
  }
  
  void draw() { background(255);  }
