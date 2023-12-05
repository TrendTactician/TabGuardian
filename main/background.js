// background.js
chrome.tabs.onCreated.addListener(function(tab) {
  // Close the tab if it was opened by a website
  if (tab.openerTabId !== undefined) {
    chrome.tabs.remove(tab.id);
  }
});
