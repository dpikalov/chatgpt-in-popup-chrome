/*
document.addEventListener('DOMContentLoaded', function () {
  const loc = document.getElementById('frame').contentWindow.location

  chrome.storage.local.get('chatgpt_href', function (result) {
    const href = result.chatgpt_href;
    if (href) {
      //loc.href = url
      //loc.pathname = new URL(url).pathname
    }
  });

  setInterval(() => {
    const href = loc.href
    chrome.storage.local.set({ 'chatgpt_href': href }, function () {
    });
  }, 1000)

});
*/