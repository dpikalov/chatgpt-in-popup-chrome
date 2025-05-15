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

  /*
  document.querySelectorAll('div[data-state=open].fixed').forEach(el => {
    el.style.display = el.style.display == 'none' ? 'block' : 'none';
  })

  document.querySelectorAll('div[data-state=open][role=dialog]').forEach(el => {
    el.style.display = el.style.display == 'none' ? 'block' : 'none';
  })
  */

  //document.querySelectorAll('div[data-state=open]').forEach(el => {
  //  el.style.display = wasHidden ? 'block' : 'none';
  //})

  //document.querySelectorAll('[data-testid=close-sidebar-button]').forEach(el => {
  //  wasHidden || click('[data-testid=close-sidebar-button]')
  //})

  //document.querySelectorAll('[data-testid=open-sidebar-button]').forEach(el => {
  //  wasHidden && el.click()
  //})

  //document.querySelectorAll('[data-state=open]').forEach(el => {
    //el.remove()
  //  el.e.setAttribute('data-state', 'closed')
  //})

  //document.querySelectorAll('[data-state=closed]').forEach(el => {
    //el.remove()
  //  el.e.setAttribute('data-state', 'open')
  //})

  document.body.style.pointerEvents = 'unset';

  //document.querySelectorAll('nav')?.forEach?.(el => {
  //  el.style.display = el.style.display == 'none' ? 'block' : 'none';
  //});
}

// ctrl+k
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && ['K', 'k', 'Л', 'л'].includes(e.key)) {
    e.preventDefault();
  }
});

// toggle sidepanel on: ctrl+b
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && ['B', 'b', 'И', 'и'].includes(e.key)) {
    e.preventDefault();
    toggleSidePanel();
  }
});

// ctrl+enter
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

// toggle sidepanel on: ctrl + click on main
//document.getElementsByTagName('main')[0]?.addEventListener('click', function (e) {
document.body.addEventListener('click', function (e) {
  e.ctrlKey && toggleSidePanel();
});

//
const loadScript = (url) => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(url);
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

loadScript('content-inject.js')
