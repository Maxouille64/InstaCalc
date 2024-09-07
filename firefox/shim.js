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

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  var color = "#40d3c8";
  var size = 20;
  if (item.spTextColor) {
    color = item.spTextColor;
  }
  if (item.spFontSize) {
    size = item.spFontSize;
  }
  sheet.insertRule(`#instaCalc {
      color: ${color} !important;
      font-size: ${size}px !important;
    }`,0);// object
}

var getting = browser.storage.sync.get(["spFontSize","spTextColor"]);
getting.then(onGot, onError);

load('/scripts/instacalc.js');
