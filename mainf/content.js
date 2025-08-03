
(function() {
    const originalWindowOpen = window.open;
    window.open = function(...args) {
      console.warn("Blocked window.open attempt:", args);
      return null;
    };
  })();
  