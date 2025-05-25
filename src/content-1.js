const loadScript = (url) => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(url);
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

loadScript('content-inject.js')
