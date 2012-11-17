var x=50,y=50,w=400,h=620;

var rts[];
var txt = "A huge lizard was discovered drinking out of the fountain today. It was not menacing anyone, it was just very thirsty. A small crowd gathered and whispered to one another, as though the lizard would understand them if they spoke in normal voices. The lizard seemed not even a little perturbed by their gathering. It drank and drank, its long forked tongue was like a red river hypnotizing the people, keeping them in a trance-like state. 'It's like a different town,' one of them whispered. 'Change is good,' the other one whispered back.";

//x = new XXX();

void setup() {
  size(600, 800);
  

  //RiText.createDefaultFont(this, "Baskerville", 16);
  for (int i = 0; i < 1; i++)
    txt += "</p>" + txt;     // specify some paragraphs
  
  rts = RiText.createLines(txt, x, y, w, h);
  //println("num="+rts.length);// + " '"//+rts[0].getText()+"'")
}

void mousePressed() {
  x = mouseX;
  y = mouseY;
}

void mouseDragged() {
  w = abs(mouseX-x);
  h = abs(mouseY-y);
}

void mouseReleased() {
  RiText.dispose(rts);
  rts = RiText.createLines(txt, x, y, w, h);
}

void draw() {
  background(245);
  noFill();
  rect(x, y, w, h);
  //for (var i = rts.length - 1; i >= 0; i--)
	//rts[i].draw();
}

