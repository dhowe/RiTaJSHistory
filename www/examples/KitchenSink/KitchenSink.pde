import rita.*;

String result = "No WordNet in JS";
if (RiTa.env() == RiTa.JAVA) {

  RiWordnet w = new RiWordnet("/WordNet-3.1");
  String test = "night";
  String[] s = w.getAntonyms(test, "n");
  result =  test + " != "+s[0];
}
new RiText(this, result).draw();
