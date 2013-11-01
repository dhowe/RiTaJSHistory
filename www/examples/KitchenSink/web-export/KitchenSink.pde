import rita.*;

String input = "My big black dog is hungry";

Stirng result = RiTa.getPosTagsInline(input);

//RiLexicon w = new RiLexicon();
//String test = "night";
//String[] s = w.getAntonyms(test, "n");
//result =  test + " != "+s[0];



result = "No WordNet in JS";
if (RiTa.env() == RiTa.JAVA) {

  RiWordnet w = new RiWordnet("/WordNet-3.1");
  String test = "night";
  String[] s = w.getAntonyms(test, "n");
  result =  test + " != "+s[0];
}


