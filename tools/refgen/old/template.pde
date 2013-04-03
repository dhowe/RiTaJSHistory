
void template(int idx, int currentJSON) {
  
  String folder_methodName = tmp_methodName[idx].replaceAll("\\(\\)", "_");
  output = createWriter(EXPORT_DIR + tmp_className[currentJSON] + "/" + folder_methodName + "/index.html");
  for (int i=0; i< lines.length; i++) {

    lines[i] = lines[i].replaceAll("tmp_className", tmp_className[currentJSON]);


    lines[i] = lines[i].replaceAll("tmp_methodName", tmp_methodName[idx]);


    if  (tmp_example[idx].length() == 0) {
      lines[i] = lines[i].replaceAll("<tr class='Examples'>", "<tr class='Examples' style='display:none'>");
    }
    lines[i] = lines[i].replaceAll("tmp_example", tmp_example[idx]); 


    lines[i] = lines[i].replaceAll("tmp_description", tmp_description[idx]);


    if  (tmp_syntax[idx].length() == 0) {
      lines[i] = lines[i].replaceAll("<tr class='Syntax'>", "<tr class='Syntax' style='display:none'>");
    }
    lines[i] = lines[i].replaceAll("tmp_syntax", tmp_syntax[idx]); 

    if  (tmp_parameterType[0].length() == 0) {
          lines[i] = lines[i].replaceAll("<tr class='Parameters'>", "<tr class='Parameters' style='display:none'>");
      }
      
    String[] m = match(lines[i], "tmp_parameters");
    if (m!= null) {
      for (int k = 0; k < numOfparameters; k++) {
        tmp_parameter[k] = "<tr class=''><th width='25%' scope='row'>" + tmp_parameterType[k] + "</th><td width='75%'>" + tmp_parameterDesc[k]+ "</td></tr>"; 
        if (tmp_parameters[idx] == null) { 
          tmp_parameters[idx] = "";
        }
        tmp_parameters[idx] = tmp_parameters[idx] + tmp_parameter[k];
      }   
      if (tmp_parameters != null) {
        lines[i] = lines[i].replaceAll("tmp_parameters", tmp_parameters[idx]);
      }
    }


    if  (tmp_parameterType[0].length() == 0) {
          lines[i] = lines[i].replaceAll("<tr class='Returns'>", "<tr class='Returns' style='display:none'>");
      }

    String[] m2 = match(lines[i], "tmp_returns");
    if (m2!= null) {
      for (int k = 0; k < numOfreturns; k++) {
        tmp_return[k] = "<tr class=''><th width='25%' scope='row'>" + tmp_returnType[k] + "</th><td width='75%'>" + tmp_returnDesc[k]+ "</td></tr>"; 
        if (tmp_returns[idx] == null) { 
          tmp_returns[idx] = "";
        }
        tmp_returns[idx] = tmp_returns[idx] + tmp_return[k];
      }   
      if (tmp_returns != null) {
        lines[i] = lines[i].replaceAll("tmp_returns", tmp_returns[idx]);
      }
    }


    if  (tmp_related[idx].length() == 0) {
      lines[i] = lines[i].replaceAll("<tr class='Related'>", "<tr class='Related' style='display:none'>");
    }
    lines[i] = lines[i].replaceAll("tmp_related", tmp_related[idx]);


    lines[i] = lines[i].replaceAll("tmp_platform", tmp_platform[idx]); 


    if  (tmp_note[idx].length() == 0) {
      lines[i] = lines[i].replaceAll("<tr class='Note'>", "<tr class='Note' style='display:none'>");
    }
    lines[i] = lines[i].replaceAll("tmp_note", tmp_platform[idx]); 


    output.println(lines[i]);
    //println(lines[i]);
    // println("writing index" + idx);
  }
}

