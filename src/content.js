const toggleSidePanel = () => {
  // desktop
  document.querySelectorAll('.z-\\[21\\]')?.forEach(el => {
    el.style.display = el.style.display == 'none' ? 'block' : 'none';
  });
  // mobile
  //document.querySelectorAll('div[role=dialog]')?.forEach?.(el => {
  //  el.style.display = el.style.display == 'none' ? 'block' : 'none';
  //});
}

// ctrl+k
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && ['K', 'k', 'Л', 'л'].includes(e.key)) {
    e.preventDefault();
  }
});

// ctrl+b
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
}, true);

setTimeout(toggleSidePanel, 200)