function load(url) {
  var script = document.createElement('script');
  script.src = chrome.runtime.getURL(url);
  document.body.appendChild(script);
  console.debug(url);
};

var sheet = (function() {
	// Create the <style> tag
	var style = document.createElement("style");

	// Add a media (and/or media query) here if you'd like!
	// style.setAttribute("media", "screen")
	// style.setAttribute("media", "only screen and (max-width : 1024px)")

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
})();

chrome.storage.sync.get({
        spFontSize: 15,
        spTextColor: '#40d3c8',
}, function(options) {
    sheet.insertRule(`#instaCalc {
        color: ${options.spTextColor} !important;
        font-size: ${options.spFontSize}px !important;
      }`,0);// object
    load('/scripts/instacalc.js');
});
