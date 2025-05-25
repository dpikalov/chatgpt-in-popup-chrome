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

// toggle sidepanel on: ctrl+click
document.body.addEventListener('click', function (e) {
  e.ctrlKey && toggleSidePanel();
});

// toggle sidepanel on: middle-button
document.body.addEventListener('mouseup', function (e) {
  e.button == 1 && toggleSidePanel();
});
