import rita.*;

String poem = "空山不見人 但聞人語響 返景入深林 復照青苔上";
String[] trans = {
  "    On empty slopes", "we see nobody,", "    Yet we can hear", "men’s echoes phrases :", " ", "    Returning light", "enters the deep woods", "    And shines again", "on the green mosses."};
PFont titleFont, transFont, translatorFont;

void setup()
{
  size(400, 600);
  titleFont = loadFont("BiauKai-42.vlw"); 
  transFont = loadFont("Baskerville-16.vlw"); 
  translatorFont = loadFont("Baskerville-Italic-14.vlw"); 
  RiText.setDefaultFont("LiSong Pro-32.vlw");
  RiText author = new RiText(this, "王維", 80, 60);
  RiText title = new RiText(this, "鹿  柴", 80, 100);
  RiText translator = new RiText(this, "‘Deer Park’ by Wang Wei • translation Arthur Cooper", 120, 560);
  author.textFont(titleFont);
  title.textFont(titleFont);
  translator.textFont(translatorFont);
  // Start at (40, 80) & break 'poem' into     // lines, each no more than 50 chars wide
  RiText[] lines = RiText.createLines(this, poem, 80, 160, 10);       
  RiText[] transLines = RiText.createLines(this, trans, 120, 330, -1, 0); // respect line endings
  for (int i = 0; i < transLines.length; i++) {
    transLines[i].textFont(transFont);
  }
}

void draw() {
  background(255);
}



