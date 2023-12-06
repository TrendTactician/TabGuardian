// background.js
let closedTabsCount = 0;

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    enableNormal: true,
    enableIncognito: true,
    closedTabsCount: 0
  });
});

chrome.tabs.onCreated.addListener(function(tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTab = tabs[0];
    const isIncognito = activeTab.incognito;

    chrome.storage.sync.get(['enableNormal', 'enableIncognito', 'closedTabsCount'], function(result) {
      const shouldCloseTab = tab.openerTabId !== undefined &&
        ((isIncognito && result.enableIncognito) || (!isIncognito && result.enableNormal));

      if (shouldCloseTab) {
        chrome.tabs.remove(tab.id);
        closedTabsCount++;
        updateBadgeText(closedTabsCount);
        chrome.storage.sync.set({ closedTabsCount: closedTabsCount });
      }
    });
  });
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'toggleExtension') {
    chrome.storage.sync.get(['enableNormal', 'enableIncognito'], function(result) {
      const enableNormal = !result.enableNormal;
      const enableIncognito = !result.enableIncognito;

      chrome.storage.sync.set({
        enableNormal: enableNormal,
        enableIncognito: enableIncognito
      });
    });
  }
});

function updateBadgeText(count) {
  const badgeText = count > 0 ? count.toString() : '';
  chrome.browserAction.setBadgeText({ text: badgeText });
}
