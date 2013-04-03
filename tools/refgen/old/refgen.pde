import org.json.JSONObject;
import org.json.JSONArray;

String EXPORT_DIR = "../../www/reference/";
String JSON_DIR = "../../docs/json/";

int numOfMethods;
int numOfparameters;
int numOfreturns;
PrintWriter output;
PFont myFont;

String[] lines; 
String[] tmp_methodName;
String[] tmp_example;
String[] tmp_description;
String[] tmp_syntax;
String[] tmp_parameter;
String[] tmp_parameterType;
String[] tmp_parameterDesc;
String[] tmp_parameters;
String[] tmp_return;
String[] tmp_returnType;
String[] tmp_returnDesc;
String[] tmp_returns;
String[] tmp_related;
String[] tmp_platform;
String[] tmp_note;

String JSONLocation; 
String templateLoc;

//FileName to be generated "RiTa","RiString","RiText","RiTaEvent"
String[] tmp_className = {"RiTa","RiString","RiText","RiGrammar","RiMarkov","RiLexicon","RiTaEvent"}; 

void setup() {
 
  for(int currentJSON = 0; currentJSON < tmp_className.length; currentJSON++){

    JSONLocation = JSON_DIR + tmp_className[currentJSON] + ".json"; 
    templateLoc = JSON_DIR + "template.html";
    println("******     "+ tmp_className[currentJSON] + "     ******");
    println("Template File :" + templateLoc);
    getContentFromJSON(currentJSON);
    println();
  }
} 

void draw() {
  allDone();
} 

// =================================================
void allDone() {
  println("\nDONE: files written to "+EXPORT_DIR);
  exit(); // Stops the program
}






