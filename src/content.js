const toggleSidePanel = () => {
  // desktop
  document.querySelectorAll('.z-\\[21\\]')?.forEach(el => {
    el.style.display = el.style.display == 'none' ? 'block' : 'none';
  });
  // mobile
  //document.querySelectorAll('div[role=dialog]')?.forEach(el => {
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


// TBD ctrl+enter
document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault(); // Предотвращаем стандартное действие
    alert('Ctrl + Enter обработан!');
  }
});

//setTimeout(toggleSidePanel, 200)