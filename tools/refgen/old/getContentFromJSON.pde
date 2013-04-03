
void getContentFromJSON(int currentJSON) {

  String request = JSONLocation; 
  println("JSON File :" + request);
  String result = join( loadStrings( request ), "");

  // String ergänzen 
  result= 
    "{ \"success\": true, \"pagination\": { \"current\": 1, \"max\": 1 }, \"items\": " + 
    result + 
    "}";

  // try 
  try {
    JSONObject Data1 = new JSONObject(result);
    JSONArray results = Data1.getJSONArray("items");

    numOfMethods = results.length();
    println("Number of items : " + numOfMethods);
    initialization();
    // loop through array 
    for (int j = 0; j < numOfMethods; j++) {
      lines = loadStrings(templateLoc);

      JSONObject entry = results.getJSONObject(j);

      //tmp_className[j] = entry.getString("tmp_className");
      tmp_methodName[j] = entry.getString("methodName");
      println("Creating : " + entry.getString("methodName"));
      tmp_example[j] = entry.getString("example");
      tmp_description[j] = entry.getString("description");
      tmp_syntax[j] = entry.getString("syntax");
      
      JSONArray parametersJSON = entry.getJSONArray("parameters");
      numOfparameters = parametersJSON.length();
      tmp_parameter = new String[numOfparameters];
      tmp_parameterType = new String[numOfparameters];
      tmp_parameterDesc = new String[numOfparameters];
      for (int k = 0; k < numOfparameters; k++) {

        JSONObject parametersJSONEntry = parametersJSON.getJSONObject(k);
        tmp_parameterType[k] = parametersJSONEntry.getString("type");
        tmp_parameterDesc[k] = parametersJSONEntry.getString("desc");

      }
      
      JSONArray returnsJSON = entry.getJSONArray("returns");
      numOfreturns = returnsJSON.length();
      tmp_return = new String[numOfreturns];
      tmp_returnType = new String[numOfreturns];
      tmp_returnDesc = new String[numOfreturns];
      for (int k = 0; k < numOfreturns; k++) {

        JSONObject returnsJSONEntry = returnsJSON.getJSONObject(k);
        tmp_returnType[k] = returnsJSONEntry.getString("type");
        tmp_returnDesc[k] = returnsJSONEntry.getString("desc");

      }
      tmp_related[j] = entry.getString("related");
      tmp_platform[j] = entry.getString("platform");
      tmp_note[j] = entry.getString("note");

      template(j,currentJSON);
      doneFile();
    } // for
  } // try 
  catch (JSONException e) {
    println ("There was an error parsing the JSONObject.");
  } // catch
} // func 


// ----------------------------------------------------------------------
void initialization() {
  //tmp_className = new String[numOfMethods];
  tmp_methodName = new String[numOfMethods];
  tmp_example = new String[numOfMethods];
  tmp_description = new String[numOfMethods];
  tmp_syntax = new String[numOfMethods];
  tmp_parameters = new String[numOfMethods];
  tmp_returns = new String[numOfMethods];
  tmp_related = new String[numOfMethods];
  tmp_platform = new String[numOfMethods];
  tmp_note = new String[numOfMethods];
}

void doneFile() {
  output.flush(); // Writes the remaining data to the file
  output.close(); // Finishes the file
}

