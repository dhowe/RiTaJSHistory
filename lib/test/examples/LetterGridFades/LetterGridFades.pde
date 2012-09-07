import rita.*;

RiText[] rt;
int k, num=6;

// from http://www.processing.org/learning/basics/letters.html

void setup()  
{
  size(200, 200);
  
  RiText.setDefaultColor(255);
  RiText.setDefaultAlignment(CENTER);
  RiText.setDefaultFont("CourierNew36.vlw");
  
  rt = new RiText[num * num];
  for (int i=0; i< num; i++) {
    for (int j=0; j< num; j++, k++) {
      char c = char(65+k);            // letters
      rt[k] = new RiText(this, c, 24+j*30, 32+i*30);
      if (k < 26) {    
        if ("AEIOU".indexOf(c) >= 0)  // vowels
          rt[k].fadeColor(204, 1);
      } 
      else {
        rt[k].setText((char)(k+22));  // numbers
        rt[k].fill(153);
      }
    }
  }
}

void draw() {
  background(0);
}

void onRiTaEvent(RiTaEvent re) {
  RiText vow = (RiText)re.getSource(); 
  vow.fadeColor(random(100,255), 
    random(100,255), 0, 255, 1);
}


