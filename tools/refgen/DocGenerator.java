

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.zip.GZIPOutputStream;

import org.json.*;

import processing.core.PApplet;

public class DocGenerator extends PApplet
{
  //static final String EXPORT_DIR = "../../www/reference/";
  //static final String JSON_DIR = "../../docs/json/";
  
  static final String EXPORT_DIR = "../../www/reference/";
  static final String DATA_DIR = "../../docs/";
  
  static final String[] tmp_className = {
    "RiTa","RiString","RiText","RiGrammar","RiMarkov","RiLexicon","RiTaEvent"
  }; 

  static int numOfMethods, numOfparameters, numOfreturns;
  static PrintWriter output;

  static String[] lines, tmp_methodName, tmp_example, tmp_description, tmp_syntax,
    tmp_parameterType, tmp_parameterDesc, tmp_parameters, tmp_return, tmp_returnType,
    tmp_returnDesc, tmp_returns, tmp_related, tmp_platform, tmp_note, tmp_parameter;

  static String JSONLocation, templateLoc;

  public static void go(String[] args)
  {
    for(int currentJSON = 0; currentJSON < tmp_className.length; currentJSON++){

      JSONLocation = DATA_DIR + "json/"+tmp_className[currentJSON] + ".json"; 
      templateLoc = DATA_DIR + "html/template.html";
      pln("******     "+ tmp_className[currentJSON] + "     ******");
      pln("Template File :" + templateLoc);
      getContentFromJSON(currentJSON);
    }
    pln("\nDONE: files written to "+EXPORT_DIR);
  }

  static void getContentFromJSON(int currentJSON) {

    String request = JSONLocation; 
    pln("JSON File :" + request);
    String result = join( loadTheStrings( request ), "");

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
      pln("Number of items : " + numOfMethods);
      initialization();
      // loop through array 
      for (int j = 0; j < numOfMethods; j++) {
        lines = loadTheStrings(templateLoc);

        JSONObject entry = results.getJSONObject(j);

        //tmp_className[j] = entry.getString("tmp_className");
        tmp_methodName[j] = entry.getString("methodName");
        pln("Creating : " + entry.getString("methodName"));
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
        closeFile();
      } // for
    } // try 
    catch (JSONException e) {
      pln("error parsing the JSONObject."+e);
    } // catch
  } // func 


  // ----------------------------------------------------------------------
  static void initialization() {
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

  static void closeFile() {
    output.flush(); // Writes the remaining data to the file
    output.close(); // Finishes the file
  }
  
  static public PrintWriter createWriter(File file) {
    try {
      createPath(file);  // make sure in-between folders exist
      OutputStream output = new FileOutputStream(file);
      if (file.getName().toLowerCase().endsWith(".gz")) {
        output = new GZIPOutputStream(output);
      }
      return createWriter(output);

    } catch (Exception e) {
      if (file == null) {
        throw new RuntimeException("File passed to createWriter() was null");
      } else {
        e.printStackTrace();
        throw new RuntimeException("Couldn't create a writer for " +
                                   file.getAbsolutePath());
      }
    }
    //return null;
  }

  static void template(int idx, int currentJSON) {
    
    String folder_methodName = tmp_methodName[idx].replaceAll("\\(\\)", "_");
    String fname = EXPORT_DIR + tmp_className[currentJSON] + "/" + folder_methodName + "/index.html";
    output = createWriter(new File(fname));
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
      //pln(lines[i]);
      // pln("writing index" + idx);
    }
  }
  
  private static String[] loadTheStrings(String name)
  {    
    return loadStringsLocal(openStreamLocal(name), 100);
  }
  
  private static InputStream openStreamLocal(String name)
  {
    
    try // check for url first  (from PApplet)
    {
      URL url = new URL(name);
      return url.openStream();
    } catch (MalformedURLException mfue) {
      // not a url, that's fine
    } catch (FileNotFoundException fnfe) {
      // Java 1.5 likes to throw this when URL not available.
      // http://dev.processing.org/bugs/show_bug.cgi?id=403
    } catch (Throwable e) 
    {
      e.printStackTrace();
    }     
    
    try
    {
      return new FileInputStream(name);
    }
    catch (FileNotFoundException e)
    {
      e.printStackTrace();
    }
    
    throw new RuntimeException("openStreamLocal() failed!");

  }


  private static String[] loadStringsLocal(InputStream input, int numLines) {
    
    if (input == null) throw new RuntimeException("Null input stream!");
    
    try {
      BufferedReader reader =
        new BufferedReader(new InputStreamReader(input, "UTF-8"));

      String lines[] = new String[numLines];
      int lineCount = 0;
      String line = null;
      while ((line = reader.readLine()) != null) {
        if (lineCount == lines.length) {
          String temp[] = new String[lineCount << 1];
          System.arraycopy(lines, 0, temp, 0, lineCount);
          lines = temp;
        }
        lines[lineCount++] = line;
      }
      reader.close();

      if (lineCount == lines.length) {
        return lines;
      }

      // resize array to appropriate amount for these lines
      String output[] = new String[lineCount];
      System.arraycopy(lines, 0, output, 0, lineCount);
      return output;

    }
    catch (IOException e) {
      e.printStackTrace();
    }
    
    return new String[]{};
  }
  
  private static void pln(String s)
  {
    System.out.println(s);
  }
  
  public static void main(String[] args)
  {
    pln(System.getProperty("user.dir"));
    go(args);
  }

}
