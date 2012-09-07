import rita.*;

/**
 * @desc Timed scaling behaviors with callbacks on completion 
 */
 
RiText rt;

void setup() {
  size(400, 200);
  RiText.setDefaultFont("BigCaslon110.vlw");
  rt = new RiText(this, "SCALE", 0, 150);
  doScale();
}

void doScale()
{
  rt.scaleTo(.2, 3);  // scale to .2 over 3 seconds
  rt.scaleTo(1, 2, 3); /* scale to fullsize over 2 seconds, 
                          after waiting 3 seconds  */
}

// called when any behavior (e.g., scaleTo) completes
void onRiTaEvent(RiTaEvent re) {
  RiText rt = (RiText)re.getSource();
  if (rt.scaleX>=1) doScale();
}

void draw() {
  background(255);
}

