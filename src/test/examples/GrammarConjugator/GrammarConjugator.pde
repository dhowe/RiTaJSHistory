import rita.*;

int ypos = 5;
RiText[] rts;
RiGrammar rg;
RiConjugator rc; 

void setup() 
{
  size(800, 600);

  RiText.setDefaultAlignment(CENTER);
  RiText.createDefaultFont("Arial",32);

  rc = new RiConjugator(this);    
  rg = new RiGrammar(this, "conjugate.g");
  rts = new RiText[14];
  for (int i = 0; i < rts.length; i++)
    rts[i] = new RiText(this, rg.expand(), width/2, ypos+=40);
}

String conj(String number, String person, String tense, String verb) {
  rc.setPerfect(random(1) < .5);  
  rc.setPassive(random(1) < .5);
  rc.setProgressive(random(1) < .5);
  String s = rc.conjugate(number, person, tense, verb);
  if (rc.isPassive()) s += " by";
  return s;
} 

void mouseClicked() {
  for (int i = 0; i < rts.length; i++)
    rts[i].fadeToText(rg.expand(), 2);
}

void draw() { 
  background(255); 
}

