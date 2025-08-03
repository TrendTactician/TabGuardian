
let blockCount = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true, blockCount: 0 });
});

chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
  chrome.storage.local.get(["enabled", "popupSites"], (res) => {
    if (!res.enabled) return;
    const openerTabId = details.sourceTabId;
    chrome.tabs.get(openerTabId, (tab) => {
      const popupSites = res.popupSites || [];
      const matched = popupSites.some((site) => tab.url.includes(site));
      if (matched) {
        chrome.tabs.remove(details.tabId);
        blockCount++;
        chrome.storage.local.set({ blockCount });
      }
    });
  });
});

chrome.downloads.onCreated.addListener((downloadItem) => {
  chrome.storage.local.get(["enabled", "downloadSites"], (res) => {
    if (!res.enabled) return;
    const downloadSites = res.downloadSites || [];
    const matched = downloadSites.some((site) => downloadItem.finalUrl.includes(site));
    if (matched) {
      chrome.downloads.cancel(downloadItem.id);
      blockCount++;
      chrome.storage.local.set({ blockCount });
    }
  });
});
