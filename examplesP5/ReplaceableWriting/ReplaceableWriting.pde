import rita.*;

RiText[] rts; 
RiWordNet wordnet; 

String text = "Last Wednesday we decided to visit the zoo. We arrived the next morning after we breakfasted, cashed in our passes and entered. We walked toward the first exhibits. I looked up at a giraffe as it stared back at me. I stepped nervously to the next area. One of the lions gazed at me as he lazed in the shade while the others napped. One of my friends first knocked then banged on the tempered glass in front of the monkey's cage. They howled and screamed at us as we hurried to another exhibit where we stopped and gawked at plumed birds. After we rested, we headed for the petting zoo where we petted wooly sheep who only glanced at us but the goats butted each other and nipped our clothes when we ventured too near their closed pen. Later, our tired group nudged their way through the crowded paths and exited the turnstiled gate. Our car bumped, jerked and swayed as we dozed during the relaxed ride home.";

void setup()
{
  size(400, 400);   
  RiText.defaults.fontSize = 18; 
  wordnet = new RiWordNet("/WordNet-3.1", true);
  rts = RiText.createLines(this, text, 50, 50, 300);   
  RiTa.timer(this, 2.0); 
}

void draw()
{
  background(250);
  RiText.drawAll();
}

/*  replace a random word in the paragraph with one
 from wordnet with the same (basic) part-of-speech */
void onRiTaEvent(RiTaEvent e)
{
  println();
  
  String[] words = text.split(" ");

  // loop from a random spot
  int count = (int)random(0, words.length);
  for (int i = count; i < words.length; i++) 
  {
    // only words of 3 or more chars
    if (words[i].length()<3) continue;
      
    // get the pos
    String pos = wordnet.getBestPos(words[i].toLowerCase());        
    if (pos != null) 
    {

      println("======================\nword: "+words[i]+":");

      // get the synset
      String[] syns = wordnet.getSynset(words[i], pos);

println(syns);

      if (syns.length<1) continue;

      // pick a random synonym
      String newStr = syns[(int)random(0, syns.length)];

println("replace: "+newStr);

      if (Character.isUpperCase(words[i].charAt(0)))              
        newStr = RiTa.upperCaseFirst(newStr); // keep capitals

      // and make a substitution
      //text = RiText.regexReplace("\\b"+words[i]+"\\b", text, newStr);
      text = text.replaceAll("\\b"+words[i]+"\\b", newStr);
      
      RiText.dispose(rts);   // clean up the last batch

      // create a RiText[] from 'text' starting at (30,50) & going down
      rts = RiText.createLines(this, text, 50, 50, 300);      
      break;
    }    
  }       
}

