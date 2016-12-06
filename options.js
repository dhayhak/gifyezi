function save_options() {
  var stopByDefault = document.getElementById('stopByDefault').checked;
  chrome.storage.sync.set({
    stopByDefault: stopByDefault
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
    chrome.storage.sync.get("stopByDefault", function (items) {
        if (items)
            document.getElementById('stopByDefault').checked = items.stopByDefault;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',  save_options);