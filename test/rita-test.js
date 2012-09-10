function testUrl(testName, srcType, globals)
{
    var s = "test/"+testName+".html?";
    if (!globals) s += "noglobals=true&";
    return (s + "type="+srcType);
}

function paramByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}
