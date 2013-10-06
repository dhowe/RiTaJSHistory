function loadLibrary(name) {
	
	var loc = '../src/rita.js', srcloc = param('src'), data = param('data');

	srcloc && (srcloc != 'lib') && ( loc = srcloc);

	var srcTag = '<script src="' + loc + '"><' + '/script>', dataStr = '';

	if ((!srcloc || srcloc == 'lib') && data && data != 'f' && data != '0') {

		srcTag += '\n<script src="' + loc.replace('rita.js', 'rita_lts.js') + '"><' + '/script>';
		srcTag += '\n<script src="' + loc.replace('rita.js', 'rita_dict.js') + '"><' + '/script>';
		dataStr = ' (+data/lts)'
	}

	console.log('[TEST] Loading ' + name + ' from ' + loc + dataStr);

	document.write(srcTag);
}

function param(name) {
	
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	
	var results = regex.exec(window.location.search);
	return (results == null) ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
