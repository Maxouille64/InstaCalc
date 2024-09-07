var script = document.createElement('script');
script.src = chrome.runtime.getURL('/scripts/calc.js');
document.body.appendChild(script);
console.debug('/scripts/calc.js');
