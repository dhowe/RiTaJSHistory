import rita.*;

int MAX_LINE_LENGTH = 60;
String data = "http://rednoise.org/rita/data/";

RiText rts[];
RiMarkov markov;

void setup()
{    
  size(380, 450);

  // a little info msg
  new RiText(this, "click to (re)generate!", 135, height/2);
  
  RiText.setDefaultAlignment(LEFT);

  // create a new markov model w' n=3
  markov = new RiMarkov(this, 3);  
  
  //markov.setPrintIgnoredText(true);

  // load 2 files into the model
  markov.loadFile(data+"wittgenstein.txt"); 
  markov.loadFile(data+"kafka.txt");    
}

void draw()
{
  background(255);
}

// generate on mouse click
void mouseClicked() 
{   
  RiText.deleteAll(); // clean-up old data

  String[] lines = markov.generateSentences(10);

  // lay out the return text starting at x=20 y=50)
  rts = RiText.createLines(this, lines, 20, 50, MAX_LINE_LENGTH);
}

