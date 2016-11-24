
function click(e){
  chrome.tabs.query({currentWindow:true, active:true}, function(tabs){
    var specTab = tabs[0];
      chrome.tabs.executeScript(specTab.id, {file:"gifyezer.js"}, function(url){
    });
  });

}

chrome.browserAction.onClicked.addListener(click);
