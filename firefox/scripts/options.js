// Saves options to chrome.storage
function save_options() {
  var fontSize = document.getElementById('spFontSize').value;
  var textColor = document.getElementById('spTextColor').value;
  console.debug(fontSize);
  browser.storage.sync.set({
    spFontSize: fontSize,
    spTextColor: textColor,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores inputs state using the preferences stored in chrome.storage
function restore_options() {
  browser.storage.sync.get({
    spFontSize: 15,
    spTextColor: '#40d3c8', //(62,211,200)
  }, function(items) {
    document.getElementById('spFontSize').value = items.spFontSize;
    document.getElementById('spTextColor').value = items.spTextColor;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
