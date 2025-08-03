// popup.js

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle");
  const count = document.getElementById("count");
  const popupSite = document.getElementById("popupSite");
  const addPopupBtn = document.getElementById("addPopupBtn");
  const popupMsg = document.getElementById("popupMsg");
  const popupList = document.getElementById("popupList");
  const downloadSite = document.getElementById("downloadSite");
  const addDownloadBtn = document.getElementById("addDownloadBtn");
  const downloadMsg = document.getElementById("downloadMsg");
  const downloadList = document.getElementById("downloadList");

  chrome.storage.local.get(["enabled", "blockCount"], res => {
    toggle.checked = res.enabled ?? true;
    count.textContent = `Blocked: ${res.blockCount ?? 0}`;
  });

  toggle.addEventListener("change", () => {
    chrome.storage.local.set({ enabled: toggle.checked });
  });

  function showBubble(msgEl) {
    msgEl.innerHTML = '<span class="bubble">✔</span>';
    setTimeout(() => msgEl.innerHTML = '', 1500);
  }

  function addItemToList(text, list, storageKey, msgEl) {
    const li = document.createElement("li");
    li.textContent = text;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.style.marginLeft = "10px";
    btn.addEventListener("click", () => {
      chrome.storage.local.get(storageKey, res => {
        const filtered = (res[storageKey] || []).filter(item => item !== text);
        chrome.storage.local.set({ [storageKey]: filtered }, () => {
          list.removeChild(li);
        });
      });
    });
    li.appendChild(btn);
    list.appendChild(li);
  }

  function updateList(list, storageKey) {
    chrome.storage.local.get(storageKey, res => {
      (res[storageKey] || []).forEach(site => {
        addItemToList(site, list, storageKey);
      });
    });
  }

  addPopupBtn.addEventListener("click", () => {
    const site = popupSite.value.trim();
    if (!site) return;
    chrome.storage.local.get("popupSites", res => {
      const updated = [...(res.popupSites || []), site];
      chrome.storage.local.set({ popupSites: updated }, () => {
        addItemToList(site, popupList, "popupSites", popupMsg);
        popupSite.value = "";
        showBubble(popupMsg);
      });
    });
  });

  addDownloadBtn.addEventListener("click", () => {
    const site = downloadSite.value.trim();
    if (!site) return;
    chrome.storage.local.get("downloadSites", res => {
      const updated = [...(res.downloadSites || []), site];
      chrome.storage.local.set({ downloadSites: updated }, () => {
        addItemToList(site, downloadList, "downloadSites", downloadMsg);
        downloadSite.value = "";
        showBubble(downloadMsg);
      });
    });
  });

  updateList(popupList, "popupSites");
  updateList(downloadList, "downloadSites");
});