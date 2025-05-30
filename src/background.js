﻿chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getActiveTab") {
    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        sendResponse({ url: tabs[0].url, title: tabs[0].title });
      } else {
        sendResponse({ error: "No active tab found" });
      }
    });
    return true; // Required to use sendResponse asynchronously
  }
});
