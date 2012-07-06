var y,descent;
var lineWidth;
var fontSize=20;
String myText = "Hello worlg!";

PFont fontA = loadFont("cooperBlack.svg");
  
// Set up the screen
void setup()
{  
    size(400, 400);
    noStroke();
    strokeWeight(0);  
    y = width/2;
    
    // Get units per em
    var units_per_em = fontA.units_per_em;
    
    console.debug("units_per_em="+units_per_em);
    
    // Get text-descent
    descent = fontA.descent;
    
    console.debug("descent="+descent);

    // Get text-ascent
    var ascent = fontA.ascent;
    
    console.debug("ascent="+ascent);

    // Get default horizontal advance
    var advance = fontA.horiz_adv_x;
    
    lineWidth = fontA.width( myText ) * fontSize;   
    

}

void draw()
{    
    background(255);

    textFont(fontA, fontSize);    
    
    fill(255,128,0,64);
    rect(0, y+4, lineWidth, fontSize);
    //rect(0, y+fontA.descent, lineWidth, fontSize);  
    
    fill(255,128,0);
    text(myText, 0, y);  

    exit();
}