const click = (selector) => {
  document.querySelectorAll(selector).forEach(el => { el.click() })
}

const toggleSidePanel = () => {
  // desktop
  //document.querySelectorAll('.z-\\[21\\]').forEach(el => {
  document.querySelectorAll('.z-21').forEach(el => {
    el.style.display = el.style.display == 'none' ? 'block' : 'none';
  });

  // mobile
  click('[data-testid=open-sidebar-button]')

  document.body.style.pointerEvents = 'unset';
}

// ctrl+k - search panel
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && ['Л', 'л'].includes(e.key)) {
    e.preventDefault();
    const options = { key: 'k', code: 'KeyK', ctrlKey: true,  bubbles: true,  cancelable: true }
    document.dispatchEvent(new KeyboardEvent('keydown', options));
  }
});

// ctrl+b - toggle sidepanel
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && ['B', 'b', 'И', 'и'].includes(e.key)) {
    e.preventDefault();
    toggleSidePanel();
  }
});

// ctrl+enter - send
document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.key === 'Enter') {
    const btn = document.querySelectorAll('button[data-testid=send-button]')?.[0]
    if (btn) {
      btn.click();
      e.preventDefault();
      e.stopPropagation()
    }
  }
});  

/*
 ctrl+q - test. TBD require permissions "tabs", "activeTab"
document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.key === 'q') {
    chrome.runtime.sendMessage({ action: "getActiveTab" }, (response) => {
      console.log(response)
    });
  }
});
*/  

// toggle sidepanel on: ctrl+click
document.body.addEventListener('click', function (e) {
  e.ctrlKey && toggleSidePanel();
});

// toggle sidepanel on: middle-button
document.body.addEventListener('mouseup', function (e) {
  e.button == 1 && toggleSidePanel();
});
