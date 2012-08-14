// JavaScript Document

	
function InsertMailToTag( userName, domainName)
{
var EmailId;
var atSign = "&#64;"
var fullStop = "&#46";

EmailId = userName;
EmailId = "" + EmailId + atSign; 
EmailId = EmailId + domainName;

document.write( "<a href='mail" + "to:" + EmailId + "'><span>" + "contact"
+"</span></a>" );
}


	//<script text="text/javascript">mailTo("id", "domain(eg.gmail.com)", "Display Name")</s

