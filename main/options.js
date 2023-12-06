// options.js
document.addEventListener('DOMContentLoaded', function () {
  const enableNormalCheckbox = document.getElementById('enableNormal');
  const enableIncognitoCheckbox = document.getElementById('enableIncognito');

  enableNormalCheckbox.addEventListener('change', function () {
    chrome.storage.sync.set({ enableNormal: enableNormalCheckbox.checked });
  });

  enableIncognitoCheckbox.addEventListener('change', function () {
    chrome.storage.sync.set({ enableIncognito: enableIncognitoCheckbox.checked });
  });

  chrome.storage.sync.get(['enableNormal', 'enableIncognito'], function (result) {
    enableNormalCheckbox.checked = result.enableNormal !== false;
    enableIncognitoCheckbox.checked = result.enableIncognito !== false;
  });
});
