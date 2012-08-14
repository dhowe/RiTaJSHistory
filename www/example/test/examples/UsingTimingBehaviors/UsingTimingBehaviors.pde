/*
 * @desc Using RiTa timers to generate callbacks 
 */

import rita.*;

RiText rt;
int count = 0; // utf-8 chars too
String[] txt = {"GOD", "DÖG"};

void setup() {  
  size(200,100);
  rt = new RiText(this, txt[0], 10, 80);
  rt.createFont("Courier", 100);
  
   // set timer to call onRiTaEvent ever  y half  sec.
  RiTa.setCallbackTimer(this, .5f);
}  

void onRiTaEvent(RiTaEvent re) {
  rt.setText(count++%2==0 ? txt[1]:txt[0]);
}

void draw() {
  background(221,221,204);
}

